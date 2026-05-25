# Refract — Architecture Decisions for 10k+ Users

> Companion to [BRIEFING.md](../BRIEFING.md). The briefing describes **what** Refract does; this file describes **how** the stack stays correct, fast, and cheap once we move past a handful of early users.

**Author:** Thomas + Claude · **Date:** 2026-05-25 · **Status:** Living document, edited per sprint.

---

## 0. Why this exists

The briefing assumes a vanilla NestJS + Next.js + Postgres + Redis stack. That gets us to launch. It does not survive a Reddit/HN spike or 10k active users without three classes of pain:

1. **Provider blow-ups** — Alchemy or CoinGecko throttles us at the worst moment.
2. **Database contention** — every portfolio view re-aggregates millions of positions live.
3. **Operational blindness** — without proper observability we won't know which of the above is hurting us when a paying user complains.

The decisions below pre-empt all three. Each one names the sprint it lands in, so we don't try to build everything at once.

---

## 1. Multi-provider failover

**Decision:** Every external data source has at least two providers behind a `ProviderRouter` class. The router scores providers by health (last-response latency, last-error-time, quota-remaining) and picks the cheapest healthy one. On error, it falls through.

**Sources & fallbacks:**

| Domain | Primary | Secondary | Tertiary |
|--------|---------|-----------|----------|
| EVM RPC + balances | Alchemy | QuickNode | Infura |
| Solana RPC | Helius | Triton | Public RPC pool |
| Token prices | CoinGecko Pro | CoinMarketCap | CryptoCompare |
| DeFi positions | Zerion | DeBank | Moralis |
| Whale alerts | Whale Alert | Arkham (Phase 2) | — |

**Why:** Single-provider outages happen — Alchemy went down for 4h in Aug 2025. We cannot tell a paying user "come back later." Also, **rate-limit arbitrage**: when one provider's per-key bucket is exhausted, we spill to the next instead of queuing.

**How:** `packages/crypto-connectors/src/router.ts` — see Sprint 3. Provider config in `infra/providers.config.ts`, hot-reloadable from a Postgres `provider_config` table so we can disable a misbehaving provider without a redeploy.

**Sprint:** Foundation in Sprint 3, fanned out as each provider class is added.

---

## 2. Caching layers (no 1:1 RPC pass-through)

**Decision:** The API never forwards a user request to an external provider in real time. Every read goes through Redis.

**The four Redis layers:**

| Layer | TTL | Example keys | Sprint |
|-------|-----|-------------|--------|
| L1 — API response | 60 s | `portfolio:{userId}:view`, `tax:{userId}:{year}` | 3 |
| L2 — Provider response | 5–15 min | `alchemy:balances:{chain}:{address}` | 3 |
| L3 — Pricing | 60 s | `price:{coingeckoId}:eur` | 3 |
| L4 — Token metadata | 7–30 d | `meta:{chain}:{contract}` | 3 |

**Stampede protection:** `redis-semaphore` package. On a cache miss, the first request acquires a lock and populates; concurrent requests wait on the lock instead of all hitting the provider.

**Invalidation:** Bull workers push fresh data to L2 and L3 on their schedule; L1 expires naturally. L4 is never invalidated, only refreshed on lookup-miss.

**Math at 10k users:** 10k × 5-min Pro/Trader sync = 33 req/s against Alchemy. Bare. With L2 hit-rate ~85% (realistic — same wallets, same chains, same tokens), it drops to ~5 req/s against the actual API. That keeps us inside the $99/mo Alchemy Growth tier instead of pushing into Scale.

---

## 3. Database posture for 10k+ users

**Decision:** Postgres on Railway, with the following structural commitments from day one:

- **Connection pooling via PgBouncer** sidecar. Prisma's internal pool tops out around 30 connections — too few once we scale workers. PgBouncer (transaction pooling) lets us run hundreds of logical clients on tens of physical Postgres connections.
- **Read-replica** for analytics + dashboard reads. Writes go to primary; portfolio aggregation queries hit the replica. Railway supports this without code change beyond a second `DATABASE_URL_READ`.
- **Partition the `Transaction` table** by `(userId)` modulo 16 once it crosses 5M rows. Prisma supports partitioned-parent declarations from 5.18+. We design the schema partition-aware from the start (no late ALTER TABLE on a hot table).
- **Indexes** as declared in `schema.prisma`. Plus we add three composite indexes during Sprint 6: `(userId, asset, timestamp)`, `(userId, type, timestamp)`, `(walletId, asset)`.
- **Materialized views** for two hot reads: `mv_portfolio_total_per_user`, `mv_open_lots_per_user`. Refreshed every 5 min via worker. Cheap reads for the dashboard hero numbers.

**Why:** At 10k users with avg 200 transactions/year imported (low estimate for active traders), the `Transaction` table reaches 2M rows in year one. Without indexes + partitioning the tax engine takes 30 s+ per user. With them, sub-second.

**Sprint:** Pool + read-replica in Sprint 6 (tax engine is the first heavy reader). Partitioning + MVs scheduled for after first 1k users — premature otherwise.

---

## 4. Workers, queues, horizontal scale

**Decision:** BullMQ workers run in a **dedicated container** on Railway, separate from the API. The API enqueues; the worker process consumes. Scale them independently.

**Queues:**

- `wallet-sync` — every 5 min for Pro/Trader, every 30 min for Free
- `exchange-sync` — same cadence
- `price-update` — every 1 min for held assets, on-demand for tax recalc
- `tax-recalc` — nightly per user
- `sentiment-aggregate` — every 15 min, batches 50 tweets per Claude Haiku call
- `whale-poll` — every 2 min, filtered against the holdings join table

**Concurrency:** Each queue has a per-worker concurrency cap (`wallet-sync`: 10, `price-update`: 50, etc.) and a per-provider Bottleneck token bucket so we never DoS Alchemy from our own side.

**Job idempotency:** Every job carries a `(userId, scope, runId)` key. Re-runs hit `INSERT ... ON CONFLICT DO NOTHING`. Crash-resume is safe.

**Priority:** BullMQ priority queue — Pro/Trader user jobs preempt Free. Important for retention.

**Sprint:** Sprint 3 introduces the first worker; horizontal-scaling config (multi-instance) in Sprint 5 once we have actual concurrent load to test against.

---

## 5. Observability

**Decision:** Three telemetry pillars wired from day one. Painful to retrofit; cheap to start.

| Pillar | Tool | Plan | Sprint |
|--------|------|------|--------|
| Errors | Sentry | Free up to 5k errors/mo | 2 |
| Product analytics | PostHog (EU-hosted, self-hostable later) | Free up to 1M events/mo | 2 |
| Logs + traces | Better Stack (or Logflare) | Free up to 30d retention | 3 |
| Infra metrics | Grafana Cloud + Prometheus | Free tier covers ~10k metrics | 5 |
| Synthetic uptime | Better Stack Uptime | Free, EU pingers | 2 |

**Structured logging:** `nestjs-pino` with trace-ID propagation. Every log line carries `{ traceId, userId, sprint, deployId }`. Worker jobs propagate the trace ID into Bull jobs so a single user request can be followed from `/api/wallets/:id/sync` → BullMQ → `AlchemyService.getTokenBalances`.

**SLOs (informal at MVP, formal post-1k users):**
- API request p95 < 500 ms
- Worker job lag p95 < 2 min
- Provider error rate < 1% per provider per 24 h

---

## 6. Rate limiting + abuse protection

**Decision:** Three layers.

1. **Cloudflare in front of everything** — Vercel and Railway sit behind CF. CF gives us DDoS mitigation + bot management + WAF rules at zero cost.
2. **NestJS Throttler** per-user, per-tier: Free 30 req/min, Pro 300 req/min, Trader 1500 req/min. Burst of 2x allowed.
3. **Per-provider Bottleneck** inside the connector layer (see §4) — we never overrun the provider's limit, even if all our throttlers are open.

**Sprint:** Sprint 2 (Throttler), Sprint 3 (Bottleneck), Cloudflare DNS before first public deploy.

---

## 7. Secrets, encryption, audit

**Decision:** Keep the briefing's AES-256-GCM for exchange API keys, plus:

- **Encryption key rotation:** Annually, with a 30-day overlap window. New keys live in Railway secrets; old key stays around long enough to re-encrypt all rows.
- **AuditLog table** (not in briefing schema — add in Sprint 2). Every: wallet add/delete, exchange add/delete, settings change, terms acceptance, GDPR-export-or-delete request. Indexed on `(userId, createdAt)`, retained 7 years per Austrian record-keeping rules.
- **Gitleaks in CI** + **Renovate** for dep updates.
- **No customer credentials in error logs** — Sentry beforeSend hook strips `apiKeyEnc`, `apiSecretEnc`, and anything matching `/sk_(test|live)_/`.

---

## 8. Deployment + safety net

**Decision:**

- **GitHub Actions** runs `lint + typecheck + test` on every PR. Required to pass before merge.
- **Vercel preview deploys** per PR for `apps/web` and `apps/marketing` — links auto-posted in the PR.
- **Railway preview environments** per PR for `apps/api` — same idea, with a scratch Postgres branch per PR (Railway supports DB branching).
- **Migrations are run by the deploy pipeline**, not by app startup. `prisma migrate deploy` in a one-shot job before the new app version receives traffic. Failed migration = halted deploy, no half-rolled-out schema.
- **Feature flags** via PostHog (built-in). Lets us ship a worker but gate its job intake; lets us roll out the AI coach to 1% of Trader users before everyone.
- **Production data class isolation:** Postgres role per app, granted only the schemas it needs. Worker role gets `SELECT/INSERT/UPDATE` on holdings; not on `Subscription`.

**Sprint:** GHA + Vercel previews in Sprint 1 cleanup. Railway previews + migration job in Sprint 2.

---

## 9. Cost discipline

**Decision:** Two counters that run continuously.

1. **Per-user cost ledger** — every external call increments a row in `usage_event` (provider, units, estimated cost). Hourly worker rolls it up into `user_cost_daily`. Feeds the "True Cost" UI widget and the internal margin dashboard.
2. **Tier guardrails** — Free users get a hard quota (e.g. 1k Alchemy CU/day). If they exceed it, sync is paused with an "upgrade to refresh more often" message. Prevents one whale-wallet Free user from costing us $20/mo.

**Targets:**
- Pre-launch fixed infra: ~€180/mo (briefing §7)
- Per-Pro-user cost target: < €2/mo (≈ 20% gross margin floor before scale)
- Per-Trader-user cost target: < €6/mo (≈ 24%)

**Sprint:** Cost ledger in Sprint 3 (when we make our first paid provider call). Tier guardrails when we ship Free in Sprint 2.

---

## 10. NFT layer (added to scope 2026-05-25)

**Decision:** NFTs in scope from Sprint 4, despite BRIEFING §14 exclusion. Provider: **Reservoir** (free up to 10k requests/day, then $99/mo, EU-friendly TOS) for EVM. Solana NFTs via Helius DAS (same Solana provider, no new account).

**Schema:** Reuse the existing `Position` model with `protocolType = 'NFT'` and a new `NftMetadata` 1-to-1 side-table for image/collection/rarity. Avoids a separate NFT table and lets the tax engine treat NFTs as ordinary acquirable assets (correct under ÖkoStRefG).

**UI:** Dashboard gets an NFT row showing total collection count + collection-level value; clicking expands into a grid. Affiliate-deeplink to OpenSea/Magic Eden on each card.

**Sprint:** 4.

---

## 11. Architecture decisions resolved before Sprint 2

All four open questions from the original draft are now answered. ADRs are in `docs/decisions/`.

| # | Question | Decision | ADR |
|---|----------|----------|-----|
| 1 | Auth provider | **Supabase Auth** (EU-Frankfurt, free to 50k MAU, prebuilt UI, JWT-standard, self-hostable escape) — supersedes Clerk default | [0001](decisions/0001-auth-supabase.md) |
| 2 | Stripe Tax | **Automatic** — 0.5% fee accepted to skip the EU MOSS engineering | [0002](decisions/0002-stripe-tax-automatic.md) |
| 3 | GDPR residency | **EU-only across every vendor** that handles personal data; LLM + on-chain providers receive only anonymized/public data | [0003](decisions/0003-gdpr-eu-residency.md) |
| 4 | AI provider | **Claude-only** (Anthropic API is generally available, Haiku 4.5 pricing fits the cost model, multi-provider deferred) | [0004](decisions/0004-ai-claude-only.md) |

---

**End.** Each decision above lands as a concrete file or test in the sprint named at the bottom of its section. Nothing here is theoretical; everything is wired by Sprint 8.
