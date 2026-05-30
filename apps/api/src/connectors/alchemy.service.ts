import {
  Injectable,
  Inject,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Chain } from '@prisma/client';
import { formatUnits } from 'viem';
import { EVM_CHAIN_CONFIG, type EvmChainConfig, type RawBalance } from './connector.types';

interface JsonRpcResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

interface TokenBalancesResult {
  address: string;
  tokenBalances: { contractAddress: string; tokenBalance: string | null }[];
}

interface TokenMetadataResult {
  decimals: number | null;
  logo: string | null;
  name: string | null;
  symbol: string | null;
}

/**
 * Reads native + ERC-20 balances for a watch-only address from Alchemy.
 *
 * READ-ONLY by construction — every call is an `eth_*`/`alchemy_*` query
 * (getBalance, getTokenBalances, getTokenMetadata). There is no signing key
 * and no method here can move funds (MiCAR invariant — see CLAUDE.md).
 *
 * If ALCHEMY_API_KEY is unset the service throws ServiceUnavailableException
 * so the rest of the skeleton (wallet CRUD, stored-position reads) keeps
 * working without live on-chain data.
 */
@Injectable()
export class AlchemyService {
  private readonly logger = new Logger(AlchemyService.name);
  /** Zero-balance sentinel returned by alchemy_getTokenBalances. */
  private static readonly ZERO_HEX = /^0x0*$/;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  private apiKey(): string {
    const key = this.config.get<string>('ALCHEMY_API_KEY');
    if (!key) {
      throw new ServiceUnavailableException(
        'On-chain data is not configured yet (ALCHEMY_API_KEY missing).',
      );
    }
    return key;
  }

  private rpcUrl(cfg: EvmChainConfig): string {
    return `https://${cfg.alchemyNetwork}.g.alchemy.com/v2/${this.apiKey()}`;
  }

  private async rpc<T>(url: string, method: string, params: unknown[]): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    });
    if (!res.ok) {
      throw new ServiceUnavailableException(`Alchemy ${method} failed: HTTP ${res.status}`);
    }
    const json = (await res.json()) as JsonRpcResponse<T>;
    if (json.error) {
      throw new ServiceUnavailableException(`Alchemy ${method} error: ${json.error.message}`);
    }
    return json.result as T;
  }

  /**
   * All non-zero balances (native + ERC-20) for `address` on `chain`.
   * Token metadata (symbol/decimals) is fetched per token; tokens whose
   * metadata can't be resolved fall back to a truncated-address symbol.
   */
  async getBalances(chain: Chain, address: string): Promise<RawBalance[]> {
    const cfg = EVM_CHAIN_CONFIG[chain];
    if (!cfg) {
      // Defensive — ProviderRouter is supposed to gate non-EVM chains.
      throw new ServiceUnavailableException(`${chain} is not an EVM chain`);
    }
    const url = this.rpcUrl(cfg);
    const balances: RawBalance[] = [];

    // Native balance.
    const nativeHex = await this.rpc<string>(url, 'eth_getBalance', [address, 'latest']);
    const nativeWei = BigInt(nativeHex ?? '0x0');
    if (nativeWei > 0n) {
      balances.push({
        chain,
        symbol: cfg.nativeSymbol,
        contractAddress: null,
        decimals: 18,
        amount: formatUnits(nativeWei, 18),
      });
    }

    // ERC-20 balances. erc20 mode returns only standard fungible tokens.
    const tokenResult = await this.rpc<TokenBalancesResult>(url, 'alchemy_getTokenBalances', [
      address,
      'erc20',
    ]);
    const nonZero = (tokenResult?.tokenBalances ?? []).filter(
      (t) => t.tokenBalance && !AlchemyService.ZERO_HEX.test(t.tokenBalance),
    );

    for (const token of nonZero) {
      const meta = await this.rpc<TokenMetadataResult>(url, 'alchemy_getTokenMetadata', [
        token.contractAddress,
      ]).catch(() => null);
      const decimals = meta?.decimals ?? 18;
      const raw = BigInt(token.tokenBalance as string);
      const amount = formatUnits(raw, decimals);
      // Skip dust that rounds to zero at the token's own precision.
      if (Number(amount) === 0) continue;
      balances.push({
        chain,
        symbol: meta?.symbol?.trim() || `${token.contractAddress.slice(0, 6)}…`,
        contractAddress: token.contractAddress,
        decimals,
        amount,
      });
    }

    this.logger.debug(`${chain} ${address.slice(0, 10)}… → ${balances.length} balances`);
    return balances;
  }
}
