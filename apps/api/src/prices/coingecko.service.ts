import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../common/redis/redis.service';

/** EUR price keyed by the lookup identifier (coin id or contract address). */
export type PriceMap = Record<string, number>;

const VS_CURRENCY = 'eur';
const CACHE_TTL_SECONDS = 90; // prices are short-lived; 90s is plenty for a portfolio view.
const CACHE_PREFIX = 'cg:eur:';

/**
 * EUR prices from CoinGecko, Redis-cached per identifier.
 *
 * Works without a key against the public endpoint (rate-limited); if
 * COINGECKO_API_KEY (demo) is set it's sent as the x-cg-demo-api-key header.
 * All failures degrade to "no price" (the identifier is simply absent from
 * the returned map) — pricing is never allowed to fail a wallet sync.
 */
@Injectable()
export class CoinGeckoService {
  private readonly logger = new Logger(CoinGeckoService.name);
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(RedisService) private readonly redis: RedisService,
  ) {}

  private headers(): Record<string, string> {
    const key = this.config.get<string>('COINGECKO_API_KEY');
    return key ? { 'x-cg-demo-api-key': key } : {};
  }

  /** Pull cached prices; return [hits map, identifiers still missing]. */
  private async fromCache(prefix: string, ids: string[]): Promise<[PriceMap, string[]]> {
    const hits: PriceMap = {};
    const misses: string[] = [];
    if (ids.length === 0) return [hits, misses];
    const client = this.redis.getClient();
    const cached = await client.mget(...ids.map((id) => `${CACHE_PREFIX}${prefix}:${id}`));
    ids.forEach((id, i) => {
      const raw = cached[i];
      if (raw != null) hits[id] = Number(raw);
      else misses.push(id);
    });
    return [hits, misses];
  }

  private async toCache(prefix: string, prices: PriceMap): Promise<void> {
    const entries = Object.entries(prices);
    if (entries.length === 0) return;
    const client = this.redis.getClient();
    const pipe = client.pipeline();
    for (const [id, price] of entries) {
      pipe.set(`${CACHE_PREFIX}${prefix}:${id}`, String(price), 'EX', CACHE_TTL_SECONDS);
    }
    await pipe.exec();
  }

  /** EUR prices for CoinGecko coin ids, e.g. ['ethereum','binancecoin']. */
  async getNativePrices(coinIds: string[]): Promise<PriceMap> {
    const unique = [...new Set(coinIds)].filter(Boolean);
    const [hits, misses] = await this.fromCache('id', unique);
    if (misses.length === 0) return hits;

    try {
      const url = `${this.baseUrl}/simple/price?ids=${misses.join(',')}&vs_currencies=${VS_CURRENCY}`;
      const res = await fetch(url, { headers: this.headers() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Record<string, Record<string, number>>;
      const fresh: PriceMap = {};
      for (const id of misses) {
        const price = json[id]?.[VS_CURRENCY];
        if (typeof price === 'number') fresh[id] = price;
      }
      await this.toCache('id', fresh);
      return { ...hits, ...fresh };
    } catch (err) {
      this.logger.warn(`getNativePrices failed: ${(err as Error).message}`);
      return hits;
    }
  }

  /**
   * EUR prices for ERC-20 tokens by contract address on a CoinGecko platform.
   * Keys in the returned map are lower-cased contract addresses.
   */
  async getTokenPrices(platform: string, contractAddresses: string[]): Promise<PriceMap> {
    const unique = [...new Set(contractAddresses.map((a) => a.toLowerCase()))].filter(Boolean);
    const [hits, misses] = await this.fromCache(`tok:${platform}`, unique);
    if (misses.length === 0) return hits;

    try {
      const url = `${this.baseUrl}/simple/token_price/${platform}?contract_addresses=${misses.join(
        ',',
      )}&vs_currencies=${VS_CURRENCY}`;
      const res = await fetch(url, { headers: this.headers() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Record<string, Record<string, number>>;
      const fresh: PriceMap = {};
      // CoinGecko echoes contract addresses lower-cased.
      for (const [addr, prices] of Object.entries(json)) {
        const price = prices?.[VS_CURRENCY];
        if (typeof price === 'number') fresh[addr.toLowerCase()] = price;
      }
      await this.toCache(`tok:${platform}`, fresh);
      return { ...hits, ...fresh };
    } catch (err) {
      this.logger.warn(`getTokenPrices(${platform}) failed: ${(err as Error).message}`);
      return hits;
    }
  }
}
