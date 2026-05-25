# CryptoTrader Pro — Code-Session-Briefing v2.0

> **🔄 Rename-Notice (2026-05-25):** Das Produkt wurde von "CryptoTrader Pro" zu **Refract** rebrandet — der Trader-Bezug widersprach der MiCAR-konformen Read-Only-Positionierung. Dieses Briefing bleibt unter dem ursprünglichen Namen als historisches Source-of-Truth-Dokument bestehen. Alle Code- und UI-Texte verwenden ab 2026-05-25 "Refract". Domain-Strategie: `refract.fi` (primär), `refract.app` (PWA), `cryptotraderpro.io` läuft als Legacy weiter bis Launch und wird dann 301-redirected. Brand-Details siehe README.md.

**Autor:** Thomas, OptiRisk Consulting e.U.
**Datum:** 15.05.2026
**Version:** 2.0 (MiCAR-lizenzfreier Scope)
**Zweck:** Selbstständig durchführbare Code-Session mit Claude Code zum Aufbau des MVP

---

## 0. Wichtigste Änderung gegenüber v1.0

Diese Version baut CryptoTrader Pro **vollständig MiCAR-lizenzfrei** unter folgendem rechtlichen Modell:

> "CryptoTrader Pro ist eine reine **Informations- und Hilfsdienstleistung** ohne CASP-Status. Wir aggregieren öffentlich zugängliche Wallet- und Exchange-Daten im Auftrag des Users, stellen Marktinformationen bereit, ermöglichen Steuer-Hilfsberechnungen und Trade-Dokumentation. Wir nehmen keine Orders entgegen, leiten keine Orders weiter, führen keine Orders aus, verwahren keine Assets, geben keine personalisierten Anlageempfehlungen und betreiben keine Handelsplattform."

Dieser Disclaimer wird in den AGB und in der UI sichtbar verankert.

**Konsequenz:** Smart-DCA-Auto-Execution entfällt. Alle aktiven Trading-Features werden als **passive Information + Deeplink** zur Exchange umgesetzt (User klickt selbst, schließt selbst ab). Wir verdienen an Subscription **und** an Exchange-Affiliate-Revenue-Share.

---

## 1. Strategische Entscheidungen (final)

### 1.1 Tech-Stack: TypeScript-Monorepo

| Layer | Technologie | Begründung |
|---|---|---|
| Backend | NestJS 10 + TypeScript | Modular, DI, Enterprise-ready |
| ORM | Prisma 5 | Type-safe, Migrationen |
| DB | PostgreSQL 16 | Transaktionen, JSONB |
| Cache/Queue | Redis 7 + BullMQ | Wallet-Syncs, Alerts |
| Frontend | Next.js 15 (App Router) + React 19 + Tailwind v4 + shadcn/ui | SSR, EU-Edge |
| Auth | Clerk | OAuth + SSO out-of-the-box |
| Payments | Stripe Subscriptions | EU-MwSt automatisch |
| Hosting Backend | Railway (EU/Frankfurt) | Postgres + Redis + Node in einem |
| Hosting Frontend | Vercel (EU/Frankfurt-Edge) | Next.js-Native |
| Monitoring | Sentry + PostHog | Errors + Product-Analytics |
| CI/CD | GitHub Actions | Standard |

### 1.2 Rechtsträger: gestufter Aufbau

**Phase 1 (Sprint 1 bis erste €10k Umsatz):**
- Betrieb über **OptiRisk Consulting e.U.**
- Eigene Kostenstelle "Digital Products – CryptoTrader Pro" in deiner Buchhaltung
- Eigenes Geschäftskonto bei Bank deiner Wahl (Konto-Trennung sauber führen)
- AGB, Datenschutzerklärung, Impressum im Namen der e.U.

**Phase 2 (ab €10k Umsatz oder spätestens Q4 2026 vor CAE-Rolle):**
- Gründung einer **CryptoTrader Pro GmbH** (Wien) oder **CryptoTrader Pro FlexCap** (FlexCo seit 2024, Mindeststammkapital €10k mit nur €5k bar)
- Asset-Transfer von e.U. zu GmbH (Domain, Code, Verträge, Stripe-Account)
- Du als Alleingesellschafter, **Geschäftsführer kann ein externer Treuhand-GF sein** falls Bank Austria Wohnbaubank Nebenbeschäftigungs-GF kritisch sieht
- Saubere Anzeige an Bank Austria Wohnbaubank (BWG §28a, Fit & Proper)

**Wichtig vor CAE-Rolle 01/2027:** Nebenbeschäftigungs-Erklärung schriftlich. CTP als GmbH-Gesellschaftsanteil ist regulatorisch entspannter als operative e.U.-Tätigkeit.

### 1.3 GitHub-Setup

Neues privates Repo `cryptotrader-pro`, Monorepo mit Turborepo.

---

## 2. Pricing-Modell

| Tier | Preis | Wallets | CEX-Konten | Features |
|---|---|---|---|---|
| Free | €0 | 1 | 1 | Basis-Portfolio-View, manueller Sync, kein Tax-Report, Watermark |
| Pro | **€9.90/Monat** oder **€99/Jahr** (-17%) | unlimited | 5 | Multi-Chain, P&L, AT-Steuer-Vorberechnung, Bridge-Comparison, Slippage-Simulator, Affiliate-Deeplinks |
| Trader | **€24.90/Monat** oder **€249/Jahr** (-17%) | unlimited | unlimited | + KOL-Sentiment, Whale-Alerts, Trade-Journal, Telegram-Bot, API-Zugriff |

**"True Cost"-Widget nach Login:**
Zeigt dem User seine anteiligen Infrastrukturkosten transparent (RPC-Calls × Preis, API-Calls × Preis, Server-Anteil). Marketing-Hook: "Wir verstecken nichts. So viel kostet dein Account uns wirklich."

**Zweiter Einkommensstrom: Affiliate-Revenue**
- Binance: 20–40% Trading-Fee-Share auf referrierte User (je nach Volumen-Tier)
- Bybit: bis 30%
- OKX, KuCoin, Bitpanda: 20–50%
- LiFi-Bridge: Integration-Partner-Fee auf Swaps
- WICHTIG: Affiliate-Links **immer transparent** kennzeichnen (DSGVO + Konsumentenschutz-Compliance)

---

## 3. MiCAR-Compliance-Architektur (zentraler Abschnitt)

### 3.1 Die fünf Verbotenen Aktionen

CryptoTrader Pro tut **NICHTS** von folgendem:

1. ❌ Order-Execution für den User (keine API-Calls die Orders platzieren)
2. ❌ Order-Reception-and-Transmission (keine "User gibt Order ein, wir leiten weiter")
3. ❌ Personalisierte Empfehlungen ("Du solltest XYZ kaufen weil...")
4. ❌ Custody von Assets (keine privaten Keys, keine Funds-Verwahrung)
5. ❌ Automatisches Portfolio-Management / Rebalancing

### 3.2 Die fünf Erlaubten Aktionen

1. ✅ **Read-Only-Aggregation:** API-Keys von Exchanges werden read-only validiert vor Speicherung. Wallet-Adressen sind public. Wir lesen, wir schreiben nicht.
2. ✅ **Information:** Marktdaten, Preise, Spreads, Slippage-Simulation, Bridge-Fees-Vergleich, On-Chain-Statistiken — alles als neutrale Information.
3. ✅ **Steuer-Hilfsleistung:** FIFO-Berechnung, Lot-Tracking, Report-Export. Klassische Buchhaltungs-Hilfe, nicht CASP.
4. ✅ **Affiliate-Deeplinks:** "Diese Bridge öffnen" → Link zu li.fi mit User-Parametern als URL. User klickt selbst und führt selbst aus. Wir kassieren Referral.
5. ✅ **Alerts & Notifications:** Telegram, Email, In-App — passive Information ohne Handlungsanweisung.

### 3.3 Sprachregeln im UI (kritisch!)

| ❌ Verboten | ✅ Erlaubt |
|---|---|
| "Wir empfehlen, XYZ zu kaufen" | "XYZ ist um 12% gestiegen in den letzten 24h" |
| "Du solltest jetzt rebalancen" | "Deine Allocation hat sich um 8% verschoben (Daten)" |
| "Bester Zeitpunkt zum Kaufen" | "Historische Volatilität dieser Stunde: niedrig" |
| "Auto-Trade aktivieren" | "Alert konfigurieren" |
| "Wir kaufen für dich" | "Zur Binance weiterleiten" |
| "Optimale DCA-Strategie" | "DCA-Planner — wähle deine Parameter" |
| "Diese Bridge ist die beste" | "Bridge-Vergleich — du entscheidest" |

**Disclaimer-Pflicht in jeder relevanten View:**
"Die hier dargestellten Informationen stellen keine Anlageberatung dar. CryptoTrader Pro ist kein lizenzierter Crypto-Asset Service Provider gemäß MiCAR. Alle Handelsentscheidungen treffen Sie eigenverantwortlich auf der jeweiligen Exchange/Plattform Ihrer Wahl."

### 3.4 AGB-Klauseln (musst du mit Anwalt finalisieren)

Mindestinhalt:
- Klare Definition "Information Society Service" (Disclaimer Anbieter ist kein CASP)
- Haftungsausschluss für Handelsentscheidungen des Users
- Read-Only-Zusage für API-Keys + Pflicht des Users, nur Read-Only-Keys einzugeben
- Affiliate-Disclosure (transparent)
- DSGVO-konforme Datenverarbeitung
- Gerichtsstand Wien, AT-Recht
- Widerrufsrecht 14 Tage für Subscriptions (mit Ausnahme bei begonnener digitaler Leistung mit Zustimmung)

**Vor Launch:** AGB-Review von EY Law (über NWT) oder spezialisiertem Krypto-Anwalt in Wien (z.B. Stadler Völkel, BPV Hügel). Kosten geschätzt €1.500–3.000.

---

## 4. Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Frontend (Vercel EU)                │
│  - Dashboard / Portfolio / Wallets / Settings / Pricing     │
│  - Affiliate-Deeplinks zu Exchanges & Bridges               │
│  - shadcn/ui + Tailwind + Recharts                          │
│  - "Open in Binance"-Buttons (NICHT "Trade now")            │
└────────────────────────┬────────────────────────────────────┘
                         │ tRPC / REST
┌────────────────────────▼────────────────────────────────────┐
│            NestJS API Backend (Railway EU)                   │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │ Auth     │ Portfolio│ Wallets  │ Exchanges│ Alerts    │ │
│  │ Module   │ Module   │ Module   │ Module   │ Module    │ │
│  │          │ (Read-   │ (Read-   │ (Read-   │ (Info)    │ │
│  │          │  Only)   │  Only)   │  Only)   │           │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │ Tax      │ Bridge   │ Sentiment│ Affiliate│ Billing   │ │
│  │ Engine   │ Compare  │ Module   │ Tracking │ (Stripe)  │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
│                                                              │
│  ❌ KEIN Order-Execution-Module                              │
│  ❌ KEIN Trading-Module                                      │
│  ❌ KEIN Custody-Module                                      │
└────┬────────────────┬─────────────────┬────────────────────┘
     │                │                  │
     ▼                ▼                  ▼
  Postgres        Redis (Cache       BullMQ Workers
  (Prisma)         + BullMQ)          - Wallet Sync (every 5min)
                                      - Price Update (every 1min)
                                      - Whale Alert Poll (every 2min)
                                      - Tax Recalc (nightly)
                                      - Sentiment Aggregation (every 15min)
     ▲                                  │
     │                                  │
     └──────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  External APIs    On-Chain RPC    LLM (Claude)
  - CoinGecko Pro  - Alchemy       - Sentiment-
  - CCXT (READ-    - QuickNode       Klassifikation
    ONLY-Mode)     - Solana RPC    - Journal-Coaching
  - Zerion API
  - DeBank API
  - LiFi (Read-API)
  - Whale Alert API
  - Stripe
```

**Kritisch:** Die CCXT-Library wird ausschließlich für `fetchBalance()`, `fetchTrades()`, `fetchClosedOrders()` etc. genutzt — NIEMALS für `createOrder()`. Wir bauen einen API-Layer der die Order-Methoden **explizit blockiert** (siehe Sprint 5).

---

## 5. Datenmodell (Prisma Schema)

```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  authProviderId String   @unique
  createdAt      DateTime @default(now())
  subscription   Subscription?
  wallets        Wallet[]
  exchanges      ExchangeAccount[]
  taxResidency   String   @default("AT")
  baseCurrency   String   @default("EUR")
  alerts         Alert[]
  journalEntries JournalEntry[]
  affiliateClicks AffiliateClick[]
  acceptedTermsAt DateTime?
  acceptedTermsVersion String?
}

model Subscription {
  id                  String   @id @default(cuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id])
  stripeCustomerId    String   @unique
  stripeSubscriptionId String  @unique
  tier                Tier
  status              String
  currentPeriodEnd    DateTime
}

enum Tier { FREE PRO TRADER }

model Wallet {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  address     String
  chain       Chain
  label       String?
  isWatchOnly Boolean  @default(true) // IMMER true, redundante Sicherheit
  positions   Position[]
  createdAt   DateTime @default(now())
  lastSync    DateTime?
  @@unique([userId, address, chain])
}

enum Chain { ETHEREUM BSC POLYGON ARBITRUM OPTIMISM BASE SOLANA AVALANCHE }

model ExchangeAccount {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  exchange     Exchange
  label        String
  apiKeyEnc    String   // AES-256-GCM verschlüsselt
  apiSecretEnc String
  readOnlyVerifiedAt DateTime  // wann haben wir verifiziert dass Key read-only ist
  permissionScopes   String[]  // exakte Scopes die der Key hat, aus Validation
  lastSync     DateTime?
  positions    Position[]
}

enum Exchange { BINANCE BYBIT KRAKEN COINBASE KUCOIN BITPANDA OKX }

model Position {
  id            String   @id @default(cuid())
  walletId      String?
  wallet        Wallet?  @relation(fields: [walletId], references: [id])
  exchangeId    String?
  exchange      ExchangeAccount? @relation(fields: [exchangeId], references: [id])
  asset         String
  amount        Decimal  @db.Decimal(36, 18)
  avgCostBasis  Decimal? @db.Decimal(36, 8)
  lastPriceEur  Decimal? @db.Decimal(36, 8)
  updatedAt     DateTime @updatedAt
  protocolType  ProtocolType?
  protocol      String?
}

enum ProtocolType { SPOT LP STAKED LENT BORROWED }

model Transaction {
  id           String   @id @default(cuid())
  userId       String
  source       String
  txHash       String?
  type         TxType
  asset        String
  amount       Decimal  @db.Decimal(36, 18)
  priceEur     Decimal  @db.Decimal(36, 8)
  feeEur       Decimal? @db.Decimal(36, 8)
  timestamp    DateTime
  raw          Json
  @@index([userId, timestamp])
  @@index([asset])
}

enum TxType { BUY SELL TRANSFER_IN TRANSFER_OUT SWAP STAKE_REWARD AIRDROP FEE }

model TaxLot {
  id              String   @id @default(cuid())
  userId          String
  asset           String
  acquiredAt      DateTime
  amount          Decimal  @db.Decimal(36, 18)
  costBasisEur    Decimal  @db.Decimal(36, 8)
  closedAt        DateTime?
  closingPriceEur Decimal? @db.Decimal(36, 8)
  realizedPnlEur  Decimal? @db.Decimal(36, 8)
  holdingDays     Int?
  @@index([userId, asset, acquiredAt])
}

model Alert {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      AlertType
  config    Json
  active    Boolean  @default(true)
  channel   String   @default("email")
  createdAt DateTime @default(now())
}

enum AlertType { PRICE WHALE_MOVE KOL_MENTION RUG_SIGNAL BRIDGE_OPPORTUNITY DCA_REMINDER }

model JournalEntry {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  txId        String?
  thesis      String?  @db.Text
  emotion     String?
  reviewedAt  DateTime?
  reviewNotes String?  @db.Text
  outcome     String?
  createdAt   DateTime @default(now())
}

model AffiliateClick {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  partner     String   // "binance", "bybit", "lifi", ...
  context     String   // "bridge_compare", "exchange_deeplink", "dca_planner"
  targetUrl   String
  asset       String?
  clickedAt   DateTime @default(now())
  @@index([userId])
  @@index([partner, clickedAt])
}
```

---

## 6. Repository-Struktur

```
cryptotrader-pro/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── wallets/        # READ-ONLY Multi-Chain
│   │   │   ├── exchanges/      # READ-ONLY CCXT-Wrapper mit Order-Block
│   │   │   ├── portfolio/      # Aggregation
│   │   │   ├── tax/            # AT-FIFO-Engine
│   │   │   ├── bridges/        # LiFi-Read-API + Deeplink-Builder
│   │   │   ├── affiliate/      # Click-Tracking + Deeplink-Generator
│   │   │   ├── alerts/         # Whale + Price + KOL
│   │   │   ├── sentiment/      # KOL-Aggregation via Claude
│   │   │   ├── journal/        # Trade-Journal
│   │   │   ├── billing/        # Stripe
│   │   │   ├── workers/        # BullMQ
│   │   │   ├── common/
│   │   │   │   ├── guards/
│   │   │   │   ├── filters/
│   │   │   │   └── decorators/
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   └── test/
│   └── web/                    # Next.js Frontend
│       ├── app/
│       │   ├── (auth)/
│       │   ├── (dashboard)/
│       │   │   ├── portfolio/
│       │   │   ├── wallets/
│       │   │   ├── exchanges/
│       │   │   ├── tax/
│       │   │   ├── alerts/
│       │   │   ├── journal/
│       │   │   ├── bridges/        # Compare-only
│       │   │   └── settings/
│       │   ├── (marketing)/
│       │   │   ├── pricing/
│       │   │   ├── legal/          # AGB, Datenschutz, Impressum
│       │   │   └── page.tsx
│       │   └── api/
│       ├── components/
│       │   ├── ui/                 # shadcn/ui
│       │   ├── disclaimers/        # MiCAR-Disclaimer-Components
│       │   └── affiliate/          # ExchangeDeeplink, BridgeDeeplink
│       └── lib/
├── packages/
│   ├── shared/                 # Types, Constants, Disclaimer-Texte
│   ├── crypto-connectors/      # CEX-Adapter (mit Order-Block!)
│   └── tax-engine/             # FIFO + AT-Rules
├── docker-compose.yml
├── turbo.json
├── package.json
├── BRIEFING.md                 # Diese Datei
└── README.md
```

---

## 7. API-Provider — Shortlist mit Pricing

| Service | Zweck | Free / Start | MVP-Setup |
|---|---|---|---|
| **Alchemy** | EVM-Chains RPC + Balances | Free 25M CU/mo | ✅ |
| **Helius** | Solana RPC | Free 100k/Tag | Phase 2 |
| **Zerion API** | DeFi-Positionen | $100/mo Start | ✅ |
| **CoinGecko Pro** | Preise + Historie | Demo gratis, dann $129/mo | ✅ |
| **CCXT** | CEX Read-Only-Adapter | gratis (npm) | ✅ |
| **LiFi API** | Bridge-Quote-Vergleich | Free (Read-Only) | ✅ |
| **Whale Alert API** | Whale-Transactions | $49/mo | Phase 2 |
| **Stripe** | Payments | 1.4% + €0.25 EU | ✅ |
| **Clerk** | Auth | Free bis 10k MAU | ✅ |
| **Sentry** | Error-Monitoring | Free bis 5k Errors | ✅ |
| **Anthropic API** | Claude Haiku Sentiment | $0.80/Mio Token | ✅ |
| **Railway** | Backend-Hosting EU | $5/mo + Usage | ✅ |
| **Vercel** | Frontend-Hosting EU | Free → $20/mo | ✅ |

**MVP-Infrastruktur-Fixkosten (vor Usern):** ~€180–250/Monat
**Break-even bei:** 25–30 zahlende Pro-User à €9.90

---

## 8. Pre-Session-Checkliste

### 8.1 Accounts anlegen

- [ ] GitHub: Privates Repo `cryptotrader-pro`
- [ ] Alchemy: alchemy.com → Free Tier
- [ ] Zerion: zerion.io/api → Key beantragen
- [ ] CoinGecko: Demo-Key
- [ ] LiFi: li.fi/developers
- [ ] Stripe: AT-Adresse, Test-Modus, Steuerinfo OptiRisk e.U.
- [ ] Clerk: Application "CryptoTrader Pro"
- [ ] Sentry: Projekt anlegen
- [ ] Anthropic API: console.anthropic.com
- [ ] Railway: EU-Region Frankfurt wählen
- [ ] Vercel: mit GitHub verbinden

### 8.2 Affiliate-Programme registrieren (kann parallel laufen)

- [ ] Binance Affiliate Program (binance.com/en/activity/affiliate)
- [ ] Bybit Affiliate
- [ ] OKX Affiliate
- [ ] KuCoin Affiliate
- [ ] Bitpanda Pro / Bitpanda Plus Partnerprogramm
- [ ] LiFi Partner-Integration anfragen

### 8.3 Lokales Setup

- [ ] Node.js 20 LTS
- [ ] pnpm: `npm install -g pnpm`
- [ ] Docker Desktop
- [ ] VS Code + Extensions (Prisma, ESLint, Tailwind)
- [ ] Git mit GitHub-Account
- [ ] Claude Code: `npm install -g @anthropic-ai/claude-code`

### 8.4 Rechtliche Vorbereitung (parallel zur Entwicklung)

- [ ] AGB-Entwurf bei spezialisiertem Anwalt anfragen (Stadler Völkel, BPV Hügel oder via NWT/EY Law) — Brief: "MiCAR-lizenzfreies Informations-SaaS, keine CASP-Services"
- [ ] Datenschutzerklärung DSGVO-konform (kann initial mit DSGVO-Generator wie iubenda starten, vor Launch jurist. prüfen)
- [ ] Impressum für OptiRisk e.U. mit CTP-Marke
- [ ] Markenrecherche "CryptoTrader Pro" → ist der Name in AT/EU registrierbar? Falls nein → Rebranding-Entscheidung

### 8.5 API-Keys-Datei vorbereiten (lokal, nicht committen!)

Lege `~/cryptotrader-secrets.txt` an:

```
ALCHEMY_API_KEY=
ZERION_API_KEY=
COINGECKO_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_WEBHOOK_SECRET=
SENTRY_DSN=
ANTHROPIC_API_KEY=
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
ENCRYPTION_KEY=
BINANCE_AFFILIATE_ID=
BYBIT_AFFILIATE_ID=
OKX_AFFILIATE_ID=
```

---

## 9. Sprint-Plan für Claude Code (8 Sprints, je 3–4 Stunden)

### Sprint 1 — Foundation (3h)
Monorepo-Setup, NestJS, Next.js, Prisma-Schema, Docker-Compose, Health-Check.

### Sprint 2 — Auth + Subscription + Legal (4h)
Clerk-Integration, Stripe (3 Tiers), Pricing-Page, AGB/Datenschutz/Impressum-Pages, **Terms-Acceptance-Flow mit MiCAR-Disclaimer beim Sign-up**, "True Cost"-Widget statisch.

### Sprint 3 — EVM-Wallet-Connector (4h)
Alchemy-Integration für 6 EVM-Chains, Wallet-Add-Flow, Position-Sync, BullMQ-Worker, erste Portfolio-View.

### Sprint 4 — Solana + DEX-Positionen (3h)
Solana via Helius, Zerion-Integration für DeFi-Positionen.

### Sprint 5 — CEX-Connectors mit Order-Block-Safeguard (4h)
CCXT-Wrapper für 6 Exchanges. **Kritisch:** Eigener Wrapper-Layer `SafeExchangeClient` der nur read-Methoden exposed. Order-Methoden werfen `MethodNotAllowedException`. Read-Only-Validation der API-Keys.

### Sprint 6 — Tax-Engine Österreich (4h)
FIFO als isolierte Lib, AT-spezifische Regeln (KESt 27.5% seit 01.03.2022, Spekulationssteuer alt für vor 28.02.2021 erworbene Coins, 1-Jahres-Haltefrist alt), Tax-Report-PDF/CSV-Export.

### Sprint 7 — Bridge-Compare + DCA-Planner + Affiliate (4h)
LiFi-Read-API für Bridge-Quotes, neutrale Vergleichs-UI, Affiliate-Click-Tracking, DCA-Planner als Informations-Tool (User definiert selbst Parameter, Tool zeigt historische Marktdaten + Deeplink zur Exchange).

### Sprint 8 — Alerts + KOL-Sentiment + Trade-Journal (4h)
Price-Alerts, Whale-Alerts gefiltert auf User-Holdings, KOL-Sentiment via Twitter/X-API + Claude Haiku, Trade-Journal-UI, Telegram-Bot.

**Total:** ~30h verteilt auf 3–6 Wochen.

---

## 10. Claude-Code-Prompts pro Sprint

### Sprint 1 — Foundation Prompt

```
Ich baue CryptoTrader Pro, ein MiCAR-lizenzfreies Read-Only-Portfolio-SaaS
für Krypto-Trader. Tech-Stack: TypeScript-Monorepo mit Turborepo, NestJS-Backend,
Next.js-Frontend, Prisma + Postgres, Redis + BullMQ. Hosting: Railway (Backend,
EU-Frankfurt), Vercel (Frontend, EU-Edge).

WICHTIG: Lies BRIEFING.md komplett durch bevor du anfängst. Insbesondere Abschnitt 3
(MiCAR-Compliance) ist absolut bindend.

Aufgabe Sprint 1: Foundation
1. Initialisiere Turborepo-Monorepo mit pnpm-Workspaces
2. apps/api: NestJS 10 mit modulbasierter Struktur
3. apps/web: Next.js 15 (App Router), React 19, Tailwind v4, shadcn/ui
4. packages/shared, packages/tax-engine, packages/crypto-connectors anlegen
5. Prisma-Schema aus BRIEFING.md Abschnitt 5 übernehmen, erste Migration generieren
6. docker-compose.yml mit Postgres 16 und Redis 7 (Ports 5432, 6379)
7. ESLint + Prettier konsistent
8. Health-Check GET /health im Backend, der DB + Redis pingt
9. README.md mit Setup-Instructions
10. .env.example pro App
11. .gitignore (node_modules, .env*, dist, .next, .turbo, coverage)

Akzeptanzkriterien:
- `pnpm install` läuft durch
- `pnpm dev` startet Frontend (3000) + Backend (3001) parallel
- `curl localhost:3001/health` gibt {status: "ok", db: "up", redis: "up"} zurück
- TypeScript strict mode überall aktiv
- Keine Auth, kein Stripe, keine API-Integrations in diesem Sprint
```

### Sprint 2 — Auth + Subscription + Legal Prompt

```
Sprint 2 für CryptoTrader Pro: Auth + Subscription + Legal Pages.

Referenz: BRIEFING.md insbesondere Abschnitt 3 (MiCAR-Compliance) und Abschnitt 2 (Pricing).

1. Clerk-Integration:
   - apps/web: ClerkProvider, Sign-in/Sign-up-Pages, Middleware für
     protected routes (/dashboard/*)
   - apps/api: Clerk-JWT-Validation via @clerk/backend, NestJS-Guard
   - Webhook-Endpoint /api/webhooks/clerk: User-Sync bei user.created
2. Stripe-Subscription:
   - Stripe-CLI-Script `scripts/setup-stripe.ts` legt 3 Produkte/Preise an:
     Free €0, Pro €9.90/Monat + €99/Jahr, Trader €24.90/Monat + €249/Jahr
   - Subscription-Modul im Backend mit Checkout-Session-Creation
   - Webhook-Endpoint /api/webhooks/stripe für customer.subscription.created/
     updated/deleted
   - Customer Portal-Link
3. Frontend:
   - /pricing-Page mit 3 Tiers, "Subscribe"-Buttons
   - /dashboard zeigt Subscription-Status
   - "True Cost"-Widget mit statischen Daten
4. Legal-Pages (kritisch für MiCAR-Compliance):
   - /legal/terms (AGB-Platzhaltertext mit klarem MiCAR-Disclaimer aus
     BRIEFING.md Abschnitt 3.3, Hinweis dass finale AGB von Anwalt geprüft werden)
   - /legal/privacy (DSGVO-Hinweise)
   - /legal/imprint (OptiRisk Consulting e.U., Thomas Michalik, Wien)
   - /legal/affiliate-disclosure
5. Terms-Acceptance-Flow:
   - Nach Sign-up: Modal mit AGB-Zusammenfassung + MiCAR-Disclaimer
   - User muss aktiv akzeptieren ("Ich verstehe, dass CryptoTrader Pro keine
     Anlageberatung ist und ich Handelsentscheidungen eigenverantwortlich treffe")
   - User.acceptedTermsAt + acceptedTermsVersion in DB speichern
   - Middleware blockiert Zugriff auf Dashboard solange nicht akzeptiert
6. Settings-Page mit Tax-Residency-Auswahl (Default AT)

Akzeptanzkriterien:
- Sign-up → Terms-Modal → Dashboard-Access
- Subscribe-Flow läuft im Stripe-Test-Modus durch
- Webhook-Handler aktualisiert DB korrekt
- Alle Legal-Pages auffindbar im Footer

ENV-Variablen aus BRIEFING.md Anhang. Frag mich nicht nach echten Keys.
```

### Sprint 3 — EVM-Wallet-Connector Prompt

```
Sprint 3 für CryptoTrader Pro: EVM-Wallet-Connector (Read-Only).

Referenz: BRIEFING.md.

1. WalletModule:
   - POST /api/wallets (Address, Chain, Label) — Validation via viem
   - GET /api/wallets — User-Liste
   - DELETE /api/wallets/:id
   - POST /api/wallets/:id/sync — manueller Sync-Trigger
   - isWatchOnly im Schema IMMER true forcen, niemals false setzbar

2. AlchemyService (packages/crypto-connectors/src/alchemy):
   - getTokenBalances(address, chain) für 6 Chains
   - getNativeBalance(address, chain)
   - getTokenMetadata(tokenAddress, chain) — mit Redis-Cache 24h
   - Rate-Limiting eingebaut, Retry mit Exponential Backoff

3. CoinGeckoService:
   - getPrice(coingeckoId, currency='eur')
   - getCoinIdByContract(chain, contractAddress) — Mapping-Service
   - Batch-Pricing für Position-Listen
   - Redis-Cache 60s für Preise, 7d für Mappings

4. PositionService:
   - syncWallet(walletId) — alle Token + Native Balance → Positions
   - aggregatePositions(userId) — konsolidiert über alle Sources

5. BullMQ-Worker `wallet-sync.processor`:
   - Cron alle 5min für Pro/Trader-User-Wallets
   - Cron alle 30min für Free-User-Wallets
   - On-demand-Job bei Manual-Sync

6. Frontend /dashboard/wallets:
   - Add-Wallet-Form mit Chain-Dropdown
   - Wallet-Liste mit Last-Sync, Manual-Sync-Button, Delete
   - Read-Only-Badge prominent (UI-mäßig "WATCH-ONLY")

7. Frontend /dashboard/portfolio:
   - Aggregierte Holdings-Tabelle (Asset | Amount | Avg Cost | Value EUR | P&L | Source)
   - Donut-Chart Allocation (Recharts)
   - Total-Portfolio-Value-Hero
   - Disclaimer-Footer: "Informationen ohne Anlageberatung. Daten stammen aus
     öffentlichen Blockchain-Quellen und werden read-only aggregiert."

8. Affiliate-Component vorbereiten:
   - ExchangeDeeplink-Component (Asset → Button "Auf Binance ansehen" mit
     Affiliate-Link), kommt Sprint 7 in Action
```

### Sprint 4 — Solana + DEX-Positionen Prompt

```
Sprint 4 für CryptoTrader Pro: Solana + DEX/DeFi-Positionen.

1. SolanaService:
   - Helius RPC für SPL-Token-Balances + Native SOL
   - Token-Metadata via Helius DAS API
   - Solana-Address-Validation via @solana/web3.js

2. ZerionService (DeFi-Aggregator):
   - getDefiPositions(address) für alle unterstützten Chains
   - Mapping auf unsere Position-Schema mit protocolType + protocol
   - Unterstützte Protokolle: Uniswap V3, Aerodrome, Aave V3, Compound,
     Lido, Rocket Pool, Curve, Convex, Pendle, Raydium, Orca, Marinade,
     Jito (Phase 1 reicht initial)

3. PositionService Erweiterung:
   - syncDefiPositions(walletId) parallel zu syncWallet
   - Protocol-Badge im Frontend

4. Frontend:
   - Portfolio-Tabelle erweitert um "Protocol"-Spalte
   - Filter: Spot / LP / Staked / Lent / Borrowed
   - DeFi-Section im Dashboard mit Protocol-Breakdown

5. BullMQ-Worker erweitert für DeFi-Sync
```

### Sprint 5 — CEX-Connectors mit Order-Block Prompt

```
Sprint 5 für CryptoTrader Pro: CEX-Connectors (READ-ONLY mit Safeguard-Layer).

KRITISCH: Dieser Sprint baut den Layer, der MiCAR-Compliance technisch erzwingt.
Lies BRIEFING.md Abschnitt 3 nochmal genau.

1. SafeExchangeClient (packages/crypto-connectors/src/exchanges/SafeExchangeClient.ts):
   - Wrapper um CCXT
   - Exposed NUR: fetchBalance, fetchClosedOrders, fetchMyTrades, fetchLedger,
     fetchDeposits, fetchWithdrawals, fetchPositions (für Futures-Read)
   - Alle anderen Methoden (createOrder, cancelOrder, transfer, withdraw, etc.)
     werfen explizit `OrderExecutionBlockedException` mit Begründung
     "MiCAR compliance — CryptoTrader Pro is a read-only information service
     and does not execute orders on behalf of users"
   - Unit-Tests die das Werfen verifizieren (kritisch für Audit-Trail)

2. Read-Only-Key-Validation:
   - Bei Add-Exchange: Test-Call der versucht eine winzige Test-Order zu
     SIMULIEREN (CCXT createOrder mit { test: true } wo verfügbar) und
     Fehler erwartet
   - Falls Order durchgehen würde → Reject mit Hinweis an User
   - Permissions-Scopes auslesen wo verfügbar (Binance: GET /sapi/v1/account/apiRestrictions)
   - Speichern in ExchangeAccount.permissionScopes + readOnlyVerifiedAt
   - Re-Validation alle 7 Tage

3. ExchangeService:
   - addExchange(userId, exchange, apiKey, apiSecret, label)
     → AES-256-GCM-Verschlüsselung vor Speicherung
     → Encryption-Key aus ENV (Railway Secret)
   - listExchanges, deleteExchange, manualSync
   - decryptCredentials(accountId) NUR innerhalb des Services intern, nie als
     Endpoint exposed

4. Trade-History-Import:
   - fetchClosedOrders chunked (90-Tage-Fenster wo Exchanges das limitieren)
   - Mapping auf Transaction-Schema
   - Deduplication via Composite-Key (exchange + txId)

5. BullMQ-Worker exchange-sync.processor:
   - Balance + Recent-Trades alle 5min Pro/Trader, 30min Free

6. Frontend /dashboard/exchanges:
   - Add-Exchange-Form mit Exchange-Dropdown, API-Key + Secret-Inputs (masked)
   - Prominenter Warning: "BITTE NUR READ-ONLY API-KEYS! Anleitung pro Exchange."
   - Per-Exchange-Anleitungen als Collapsible Help-Cards
   - Exchange-Liste mit Read-Only-Verification-Status, Permissions-Scopes-Anzeige

7. Portfolio-Konsolidierung:
   - Asset-Aggregation jetzt über Wallets + Exchanges
   - Source-Spalte: Multi-Badge ("3 Wallets + 2 Exchanges")
```

### Sprint 6 — Tax-Engine Österreich Prompt

```
Sprint 6 für CryptoTrader Pro: Tax-Engine Österreich.

1. TaxEngine als isolierte Library (packages/tax-engine):
   - FIFO-Implementation (First-In-First-Out)
   - Input: User-Transactions (BUY, SELL, SWAP, AIRDROP, STAKE_REWARD)
   - Output: TaxLot[] mit costBasis, realizedPnl, holdingDays
   - Property-based Tests mit fast-check

2. AT-spezifische Regeln (Stand: ÖkoStRefG 2022 + EcoSocial Tax Reform):
   - Krypto-Reform seit 01.03.2022: 27.5% KESt auf realisierte Gewinne,
     keine Spekulationsfrist mehr für Neuerwerbungen
   - Altbestand (vor 28.02.2021 erworben): weiterhin Spekulationsfrist
     1 Jahr, danach steuerfrei
   - Übergangsregelung für 01.03.2021–28.02.2022 Erworbene
   - Swap (Krypto-zu-Krypto): seit 2022 NICHT mehr steuerpflichtig wenn
     beide Krypto, ABER: bei Stablecoin-Tausch streitig — konservativ
     als steuerpflichtig modellieren mit Flag
   - Staking-Rewards: Zufluss zum FMV als sonstige Einkünfte, dann
     normale Veräußerungsbesteuerung beim Verkauf
   - Airdrops: gleich wie Staking-Rewards

3. TaxService im Backend:
   - calculateTaxYear(userId, year)
   - getOpenLots(userId, asset)
   - generateReport(userId, year, format: 'PDF' | 'CSV')

4. Report-Generator:
   - PDF mit jährlicher Zusammenfassung, allen realisierten Trades,
     Übergangsregelungen-Hinweis
   - CSV für Steuerberater (alle Lots + Trades)
   - Disclaimer: "Diese Berechnung ist eine technische Hilfsleistung und
     ersetzt keine steuerliche Beratung. Bitte prüfen Sie die Werte mit
     Ihrem Steuerberater."

5. Frontend /dashboard/tax:
   - Jahres-Selector
   - Übersicht: Realisierter Gewinn/Verlust, geschätzte KESt
   - Open-Lots-Tabelle
   - Download-Buttons PDF/CSV
   - Hinweis: "Nur für Premium-Tiers verfügbar"
```

### Sprint 7 — Bridge-Compare + DCA-Planner + Affiliate Prompt

```
Sprint 7 für CryptoTrader Pro: Bridge-Vergleich + DCA-Planner + Affiliate.

KRITISCH: Alles in diesem Sprint MUSS passive Information bleiben.
Keine Auto-Execution. User klickt immer selbst.

1. BridgeService (Read-Only via LiFi API):
   - getQuotes(fromChain, toChain, fromToken, toToken, amount)
   - Vergleich-Output: Fees, ETA, Slippage, Security-Score, Provider-Name
   - Caching 60s

2. Frontend /dashboard/bridges:
   - Input-Form: From-Chain, To-Chain, From-Token, To-Token, Amount
   - Ergebnis: Tabelle mit allen Bridge-Optionen, sortierbar
   - Button "Auf LiFi öffnen" → Affiliate-Deeplink (User schließt dort ab)
   - Disclaimer: "Vergleich basiert auf Live-Daten der Provider. Brücken-
     Transaktionen führen Sie eigenständig auf der jeweiligen Plattform durch.
     CryptoTrader Pro ist nicht Anbieter der Brücken-Services."

3. DCA-Planner (informativ, keine Execution):
   - User-Eingabe: Asset, Wunschbetrag pro Periode, Frequenz, Start-Datum
   - Tool zeigt:
     a) Historische Performance dieser DCA-Strategie (Backtest auf
        Vergangenheits-Preisen)
     b) Best Spread + Lowest Fees aktuell nach Exchange-Vergleich
     c) Vergleichs-Tabelle: Binance vs. Bitpanda vs. Kraken etc.
        (Fees, Spread, Mindest-Kaufsumme)
     d) Reminder-Setup: Email/Telegram am DCA-Tag
     e) Deeplink-Button "Auf Binance kaufen" mit Affiliate
   - WICHTIG: Tool empfiehlt KEINE Exchange, zeigt nur Daten.
     User wählt selbst.

4. AffiliateService + Deeplink-Generator:
   - Pro Partner: Template-URL mit Asset/Amount-Placeholdern
   - Click-Tracking: jeder Klick → AffiliateClick-Record
   - Periodisches Affiliate-Dashboard (intern für dich): Klicks pro Partner,
     Konversions falls Tracking-Pixel vom Partner verfügbar

5. ExchangeDeeplink-Component erweitern:
   - Überall im Portfolio: Asset-Row → "Mehr Optionen" → Deeplinks zu allen
     Exchanges mit aktuellem Preis pro Exchange
   - Disclaimer: "Affiliate-Links. CryptoTrader Pro erhält bei Käufen auf
     dieser Plattform eine Provision, ohne dass für Sie Mehrkosten entstehen."
```

### Sprint 8 — Alerts + KOL-Sentiment + Trade-Journal Prompt

```
Sprint 8 für CryptoTrader Pro: Alerts + Sentiment + Journal.

1. AlertEngine:
   - Price-Alerts: User definiert Asset + Threshold + Direction
   - Whale-Alerts: Whale Alert API für Transactions > $1M;
     filtere auf User-Holdings (nur Alerts zu Assets die User hält)
   - DCA-Reminder: Trigger aus DCA-Planner-Setup
   - Bridge-Opportunity: "Diese Bridge ist heute 30% günstiger als
     historischer Schnitt" (informativ, kein Trigger zur Action)
   - Delivery: Email (via Resend), Telegram, In-App-Notification

2. KOL-Sentiment-Module:
   - Twitter/X API v2 (Free-Tier reicht für MVP, später Basic für $100/mo)
   - Liste von 50 Crypto-KOLs als Seed (Vitalik, Hayes, Punk6529, etc.)
   - User kann eigene KOL-Liste pflegen (Trader-Tier-Feature)
   - Sentiment-Klassifikation via Claude Haiku:
     Input: Tweet-Text + Asset-Mentions
     Output: { asset, sentiment: -1..1, confidence, mentions[] }
   - Aggregation pro Asset pro Tag → SentimentScore
   - Frontend /dashboard/sentiment: Heatmap Assets × Tage

3. Telegram-Bot:
   - Bot via @BotFather erstellen
   - User verknüpft Telegram-Account (Deep-Link mit User-Token)
   - Bot sendet Alerts, kann Portfolio-Status auf /portfolio liefern

4. Trade-Journal (#19-Vorbereitung):
   - Frontend /dashboard/journal
   - Auto-Erstellung leerer Entry pro neuer Transaction (Worker)
   - User füllt nachträglich aus: Thesis, Emotion, Outcome, Review-Notes
   - Claude-Haiku-Coaching: optional "Frage mich" → Tool generiert
     reflektierende Fragen basierend auf Trade-Daten
     (z.B. "Du hast 10% deines Portfolios in ein Asset gesteckt das du
     erst diese Woche entdeckt hast — was war dein Edge?")
   - Disclaimer: "Diese Fragen sind generische Reflexionshilfen, keine
     Anlageberatung."

5. "True Cost"-Widget jetzt mit echten Daten:
   - Berechnung: User-Anteil RPC-Calls × $0.0001 + Storage-Anteil + LLM-Calls
   - Update täglich via Worker
```

---

## 11. Test-Strategie

| Layer | Test | Tool | Coverage |
|---|---|---|---|
| SafeExchangeClient (Order-Block) | Unit | Jest | **100% — kritisch!** |
| Tax-Engine FIFO + AT-Rules | Unit + Property | Jest + fast-check | 90% |
| API Endpoints | E2E | Supertest | Happy Path + Auth |
| MiCAR-Disclaimer-Components | Component | Vitest + RTL | Anwesenheit verifizieren |
| E2E User Flow | Playwright | Sign-up→Wallet→Portfolio→Tax | 3 Flows |

---

## 12. Security-Baseline

- Exchange-API-Keys: AES-256-GCM, Key in Railway Secrets
- Read-Only-Validation Pflicht
- Order-Methoden im SafeExchangeClient hardcoded geblockt
- Rate-Limits per User (NestJS Throttler)
- CORS strikt
- CSP-Header
- Dependabot + Gitleaks aktiv
- DSGVO: Data-Export + Right-to-Delete Endpoints
- Stripe-Webhook-Signature-Verification
- Audit-Log: jeder Wallet-Add, Exchange-Add, Settings-Change → AuditLog-Tabelle

---

## 13. Launch-Roadmap

| Phase | Aktion |
|---|---|
| Sprint 1–8 | MVP-Entwicklung, 4–6 Wochen |
| Woche +1 | Internal Alpha (du + 2 Freunde) |
| Woche +2 | Bug-Bash |
| Woche +3 | **AGB-Review durch Krypto-Anwalt** (Stadler Völkel / BPV Hügel / via NWT) |
| Woche +4 | Closed Beta 20 User, Free Pro-Access 3 Monate |
| Woche +5 | Soft Launch, Stripe Live, organisches Marketing |
| Woche +6 bis +12 | Iteration |
| Bei €10k Umsatz | GmbH-Gründung |

---

## 14. Was NICHT im MVP ist

- ❌ Auto-Order-Execution (lizenzpflichtig — kommt NIEMALS ohne CASP-Lizenz)
- ❌ Auto-Rebalancing (lizenzpflichtig)
- ❌ Personalisierte "Buy/Sell"-Empfehlungen (lizenzpflichtig)
- ❌ Custody / Wallet-Funktionalität (lizenzpflichtig)
- ❌ Native Mobile App (PWA reicht MVP, Native später)
- ❌ NFT-Portfolio
- ❌ Social/Copy-Trading
- ❌ Mehr als 6 EVM-Chains + Solana

---

## 15. Erfolgskriterien MVP-Phase

- 100 angemeldete User in 60 Tagen
- 20 zahlende User in 90 Tagen
- Affiliate-Revenue: €50–200/Monat zusätzlich
- Churn < 8% monatlich
- NPS > 30 in Beta
- Mindestens 1 organische Reddit/Twitter-Erwähnung pro Woche

Bei Zielerreichung in 6 Monaten → GmbH-Gründung + Phase 2 Features.
Bei Nichterreichung → Pivot zu B2B (CASP-Reporting-Tool für OptiRisk-Kunden,
deutlich höhere Marge bei geringerer Nutzer-Zahl).

---

## 16. Anhang A — .env.example

```bash
# === Database ===
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cryptotrader"
REDIS_URL="redis://localhost:6379"

# === Auth (Clerk) ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# === Payments (Stripe) ===
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_YEARLY=
STRIPE_PRICE_TRADER_MONTHLY=
STRIPE_PRICE_TRADER_YEARLY=

# === On-Chain ===
ALCHEMY_API_KEY=
ZERION_API_KEY=
HELIUS_API_KEY=

# === Prices ===
COINGECKO_API_KEY=

# === LLM ===
ANTHROPIC_API_KEY=

# === Monitoring ===
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
POSTHOG_API_KEY=

# === Security ===
ENCRYPTION_KEY= # openssl rand -hex 32

# === Affiliate ===
BINANCE_AFFILIATE_ID=
BYBIT_AFFILIATE_ID=
OKX_AFFILIATE_ID=
KUCOIN_AFFILIATE_ID=
BITPANDA_AFFILIATE_ID=

# === Phase 2 ===
WHALE_ALERT_API_KEY=
TELEGRAM_BOT_TOKEN=
TWITTER_BEARER_TOKEN=
RESEND_API_KEY=
```

---

## 17. Anhang B — GitHub-Setup-Befehle

```bash
mkdir cryptotrader-pro && cd cryptotrader-pro
git init
git branch -M main

cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.env.*.local
dist/
.next/
.turbo/
*.log
.DS_Store
coverage/
.vscode/
prisma/dev.db
EOF

echo "# CryptoTrader Pro" > README.md
# Briefing-Datei reinkopieren
cp ~/Downloads/CryptoTraderPro_CodeSession_Briefing_v2.md ./BRIEFING.md

git add .
git commit -m "Initial commit with BRIEFING"

# GitHub-Repo erstellen
gh repo create cryptotrader-pro --private --source=. --remote=origin --push
# Alternativ manuell auf github.com erstellen
```

Danach Claude Code starten:

```bash
claude
# Sprint-1-Prompt aus Abschnitt 10 einfügen
```

---

## 18. Sanity-Check vor Sprint 1

- [ ] AGB-Anwalt-Termin **angefragt** (parallel zur Entwicklung, blockiert MVP nicht)
- [ ] Pricing fix (€9.90 / €24.90)
- [ ] OptiRisk e.U. als rechtlicher Träger akzeptiert
- [ ] GmbH-Gründungs-Trigger bei €10k Umsatz im Notizbuch
- [ ] 5 potenzielle Beta-User aus Netzwerk identifiziert
- [ ] Domain gesichert (cryptotraderpro.io, .at, .eu oder Alternative)
- [ ] Logo + Marken-Farben (oder Sprint 0 dafür)
- [ ] Markenrecherche durchgeführt
- [ ] Realistisch 8h/Woche für 6 Wochen reserviert
- [ ] Backup-Strategie: alle 2 Sprints Git-Tag + Push
- [ ] Konto-Trennung OptiRisk-Stammgeschäft vs. CTP eingerichtet

Wenn alle ✅ → Sprint 1 starten.

---

**Ende v2.0 Briefing.** Speichere als `BRIEFING.md` im Repo-Root. Claude Code referenziert es bei jedem Sprint.

