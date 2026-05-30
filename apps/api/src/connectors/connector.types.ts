import { Chain } from '@prisma/client';

/**
 * A single normalised holding as read from a chain provider — before pricing.
 * `contractAddress` is null for the chain's native asset (ETH, BNB, …).
 * `amount` is the human-readable decimal string (already divided by decimals).
 */
export interface RawBalance {
  chain: Chain;
  /** Ticker symbol, e.g. "ETH", "USDC". Best-effort from token metadata. */
  symbol: string;
  /** null = native asset; otherwise the checksummed ERC-20 contract address. */
  contractAddress: string | null;
  /** Token decimals (18 for native EVM assets). */
  decimals: number;
  /** Human-readable amount, e.g. "1.4231". Never the raw on-chain integer. */
  amount: string;
}

/**
 * Per-chain provider configuration. `alchemyNetwork` is the subdomain used in
 * the Alchemy RPC URL (`https://{network}.g.alchemy.com/v2/{key}`).
 * `nativeSymbol` and `coingeckoNativeId` drive native-asset pricing.
 * `coingeckoPlatform` is the CoinGecko asset-platform id used for
 * contract-address token pricing (/simple/token_price/{platform}).
 */
export interface EvmChainConfig {
  chain: Chain;
  alchemyNetwork: string;
  nativeSymbol: string;
  coingeckoNativeId: string;
  coingeckoPlatform: string;
}

/** The EVM chains Sprint 3 supports. Solana (Helius) lands in Sprint 4. */
export const EVM_CHAIN_CONFIG: Readonly<Record<string, EvmChainConfig>> = {
  [Chain.ETHEREUM]: {
    chain: Chain.ETHEREUM,
    alchemyNetwork: 'eth-mainnet',
    nativeSymbol: 'ETH',
    coingeckoNativeId: 'ethereum',
    coingeckoPlatform: 'ethereum',
  },
  [Chain.POLYGON]: {
    chain: Chain.POLYGON,
    alchemyNetwork: 'polygon-mainnet',
    nativeSymbol: 'POL',
    coingeckoNativeId: 'matic-network',
    coingeckoPlatform: 'polygon-pos',
  },
  [Chain.ARBITRUM]: {
    chain: Chain.ARBITRUM,
    alchemyNetwork: 'arb-mainnet',
    nativeSymbol: 'ETH',
    coingeckoNativeId: 'ethereum',
    coingeckoPlatform: 'arbitrum-one',
  },
  [Chain.OPTIMISM]: {
    chain: Chain.OPTIMISM,
    alchemyNetwork: 'opt-mainnet',
    nativeSymbol: 'ETH',
    coingeckoNativeId: 'ethereum',
    coingeckoPlatform: 'optimistic-ethereum',
  },
  [Chain.BASE]: {
    chain: Chain.BASE,
    alchemyNetwork: 'base-mainnet',
    nativeSymbol: 'ETH',
    coingeckoNativeId: 'ethereum',
    coingeckoPlatform: 'base',
  },
  [Chain.BSC]: {
    chain: Chain.BSC,
    alchemyNetwork: 'bnb-mainnet',
    nativeSymbol: 'BNB',
    coingeckoNativeId: 'binancecoin',
    coingeckoPlatform: 'binance-smart-chain',
  },
  [Chain.AVALANCHE]: {
    chain: Chain.AVALANCHE,
    alchemyNetwork: 'avax-mainnet',
    nativeSymbol: 'AVAX',
    coingeckoNativeId: 'avalanche-2',
    coingeckoPlatform: 'avalanche',
  },
};

export function isEvmChain(chain: Chain): boolean {
  return chain in EVM_CHAIN_CONFIG;
}
