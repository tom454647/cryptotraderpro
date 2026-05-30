import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { Chain, ProtocolType } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { ProviderRouter } from '../connectors/provider-router.service';
import { CoinGeckoService, type PriceMap } from '../prices/coingecko.service';
import { EVM_CHAIN_CONFIG, type RawBalance } from '../connectors/connector.types';

export interface SyncResult {
  walletId: string;
  positions: number;
  valueEur: number;
  syncedAt: Date;
}

interface AggregatedAsset {
  asset: string;
  amount: number;
  valueEur: number | null;
  priceEur: number | null;
  sources: number;
}

export interface PortfolioView {
  totalValueEur: number;
  assets: AggregatedAsset[];
  walletCount: number;
  positionCount: number;
  pricedCoverage: number; // 0..1 — share of positions that have a EUR price.
}

/**
 * Turns raw on-chain balances into priced, persisted Position rows, and reads
 * them back as an aggregated EUR portfolio. Read-only throughout — it never
 * touches a private key or submits a transaction (MiCAR invariant).
 */
@Injectable()
export class PositionService {
  private readonly logger = new Logger(PositionService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ProviderRouter) private readonly providers: ProviderRouter,
    @Inject(CoinGeckoService) private readonly prices: CoinGeckoService,
  ) {}

  private async resolveUserId(authProviderId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { authProviderId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('User profile not found yet — try again in a moment');
    }
    return user.id;
  }

  /**
   * Re-read one wallet's balances, price them, and replace its stored
   * positions. Synchronous for the skeleton — Sprint 3.x can move this behind
   * a BullMQ job without changing the contract.
   */
  async syncWallet(authProviderId: string, walletId: string): Promise<SyncResult> {
    const userId = await this.resolveUserId(authProviderId);
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, userId },
      select: { id: true, address: true, chain: true },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const balances = await this.providers.getBalances(wallet.chain, wallet.address);
    const priced = await this.priceBalances(wallet.chain, balances);

    const syncedAt = await this.prisma.$transaction(async (tx) => {
      await tx.position.deleteMany({ where: { walletId: wallet.id } });
      if (priced.length > 0) {
        await tx.position.createMany({
          data: priced.map((p) => ({
            walletId: wallet.id,
            asset: p.symbol,
            amount: p.amount,
            lastPriceEur: p.priceEur,
            protocolType: ProtocolType.SPOT,
          })),
        });
      }
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { lastSync: new Date() },
        select: { lastSync: true },
      });
      return updated.lastSync as Date;
    });

    const valueEur = priced.reduce(
      (sum, p) => sum + (p.priceEur != null ? Number(p.amount) * Number(p.priceEur) : 0),
      0,
    );
    this.logger.log(
      `Synced ${wallet.chain} ${wallet.address.slice(0, 10)}… → ${priced.length} positions, ` +
        `€${valueEur.toFixed(2)}`,
    );
    return { walletId: wallet.id, positions: priced.length, valueEur, syncedAt };
  }

  /** Attach a EUR price (or null) to each raw balance. */
  private async priceBalances(
    chain: Chain,
    balances: RawBalance[],
  ): Promise<(RawBalance & { priceEur: string | null })[]> {
    if (balances.length === 0) return [];
    const cfg = EVM_CHAIN_CONFIG[chain];

    const hasNative = balances.some((b) => b.contractAddress === null);
    const tokenAddrs = balances
      .filter((b) => b.contractAddress !== null)
      .map((b) => b.contractAddress as string);

    const nativePromise: Promise<PriceMap> =
      hasNative && cfg ? this.prices.getNativePrices([cfg.coingeckoNativeId]) : Promise.resolve({});
    const tokenPromise: Promise<PriceMap> =
      tokenAddrs.length && cfg
        ? this.prices.getTokenPrices(cfg.coingeckoPlatform, tokenAddrs)
        : Promise.resolve({});
    const nativePrices = await nativePromise;
    const tokenPrices = await tokenPromise;

    return balances.map((b) => {
      let price: number | undefined;
      if (b.contractAddress === null) {
        price = cfg ? nativePrices[cfg.coingeckoNativeId] : undefined;
      } else {
        price = tokenPrices[b.contractAddress.toLowerCase()];
      }
      return { ...b, priceEur: typeof price === 'number' ? String(price) : null };
    });
  }

  /** Aggregated EUR view across all of the user's wallets. */
  async getPortfolio(authProviderId: string): Promise<PortfolioView> {
    const userId = await this.resolveUserId(authProviderId);
    const positions = await this.prisma.position.findMany({
      where: { wallet: { userId } },
      select: { asset: true, amount: true, lastPriceEur: true, walletId: true },
    });

    const byAsset = new Map<string, { amount: number; valueEur: number; priced: boolean; sources: Set<string> }>();
    let pricedCount = 0;

    for (const p of positions) {
      const amount = Number(p.amount);
      const price = p.lastPriceEur != null ? Number(p.lastPriceEur) : null;
      const entry = byAsset.get(p.asset) ?? {
        amount: 0,
        valueEur: 0,
        priced: false,
        sources: new Set<string>(),
      };
      entry.amount += amount;
      if (price != null) {
        entry.valueEur += amount * price;
        entry.priced = true;
        pricedCount += 1;
      }
      if (p.walletId) entry.sources.add(p.walletId);
      byAsset.set(p.asset, entry);
    }

    const assets: AggregatedAsset[] = [...byAsset.entries()]
      .map(([asset, e]) => ({
        asset,
        amount: e.amount,
        valueEur: e.priced ? e.valueEur : null,
        priceEur: e.priced && e.amount > 0 ? e.valueEur / e.amount : null,
        sources: e.sources.size,
      }))
      .sort((a, b) => (b.valueEur ?? 0) - (a.valueEur ?? 0));

    const walletCount = await this.prisma.wallet.count({ where: { userId } });

    return {
      totalValueEur: assets.reduce((sum, a) => sum + (a.valueEur ?? 0), 0),
      assets,
      walletCount,
      positionCount: positions.length,
      pricedCoverage: positions.length ? pricedCount / positions.length : 1,
    };
  }
}
