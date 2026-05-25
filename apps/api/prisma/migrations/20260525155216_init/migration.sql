-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('FREE', 'PRO', 'TRADER');

-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('ETHEREUM', 'BSC', 'POLYGON', 'ARBITRUM', 'OPTIMISM', 'BASE', 'SOLANA', 'AVALANCHE');

-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('BINANCE', 'BYBIT', 'KRAKEN', 'COINBASE', 'KUCOIN', 'BITPANDA', 'OKX');

-- CreateEnum
CREATE TYPE "ProtocolType" AS ENUM ('SPOT', 'LP', 'STAKED', 'LENT', 'BORROWED');

-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('BUY', 'SELL', 'TRANSFER_IN', 'TRANSFER_OUT', 'SWAP', 'STAKE_REWARD', 'AIRDROP', 'FEE');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PRICE', 'WHALE_MOVE', 'KOL_MENTION', 'RUG_SIGNAL', 'BRIDGE_OPPORTUNITY', 'DCA_REMINDER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authProviderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taxResidency" TEXT NOT NULL DEFAULT 'AT',
    "baseCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "acceptedTermsAt" TIMESTAMP(3),
    "acceptedTermsVersion" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "chain" "Chain" NOT NULL,
    "label" TEXT,
    "isWatchOnly" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSync" TIMESTAMP(3),

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "label" TEXT NOT NULL,
    "apiKeyEnc" TEXT NOT NULL,
    "apiSecretEnc" TEXT NOT NULL,
    "readOnlyVerifiedAt" TIMESTAMP(3) NOT NULL,
    "permissionScopes" TEXT[],
    "lastSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "walletId" TEXT,
    "exchangeId" TEXT,
    "asset" TEXT NOT NULL,
    "amount" DECIMAL(36,18) NOT NULL,
    "avgCostBasis" DECIMAL(36,8),
    "lastPriceEur" DECIMAL(36,8),
    "protocolType" "ProtocolType",
    "protocol" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "txHash" TEXT,
    "type" "TxType" NOT NULL,
    "asset" TEXT NOT NULL,
    "amount" DECIMAL(36,18) NOT NULL,
    "priceEur" DECIMAL(36,8) NOT NULL,
    "feeEur" DECIMAL(36,8),
    "timestamp" TIMESTAMP(3) NOT NULL,
    "raw" JSONB NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxLot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(36,18) NOT NULL,
    "costBasisEur" DECIMAL(36,8) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "closingPriceEur" DECIMAL(36,8),
    "realizedPnlEur" DECIMAL(36,8),
    "holdingDays" INTEGER,

    CONSTRAINT "TaxLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "config" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "channel" TEXT NOT NULL DEFAULT 'email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "txId" TEXT,
    "thesis" TEXT,
    "emotion" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "outcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateClick" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "partner" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "asset" TEXT,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_authProviderId_key" ON "User"("authProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_address_chain_key" ON "Wallet"("userId", "address", "chain");

-- CreateIndex
CREATE INDEX "ExchangeAccount_userId_idx" ON "ExchangeAccount"("userId");

-- CreateIndex
CREATE INDEX "Position_asset_idx" ON "Position"("asset");

-- CreateIndex
CREATE INDEX "Position_walletId_idx" ON "Position"("walletId");

-- CreateIndex
CREATE INDEX "Position_exchangeId_idx" ON "Position"("exchangeId");

-- CreateIndex
CREATE INDEX "Transaction_userId_timestamp_idx" ON "Transaction"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "Transaction_asset_idx" ON "Transaction"("asset");

-- CreateIndex
CREATE INDEX "TaxLot_userId_asset_acquiredAt_idx" ON "TaxLot"("userId", "asset", "acquiredAt");

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "JournalEntry_userId_idx" ON "JournalEntry"("userId");

-- CreateIndex
CREATE INDEX "AffiliateClick_userId_idx" ON "AffiliateClick"("userId");

-- CreateIndex
CREATE INDEX "AffiliateClick_partner_clickedAt_idx" ON "AffiliateClick"("partner", "clickedAt");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeAccount" ADD CONSTRAINT "ExchangeAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "ExchangeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
