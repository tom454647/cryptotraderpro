# CryptoTrader Pro

MiCAR-licensing-free read-only crypto portfolio aggregation SaaS. Source of truth: [BRIEFING.md](./BRIEFING.md).

## Monorepo layout

```
cryptotrader-pro/
├── apps/
│   ├── api/         NestJS 10 backend (port 3001)
│   ├── web/         Next.js 15 app — dashboard (port 3000)
│   └── marketing/   Existing Vite SPA — live on cryptotraderpro.io (port 5173)
├── packages/
│   ├── shared/             Types, constants, MiCAR disclaimer texts
│   ├── tax-engine/         FIFO + Austrian KESt (full impl in Sprint 6)
│   └── crypto-connectors/  Read-only CEX/DEX adapters with hard order-block
├── docker-compose.yml      Postgres 16 + Redis 7 for local dev
├── BRIEFING.md             Code-Session-Briefing v2.0 (load-bearing for compliance)
└── turbo.json
```

## Prerequisites

- Node.js ≥ 20 LTS (check `.nvmrc`)
- pnpm ≥ 11
- Docker Desktop (for local Postgres + Redis)

## First-time setup

```powershell
# 1. Install dependencies for the whole monorepo
pnpm install

# 2. Bring up Postgres + Redis
pnpm db:up

# 3. Apply the Prisma schema to the local database
cd apps/api
cp .env.example .env
pnpm prisma migrate dev --name init
cd ../..

# 4. Run everything in parallel (api on 3001, web on 3000, marketing on 5173)
pnpm dev
```

## Health check

```powershell
curl http://localhost:3001/health
# → { "status": "ok", "db": "up", "redis": "up", "timestamp": "..." }
```

## Sprint roadmap

| Sprint | Scope | Status |
|--------|-------|--------|
| 1 | Foundation (this) — monorepo, NestJS skeleton, Next.js skeleton, Prisma schema, docker-compose, `/health` | in progress |
| 2 | Clerk auth, Stripe subscriptions (3 tiers), legal pages, terms-acceptance flow | pending |
| 3 | EVM wallet connector (Alchemy, 6 chains), portfolio view | pending |
| 4 | Solana (Helius) + DeFi positions (Zerion) | pending |
| 5 | CEX connectors with `SafeExchangeClient` + order-block + read-only validation | pending |
| 6 | Austrian tax engine (FIFO, KESt, regime cutoffs) | pending |
| 7 | Bridge compare (Li.Fi), DCA planner, affiliate deeplinks | pending |
| 8 | Alerts, KOL sentiment, trade journal, Telegram bot | pending |

## Compliance invariants

These are load-bearing for the MiCAR information-service classification — do not weaken without legal review:

1. `Wallet.isWatchOnly` is always `true`.
2. `SafeExchangeClient` exposes only read methods; order methods throw `OrderExecutionBlockedException` (see [packages/crypto-connectors](./packages/crypto-connectors)).
3. Every exchange API key is validated as read-only on add and re-validated every 7 days.
4. UI copy follows BRIEFING.md §3.3 (e.g., "Open in Binance", not "Trade now").
5. The MiCAR disclaimer (see [packages/shared/src/disclaimers.ts](./packages/shared/src/disclaimers.ts)) is shown wherever portfolio or market data is rendered.

## License

UNLICENSED — proprietary. Operated by OptiRisk Consulting e.U. (Vienna).
