# CryptoTrader Pro

> One clear view across every wallet, exchange, DeFi position and NFT — Austrian tax-ready, MiCAR-compliant, read-only by design.

**Status:** Pre-launch. Sprint 1 (Foundation) complete on branch `feat/monorepo-foundation`.
**Domain:** [cryptotraderpro.io](https://cryptotraderpro.io) (live legacy site under `apps/marketing`; Next.js dashboard will replace it post-launch).
**Operator:** OptiRisk Consulting e.U., Vienna (Phase 1) → CryptoTrader Pro GmbH/FlexCo (Phase 2, post-€10k revenue).

## Why CryptoTrader Pro

The crypto-tracking market is fragmented:
- **Debank/Zerion** show DeFi positions but miss CEX trades.
- **Koinly/CoinTracker** handle tax reports but lack Austrian KESt-specific rules and don't show live portfolio.
- **Nansen** is power-user-only and US-priced.
- All of them use the same generic tax export, none with Austrian Steuerberater-grade output.

CryptoTrader Pro merges every source — CEX, DEX, DeFi, staking, LPs, NFTs — into a single view, with four pillars no competitor combines:

| Pillar | What | Why it wins |
|--------|------|-------------|
| **Austrian Tax Engine** | ÖkoStRefG-2022-konform FIFO, Altbestand-vs-Neubestand, Stablecoin-flag, FinanzOnline-export | Koinly is generic; we are AT-native, premium-priced. |
| **Universal Aggregation** | One view: CEX + DEX + DeFi + Staking + LP + NFT, EUR-denominated PnL across all sources | Every competitor has blind spots. We don't. |
| **Active Intelligence** | Whale-alerts filtered to your holdings, KOL-sentiment, rug-warnings | Pro-active, not display-only. |
| **AI Coach Trade Journal** | Claude Haiku reflects on your trade behavior (MiCAR-safe: reflection, not advice) | Drives retention. No competitor has this. |

## Monorepo layout

```
cryptotrader-pro/
├── apps/
│   ├── api/         @cryptotrader/api          NestJS 10 backend         (port 3001)
│   ├── web/         @cryptotrader/web          Next.js 15 dashboard      (port 3000)
│   └── marketing/   @cryptotrader/marketing    Live Vite SPA on
│                                                cryptotraderpro.io       (port 5173)
├── packages/
│   ├── shared/             @cryptotrader/shared             MiCAR disclaimers, tier pricing
│   ├── tax-engine/         @cryptotrader/tax-engine         FIFO + Austrian KESt rules
│   └── crypto-connectors/  @cryptotrader/crypto-connectors  Read-only adapters + order block
├── docker-compose.yml      Postgres 16 + Redis 7
├── BRIEFING.md             Source-of-truth (Code-Session-Briefing v2.0)
├── docs/ARCHITECTURE.md    10 decision-records for 10k+ user scaling
└── docs/decisions/         ADRs (auth, payments tax, GDPR, AI)
```

## Prerequisites

- Node.js ≥ 20 LTS — see `.nvmrc`
- pnpm ≥ 11
- Docker Desktop (for local Postgres + Redis)

## First-time setup

```powershell
# 1. Install dependencies (whole monorepo)
pnpm install

# 2. Bring up Postgres + Redis
pnpm db:up

# 3. Apply the Prisma schema
cd apps/api
cp .env.example .env
pnpm prisma migrate dev --name init
cd ../..

# 4. Run api (3001) + web (3000) + marketing (5173) in parallel
pnpm dev
```

## Health check

```powershell
curl http://localhost:3001/health
# → { "status": "ok", "db": "up", "redis": "up", "timestamp": "..." }
```

## Brand & visual identity

- **Logo:** a prism refracting one beam into four spectrum rays — see [apps/web/components/brand-logo.tsx](./apps/web/components/brand-logo.tsx). The metaphor stands for the Universal-Aggregation pillar (many sources, one clear view).
- **Typography:** Geist sans + Geist Mono via `next/font/google` — self-hosted, no CLS.
- **Palette:** Tailwind v4 `@theme` tokens in [apps/web/app/globals.css](./apps/web/app/globals.css). Dark-mode-first slate canvas + four spectrum accents (cyan → indigo → violet → magenta).

## Compliance invariants

Load-bearing for the MiCAR information-service classification — do not weaken without legal review:

1. `Wallet.isWatchOnly` is always `true`.
2. `SafeExchangeClient` exposes only read methods; order methods throw `OrderExecutionBlockedException` (see [packages/crypto-connectors](./packages/crypto-connectors)).
3. Every exchange API key is validated as read-only on add and re-validated every 7 days.
4. UI copy follows BRIEFING.md §3.3 (e.g., "Open in Binance", not "Trade now").
5. The MiCAR disclaimer (see [packages/shared/src/disclaimers.ts](./packages/shared/src/disclaimers.ts)) is shown wherever portfolio or market data is rendered.

## Sprint roadmap

| Sprint | Scope | Status |
|--------|-------|--------|
| 1 | Foundation — monorepo, NestJS skeleton, Next.js skeleton, Prisma schema, docker-compose, `/health` | ✅ verified |
| 2 | Supabase Auth, Stripe subscriptions (3 tiers), legal pages, terms-acceptance flow | pending |
| 3 | EVM wallet connector (Alchemy, 6 chains), portfolio view | pending |
| 4 | Solana (Helius) + DeFi positions (Zerion) + NFT layer (Reservoir) | pending |
| 5 | CEX connectors with `SafeExchangeClient` + order-block + read-only validation | pending |
| 6 | Austrian tax engine (FIFO, KESt regime cutoffs, FinanzOnline export) | pending |
| 7 | Bridge compare (Li.Fi), DCA planner, affiliate deeplinks | pending |
| 8 | Alerts (whale + KOL + rug), AI-coach trade journal, Telegram bot | pending |

## License

UNLICENSED — proprietary. Operated by OptiRisk Consulting e.U. (Vienna).
