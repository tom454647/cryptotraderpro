/**
 * A non-interactive editorial proof-of-concept: a daily-statement-shaped
 * portfolio summary rendered in IBM Plex Mono, framed like a real custodian
 * print-out. Lives on the landing so the hero proves rather than asserts.
 *
 * Numbers are illustrative and clearly labelled "EXAMPLE" so we never
 * imply a real account. The mono grid is hand-tuned so the EUR column
 * line up across rows.
 */
export function PortfolioStatement() {
  return (
    <pre
      aria-label="Example portfolio statement"
      className="font-mono text-[11px] leading-[1.55] text-[var(--color-ink-soft)] sm:text-[12px]"
    >
{`┌─────────────────────────────────────────────────────────┐
│ PORTFOLIO STATEMENT                  2026-05-28 · 18:42 │
│ Example data · cryptotraderpro.io                       │
├─────────────────────────────────────────────────────────┤
│ ASSET     HOLDINGS       SOURCE             VALUE (EUR) │
│ BTC       0.6841 ₿       2 wallets             27,432.18│
│ ETH       4.2110 Ξ       1 wallet · Binance     9,888.51│
│ SOL     142.30   ◎       Phantom                5,205.46│
│ USDC   1,250.00          Bitpanda               1,162.34│
│ AAVE     12.40           Aave V3 (staked)         582.10│
│ NFT     PUNK#7341        ETH-mainnet              918.00│
├─────────────────────────────────────────────────────────┤
│ TOTAL                                          45,188.59│
│ 24h Δ                                            +1.84 %│
│ Realised YTD (FIFO, AT)                       +12,408.21│
│ Estimated KESt liability                       +3,412.26│
├─────────────────────────────────────────────────────────┤
│ 3 wallets · 2 exchanges · 1 staking pos · 1 NFT          │
└─────────────────────────────────────────────────────────┘`}
    </pre>
  );
}
