/**
 * Crypto connectors — read-only by construction.
 *
 * Sprint 1 scope: type contracts + the exception class that enforces the order-block.
 * Sprint 3 adds Alchemy (EVM) + CoinGecko.
 * Sprint 4 adds Helius (Solana) + Zerion (DeFi).
 * Sprint 5 builds SafeExchangeClient (CCXT wrapper) where order methods throw.
 */

/**
 * Thrown by any connector method that would place, cancel, transfer, or withdraw
 * an order. The presence of this class — and the tests that verify it fires — is
 * load-bearing for the MiCAR information-service classification. Do not weaken.
 */
export class OrderExecutionBlockedException extends Error {
  override readonly name = 'OrderExecutionBlockedException';

  constructor(method: string) {
    super(
      `MiCAR compliance: CryptoTrader Pro is a read-only information service ` +
        `and does not execute orders on behalf of users. Blocked method: ${method}`,
    );
  }
}

export const BLOCKED_CCXT_METHODS = [
  'createOrder',
  'createMarketOrder',
  'createLimitOrder',
  'cancelOrder',
  'cancelAllOrders',
  'editOrder',
  'transfer',
  'withdraw',
  'borrowMargin',
  'repayMargin',
] as const;

export type BlockedMethod = (typeof BLOCKED_CCXT_METHODS)[number];
