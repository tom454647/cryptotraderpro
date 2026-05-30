# Claude Code — Project Context

> Auto-loaded by Claude Code at session start. Single source of truth for "what is this repo and what's the current state."

## What this is

**CryptoTrader Pro** — MiCAR-licensing-free read-only crypto portfolio aggregation SaaS. Operator: **Thomas Michalik, OptiRisk Consulting e.U., Vienna** (Phase 1 → CryptoTrader Pro GmbH/FlexCo at €10k revenue).

Live legacy site: [cryptotraderpro.io](https://cryptotraderpro.io) — fee calculator built on React 19 + Vite, lives in `apps/marketing/` and stays online. The Next.js dashboard in `apps/web/` will replace it post-launch.

## The USP pillars — canonical (operator-locked 2026-05-29)

These are the BRIEFING §2 (pricing) + §3.2 (allowed actions) + sprint-plan features, **plus** the True-Cost fee comparison. The landing must communicate THESE — not improvised pain-points. "halt dich ans Briefing." Tier in brackets.

1. **True Cost** — exchange-fee comparison: advertised fee vs the *real* cost (fee + hidden spread + network/gas + withdrawal), compared across exchanges so "0% fee" never fools the user. The original cryptotraderpro.io hook; the fee engine already exists in the legacy Vite calculator (`apps/marketing`). Operator-confirmed as a kept USP 2026-05-29. [Free/Pro]
2. **Universal Aggregation** — CEX + DEX + DeFi + Staking + LP + **NFT** in one EUR view, with P&L per asset across all sources. NFT was excluded in BRIEFING §14 — operator override 2026-05-25 added it back. [§2 Pro]
3. **Austrian Tax Engine** — ÖkoStRefG-2022-konform FIFO, Altbestand-vs-Neubestand cutoff, KESt, FinanzOnline + Steuerberater export. [§2 Pro, Sprint 6]
4. **Bridge & DCA tools** — LiFi bridge-quote comparison (neutral, sortable), slippage simulator, DCA planner. All strictly passive-information + affiliate deeplink — "we show, you execute" (MiCAR-safe per §3.3). [§2 Pro, Sprint 7]
5. **Active Intelligence** — whale-alerts filtered to held assets, KOL-sentiment, rug-warnings. Pro-active, not display-only. [§2 Trader, Sprint 8]
6. **AI Coach Trade Journal** — Claude Haiku reflects on the user's own trade behaviour (MiCAR-safe: reflection, not advice). [§2 Trader, Sprint 8]

**Not USPs:** Transparent affiliate deeplinks = monetisation mechanism (disclosed, never ranked-by-payout). Read-only/MiCAR = business-model foundation + trust signal (see below). The BRIEFING §2 "True Cost"-widget (showing the user their share of OUR infra cost) is a separate trust feature, not pillar 1.

**Drift warning (2026-05-29):** earlier landing iterations invented pain-points and a "Why us" competitor comparison not grounded in the briefing, and omitted Bridge/DCA/Slippage. Keep the landing's USP content tied to the six pillars above.

**Read-only / MiCAR is NOT a customer-acquisition USP** (operator call 2026-05-28). It is the *business-model foundation* (licence-free operation) and a *trust signal*. On the landing it appears only as a small mono trust-closer line ("Read-only, always. Your keys never leave your hands"), never as a hero line or a pain-point in the manifesto. Do not promote "we can't trade / keep every key" to a headline pillar — customers don't shop for it; they shop for True Cost, Aggregation, Tax, Active Intelligence, AI Coach. Read-only earns trust once they're already interested.

## Current state (2026-05-29)

- **Sprint 1 + 2 merged to `main`** (PRs #1 + #2; PR #1 was merged early at `896c011`, PR #2 brought the rest). main = full foundation + Sprint 2 + editorial landing.
- **Sprint 2 done (6/7).** Supabase Auth (JWKS guard, sign-in/up, accept-terms), Sentry (BE+FE, EU), PostHog (FE, EU), legal pages, terms-acceptance flow, static pricing. **2.7 Stripe deferred** — waiting on operator to activate Stripe Tax.
- **Landing** is the Vienna-editorial direction, USPs tied to the canonical six (see above). Live-checkable at `localhost:3000` after `pnpm --filter @cryptotrader/web dev`.
- **Sprint 3 in progress on branch `feat/sprint-3-evm-wallets`:**
  - 3.1 WalletModule ✅ (CRUD, isWatchOnly forced, viem address validation, /api/wallets routes verified 401-guarded)
  - 3.2 AlchemyService + ProviderRouter — NOT started
  - 3.3 CoinGeckoService + PositionService — NOT started
  - 3.4 Dashboard /wallets + /portfolio — NOT started
- **Blocks 3.2/3.3 live test:** operator needs `ALCHEMY_API_KEY` (alchemy.com free) + `COINGECKO_API_KEY` (coingecko.com demo) in `apps/api/.env`. Skeleton can be built without; live data needs them.
- Env already filled: Supabase (url/anon/service_role/JWKS), Stripe `sk_test_*` + `pk_test_*`, Sentry EU DSNs (BE+FE), PostHog EU key, ENCRYPTION_KEY. Supabase webhook secret + Stripe price IDs come during their sprints.

## Stack

- Monorepo: Turborepo + pnpm workspaces
- Backend: NestJS 10 (port 3001), Prisma 7.8 (Rust-free, uses @prisma/adapter-pg), Postgres 16, Redis 7
- Frontend: Next.js 16 App Router + React 19 + Tailwind v4 (OKLCH editorial tokens) + Instrument Serif / Onest / IBM Plex Mono via next/font
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

## Brand & visual identity — Vienna Editorial (binding)

**Brand:** CryptoTrader Pro. A mid-day rebrand to "Refract" on 2026-05-25 was tried and reverted within hours. Commit history shows it as `f09ea25 → ed356ab`. Treat that as documented exploration, not regression.

**Visual identity is non-negotiable.** The operator validated the editorial direction in commit `4bf18f5` after explicitly rejecting the earlier Geist+spectrum-gradient look as "AI-generated generic". Future sprints must extend this direction; not drift back toward Vercel-template SaaS aesthetics.

### Direction: Vienna editorial, not Vercel-AI-SaaS

| Layer | Decision | Lives in |
|-------|----------|----------|
| Display headline | **Instrument Serif** (italic available, used as a signature hook) | `apps/web/app/layout.tsx` via next/font/google |
| Body sans | **Onest** (OFL, distinct from Geist/Inter shape) | same |
| Mono / labels | **IBM Plex Mono** | same |
| Canvas | Warm charcoal `oklch(0.13 0.012 50)` (brown undertone, NOT cold slate-950) | `globals.css` `--color-canvas` |
| Text | Cream `oklch(0.95 0.014 70)` (a hair off pure white, reads like paper) | `--color-ink` |
| Single saturated accent | **Burgundy** `oklch(0.48 0.14 25)` — used very sparingly on key CTAs + the headline italic span | `--color-accent` |
| Spectrum (cyan→indigo→violet→magenta) | **Retired entirely** as of 2026-05-25 (Sprint 2.2). The logo's rays are now monochrome currentColor. Tokens left commented in `globals.css` as historical reference. | n/a |

### Hard rules — do not break without operator sign-off

1. **No spectrum gradient anywhere.** That single move is the most-overused AI-design tell. The Refract day used it on body text; the editorial reset killed it there; Sprint 2.2 pulled the last remnant from the logo rays. The brand is single-accent (burgundy + cream + warm charcoal) — full stop.
2. **No "centred hero with two rounded-md buttons" trope.** Layouts are asymmetric — 8/4 magazine grid, left-aligned, with a mono editorial sidebar where appropriate.
3. **No `rounded-full border px-3 py-1 uppercase tracking-widest` chips.** Use plain editorial labels in IBM Plex Mono ("VIENNA · EST. 2026 · ISSUE 01") — letterspacing 0.18em, no border.
4. **No Lucide-icon decoration on the landing.** Numbering uses editorial style ("01 — Aggregation"), not icon-headed cards.
5. **Geist is forbidden** as a brand surface font. Tooling configs and dev tools may use system mono.
6. **Headlines are opinionated.** Not benefit-bullets, not "Your X, [gradient]Y[/gradient]" templates. Examples we like: "Read your crypto. We won't trade it for you." Examples we don't: "The best way to track your crypto."
7. **The Vienna/OptiRisk persona is named** somewhere visible on every public page (footer minimum).
8. **MiCAR-licence-free posture is named as the product**, not as a footnote. Header copy "We read. You decide. The licence-free posture is the product." captures the tone.

### Reference comparators we aspire toward (not Vercel)

- [Plain](https://plain.com) — single-accent editorial discipline
- [Linear](https://linear.app) — dark editorial with restraint
- [Fathom Analytics](https://usefathom.com) — strong typographic confidence
- [Cron / Notion Calendar](https://cron.com) — Display-headline confidence

### Reference comparators we explicitly reject

- Default Vercel `v0` outputs
- Cookie-cutter Tailwind starter "centred hero + gradient text + chip"
- Cyan/indigo/violet/magenta as a body-text brand-statement

### Pending visual refinements (backlog — fold into the named sprints)

- [x] Logo-rays monochrome variant — ✅ shipped 2026-05-25 in Sprint 2.2 (commit pending). Spectrum tokens commented in globals.css for historical reference; rays now use currentColor.
- [ ] Hero-side concrete asset (a small ASCII portfolio statement in IBM Plex Mono, or a thin line-graph) so the hero proves rather than asserts. Sprint 2.6 candidate.
- [ ] Sign-in / sign-up — currently render the Supabase Auth-UI in its default indigo theme. Re-skin to burgundy + Instrument Serif heading. Sprint 2.2 or 2.5 candidate.
- [ ] Dashboard-preview component on the landing — a real Editorial-styled portfolio-aggregation card as the hero proof. Sprint 3 deliverable once we have real aggregation data flowing.
- [ ] Headlines + body copy are still placeholder. Operator will iterate copy separately. Don't lock the wording, lock the **structure** and **visual language**.

## Pending user actions

Done: Supabase (url/anon/service_role/JWKS), Stripe `sk_test_*`+`pk_test_*`, Sentry EU DSNs (BE+FE), PostHog EU key, ENCRYPTION_KEY — all in `apps/api/.env` / `apps/web/.env.local`.

Open, blocks specific sprints:
- [ ] **Alchemy API key** (free, alchemy.com) → `ALCHEMY_API_KEY` — blocks Sprint 3.2/3.3 live test
- [ ] **CoinGecko demo key** (free, coingecko.com/en/api) → `COINGECKO_API_KEY` — blocks Sprint 3.3 live test
- [ ] **Stripe Tax** activation (Settings → Tax → Activate → registration Austria/VAT) — blocks Sprint 2.7 Stripe
- [ ] Helius (Solana) — Sprint 4; Reservoir (NFT) — Sprint 4; Whale Alert + Twitter/X + Resend + Anthropic — Sprint 8

## Sprint roadmap

| # | Scope | Status |
|---|-------|--------|
| 1 | Foundation — monorepo, NestJS skeleton, Next.js skeleton, Prisma schema, docker-compose, `/health` | ✅ merged |
| 2 | Supabase Auth, legal pages, terms-acceptance, static pricing (2.7 Stripe deferred — Tax) | ✅ merged (6/7) |
| 3 | EVM wallet connector (Alchemy, 6 chains), portfolio view + ProviderRouter | 🔨 in progress (3.1 done) |
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
