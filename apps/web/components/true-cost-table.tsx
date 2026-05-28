/**
 * The "True Cost" proof asset — the original cryptotraderpro.io hook.
 *
 * Most exchanges advertise only the headline trading fee. The real cost of a
 * trade is fee + hidden spread + network/gas + withdrawal. This ASCII table
 * shows the same €1,000 BTC buy priced across exchanges so the gap between
 * "advertised" and "what you actually pay" is undeniable.
 *
 * Numbers are illustrative and labelled "Example". Real figures come from the
 * live fee engine (the legacy calculator on cryptotraderpro.io) once wired in.
 */
export function TrueCostTable() {
  return (
    <pre
      aria-label="Example true-cost comparison"
      className="font-mono text-[11px] leading-[1.55] text-[var(--color-ink-soft)] sm:text-[12px]"
    >
{`┌──────────────────────────────────────────────────────────┐
│ TRUE COST OF A €1,000 BTC BUY        Example · 2026-05-28 │
├──────────────────────────────────────────────────────────┤
│ EXCHANGE    FEE     SPREAD   NETWORK      YOU ACTUALLY PAY │
│ Binance     0.10 %  0.05 %   €0.42              €1,001.92  │
│ Bybit       0.10 %  0.08 %   €0.51              €1,002.31  │
│ Kraken      1.00 %  0.10 %   €0.55              €1,011.55  │
│ Bitpanda    1.49 %  0.00 %   €0.61              €1,015.51  │
│ Coinbase    1.49 %  0.50 %   €0.38              €1,020.27  │
├──────────────────────────────────────────────────────────┤
│ Cheapest    Binance          You save €18.35 vs Coinbase  │
│ The headline "0 % fee" exchanges are rarely the cheapest. │
└──────────────────────────────────────────────────────────┘`}
    </pre>
  );
}
