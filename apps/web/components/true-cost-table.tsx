/**
 * True-cost comparison — a real, designed data table (NOT ASCII art).
 *
 * The headline trading fee hides the real cost: fee + spread + network +
 * withdrawal. This compares a €1,000 BTC buy across exchanges so the gap
 * between "advertised" and "actually paid" is undeniable. The cheapest row
 * is highlighted; the "0% fee" framing is called out below.
 *
 * Numbers illustrative ("Example"); real figures come from the fee engine
 * (Task #29 — porting the legacy calculator).
 */
interface Row {
  exchange: string;
  fee: string;
  spread: string;
  pay: string;
  cheapest?: boolean;
}

const ROWS: Row[] = [
  { exchange: 'Binance', fee: '0.10%', spread: '0.05%', pay: '€1,001.92', cheapest: true },
  { exchange: 'Bybit', fee: '0.10%', spread: '0.08%', pay: '€1,002.31' },
  { exchange: 'Kraken', fee: '1.00%', spread: '0.10%', pay: '€1,011.55' },
  { exchange: 'Bitpanda', fee: '1.49%', spread: '0.00%', pay: '€1,015.51' },
  { exchange: 'Coinbase', fee: '1.49%', spread: '0.50%', pay: '€1,020.27' },
];

export function TrueCostTable() {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between border-b border-[var(--color-rule-strong)] pb-3">
        <span className="font-sans text-sm font-medium text-[var(--color-ink)]">
          True cost of a €1,000 BTC buy
        </span>
        <span className="editorial-label">Example</span>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-[var(--color-ink-muted)]">
            <th className="py-3 text-left font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
              Exchange
            </th>
            <th className="py-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
              Fee
            </th>
            <th className="py-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
              Spread
            </th>
            <th className="py-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
              You pay
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.exchange} className="border-t border-[var(--color-rule)]">
              <td className="py-3.5 font-sans text-[var(--color-ink)]">
                {r.exchange}
                {r.cheapest && (
                  <span className="ml-2 align-middle font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent-bright)]">
                    cheapest
                  </span>
                )}
              </td>
              <td className="py-3.5 text-right font-mono tabular-nums text-[var(--color-ink-soft)]">
                {r.fee}
              </td>
              <td className="py-3.5 text-right font-mono tabular-nums text-[var(--color-ink-soft)]">
                {r.spread}
              </td>
              <td
                className={`py-3.5 text-right font-mono tabular-nums ${
                  r.cheapest
                    ? 'font-medium text-[var(--color-accent-bright)]'
                    : 'text-[var(--color-ink)]'
                }`}
              >
                {r.pay}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 border-t border-[var(--color-rule)] pt-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">
        Binance is <span className="text-[var(--color-ink)]">€18.35 cheaper</span> than Coinbase
        on the same trade — the &ldquo;0% fee&rdquo; venues are rarely the cheapest once the spread
        is counted.
      </p>
    </div>
  );
}
