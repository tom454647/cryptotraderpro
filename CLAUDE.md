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
| Spectrum (cyan→indigo→violet→magenta) | **Quoted exactly once**, inside the four refracted rays of the brand logo. Nowhere else. | `--logo-ray-1..4` in `globals.css` |

### Hard rules — do not break without operator sign-off

1. **No spectrum gradient on body text, headlines, or CTAs.** That single move is the most-overused AI-design tell. The Refract day used it; the editorial reset killed it. Only the logo rays carry it now, and that's the brand quote.
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

- [ ] Logo-rays monochrome variant — the four-colour spectrum is the last AI-tell on the page. Sprint 2.2 candidate.
- [ ] Hero-side concrete asset (a small ASCII portfolio statement in IBM Plex Mono, or a thin line-graph) so the hero proves rather than asserts. Sprint 2.6 candidate.
- [ ] Sign-in / sign-up — currently render the Supabase Auth-UI in its default indigo theme. Re-skin to burgundy + Instrument Serif heading. Sprint 2.2 or 2.5 candidate.
- [ ] Dashboard-preview component on the landing — a real Editorial-styled portfolio-aggregation card as the hero proof. Sprint 3 deliverable once we have real aggregation data flowing.
- [ ] Headlines + body copy are still placeholder. Operator will iterate copy separately. Don't lock the wording, lock the **structure** and **visual language**.

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
