# Claude Code — Project Context

> Auto-loaded by Claude Code at session start. Single source of truth for "what is this repo and what's the current state."

## What this is

**CryptoTrader Pro** — MiCAR-licensing-free read-only crypto portfolio aggregation SaaS. Operator: **Thomas Michalik, OptiRisk Consulting e.U., Vienna** (Phase 1 → CryptoTrader Pro GmbH/FlexCo at €10k revenue).

Live legacy site: [cryptotraderpro.io](https://cryptotraderpro.io) — fee calculator built on React 19 + Vite, lives in `apps/marketing/` and stays online. The Next.js dashboard in `apps/web/` will replace it post-launch.

## The four USP pillars (all four must be served by every sprint)

1. **Austrian Tax Engine** — ÖkoStRefG-2022-konform FIFO, Altbestand-vs-Neubestand cutoff, FinanzOnline-export. Beats Koinly's generic output.
2. **Universal Aggregation** — CEX + DEX + DeFi + Staking + LP + **NFT** in one EUR-denominated view. Briefing §14 originally excluded NFTs — operator override 2026-05-25 added them back.
3. **Active Intelligence** — Whale-alerts filtered to held assets, KOL-sentiment, rug-warnings. Pro-active, not display-only.
4. **AI Coach Trade Journal** — Claude Haiku reflects on user's own trade behavior (MiCAR-safe: reflection, not advice).

## Current state (2026-05-25)

- **Sprint 1 (Foundation) is code-complete and verified.** `pnpm install` succeeds, `pnpm db:up` brings Postgres+Redis up healthy, `prisma migrate dev` applies the init migration, NestJS boots on :3001, `GET /health` returns `{"status":"ok","db":"up","redis":"up"}`.
- **PR #1 open** at https://github.com/tom454647/cryptotraderpro/pull/1 — Sprint 1 + visual identity + 4 ADRs. Squash-merge is recommended.
- **Sprint 2 not yet started** — depends on user finishing vendor account setup (see "Pending user actions" below).

## Stack

- Monorepo: Turborepo + pnpm workspaces
- Backend: NestJS 10 (port 3001), Prisma 7.8 (Rust-free, uses @prisma/adapter-pg), Postgres 16, Redis 7
- Frontend: Next.js 15 App Router + React 19 + Tailwind v4 (OKLCH spectrum tokens) + Geist sans/mono via next/font
- Legacy: Vite SPA on cryptotraderpro.io
- Hosting target: Railway (API, EU-Frankfurt) + Vercel (Web, EU-Edge)
- Node version: 24 (.nvmrc says 20 but Prisma 7 supports 24 — leave as-is)

## Architecture decisions (binding — read before changing related code)

Living in `docs/ARCHITECTURE.md` (10 hardening decisions for 10k+ users) + `docs/decisions/`:

| ADR | Decision |
|-----|----------|
| 0001 | **Supabase Auth** (EU-Frankfurt) — not Clerk, not Better Auth |
| 0002 | **Stripe Tax automatic** — 0.5% fee accepted vs EU-MOSS engineering |
| 0003 | **GDPR: EU-only data residency** for every vendor handling PII |
| 0004 | **Claude-only LLM** (Haiku 4.5) — no multi-provider |

## MiCAR compliance — the load-bearing product constraint

**Operator directive (2026-05-25, restated):** CryptoTrader Pro must operate **without any crypto-asset-service-provider license**, indefinitely. License-free operation is not a phase — it is a **product feature**. Every sprint, every feature, every UI string is evaluated against this constraint first; functionality second. If a feature cannot be built MiCAR-safely, it does not ship.

### The five hard-coded invariants (DO NOT WEAKEN without legal review)

1. `Wallet.isWatchOnly` is always `true` — enforced at write time
2. `SafeExchangeClient` (Sprint 5) exposes only read methods; order methods throw `OrderExecutionBlockedException`
3. Exchange API keys validated as read-only on add + re-validated every 7 days
4. UI copy follows BRIEFING.md §3.3 — "Open in Binance" not "Trade now", "Alert konfigurieren" not "Auto-Trade aktivieren"
5. MiCAR disclaimer (see `packages/shared/src/disclaimers.ts`) is shown wherever portfolio or market data is rendered

### Sprint acceptance test (every sprint, before merge)

Before merging any sprint, the developer (or me) answers these out loud:

- [ ] Does this sprint introduce any code path that could be construed as: (a) executing an order on behalf of a user, (b) receiving and transmitting an order, (c) personalised investment advice, (d) custody of crypto-assets, or (e) automated portfolio management?
- [ ] Does the UI copy added in this sprint contain any imperative trade language ("buy", "sell now", "rebalance", "the best time")? Review with BRIEFING.md §3.3 forbidden-vs-allowed table.
- [ ] Are all external exchange/wallet interactions strictly read-only and validated as such?

If any answer is ambiguous, halt and consult counsel before merging.

## Conventions

- Package names: `@cryptotrader/api`, `@cryptotrader/web`, `@cryptotrader/legacy-marketing`, `@cryptotrader/shared`, `@cryptotrader/tax-engine`, `@cryptotrader/crypto-connectors`
- Docker container names: `refract-postgres`, `refract-redis` (kept as-is — internal only; renaming containers triggers a full volume recreate)
- DB name in Postgres: `cryptotrader`
- `.env.example` files at `apps/api/` and `apps/web/` are committed. Real `apps/api/.env` and `apps/web/.env.local` are git-ignored and live only on the operator's local disk.
- Affiliate IDs already in production: Binance `376216722`, Bybit `AYOLGJP`, MEXC `mexc-3nPe1`

## Brand & visual identity

- **Brand:** CryptoTrader Pro. A mid-day rebrand to "Refract" on 2026-05-25 was tried and reverted within hours. Commit history shows it as `f09ea25 → ed356ab`. Treat that as documented exploration, not regression.
- **Logo:** prism refracting one beam into four spectrum rays — `apps/web/components/brand-logo.tsx`. The metaphor visualises Universal-Aggregation: many sources, one clear view.
- **Typography:** Geist sans + Geist Mono via `next/font/google`. Self-hosted, no CDN.
- **Palette:** Tailwind v4 `@theme` tokens in `apps/web/app/globals.css` — dark-mode-first slate canvas + OKLCH spectrum (cyan → indigo → violet → magenta) used sparingly on logo, hero glow, wordmark accent.

## Pending user actions (blocks Sprint 2)

User has these accounts but needs to fill envs / activate features:

- [ ] **Supabase**: copy `service_role` key + JWT Secret into `apps/api/.env` (Dashboard → Project Settings → API)
- [ ] **Supabase**: confirm DB password is saved in password manager
- [ ] **Stripe**: copy `sk_test_*` into `apps/api/.env` (Dashboard → Developers → API keys → Reveal)
- [ ] **Stripe Tax**: activate at Settings → Tax → "Activate Stripe Tax" → Add registration Austria (VAT)
- [ ] **Sentry**: create two EU-region projects (`ctp-api` NestJS, `ctp-web` Next.js) → DSNs into respective `.env`
- [ ] **PostHog**: copy Project API Key from eu.posthog.com → `apps/web/.env.local`

Once those are in: Sprint 2 can start (Supabase Auth + Stripe 3-tier + Legal pages + Terms-Acceptance-Flow, est. ~4h focused work).

## Sprint roadmap

| # | Scope | Status |
|---|-------|--------|
| 1 | Foundation — monorepo, NestJS skeleton, Next.js skeleton, Prisma schema, docker-compose, `/health` | ✅ verified |
| 2 | Supabase Auth, Stripe (3 tiers + Tax), legal pages, terms-acceptance | pending vendor setup |
| 3 | EVM wallet connector (Alchemy, 6 chains), portfolio view + ProviderRouter | pending |
| 4 | Solana (Helius) + DeFi (Zerion) + NFT layer (Reservoir) | pending |
| 5 | CEX `SafeExchangeClient` + order-block + read-only validation | pending |
| 6 | Austrian tax engine (FIFO, KESt cutoffs, FinanzOnline export) | pending |
| 7 | Bridge compare (Li.Fi), DCA planner, affiliate deeplinks | pending |
| 8 | Alerts (whale + KOL + rug), AI-coach trade journal, Telegram bot | pending |

## How to verify Sprint 1 still works after any change

```powershell
# Bring up DB + cache
pnpm db:up

# Apply schema (idempotent — safe to re-run)
cd apps/api ; pnpm prisma migrate dev ; cd ../..

# Boot the API
pnpm --filter @cryptotrader/api dev
# In another shell:
curl http://localhost:3001/health
# Expect: {"status":"ok","db":"up","redis":"up","timestamp":"..."}
```

## Reading order for a fresh Claude Code session

1. This file (you're reading it)
2. `BRIEFING.md` — original code-session briefing v2.0 (the why)
3. `docs/ARCHITECTURE.md` — the 10 hardening decisions for 10k+ users
4. `docs/decisions/*.md` — the four resolved ADRs
5. `apps/api/prisma/schema.prisma` — data model
6. `README.md` — newcomer setup
