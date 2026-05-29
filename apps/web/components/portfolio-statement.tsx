/**
 * Portfolio statement — a real, designed table (NOT ASCII art).
 *
 * Aggregates holdings across wallets, exchanges, DeFi and NFTs into one
 * EUR-denominated view, the way a custodian statement would. A summary
 * strip below carries the figures that matter most: total, 24h change,
 * realised YTD (FIFO/AT), estimated KESt.
 *
 * Numbers illustrative ("Example"); real data flows once the wallet/
 * exchange connectors land (Sprints 3-5).
 */
interface Position {
  asset: string;
  holdings: string;
  source: string;
  value: string;
}

const POSITIONS: Position[] = [
  { asset: 'BTC', holdings: '0.6841', source: '2 wallets', value: '€27,432.18' },
  { asset: 'ETH', holdings: '4.2110', source: 'Binance · wallet', value: '€9,888.51' },
  { asset: 'SOL', holdings: '142.30', source: 'Phantom', value: '€5,205.46' },
  { asset: 'USDC', holdings: '1,250.00', source: 'Bitpanda', value: '€1,162.34' },
  { asset: 'AAVE', holdings: '12.40', source: 'Aave V3 · staked', value: '€582.10' },
  { asset: 'PUNK #7341', holdings: '1 NFT', source: 'Ethereum', value: '€918.00' },
];

const SUMMARY: { label: string; value: string; accent?: boolean }[] = [
  { label: 'Total value', value: '€45,188.59' },
  { label: '24h change', value: '+1.84%' },
  { label: 'Realised YTD (FIFO · AT)', value: '+€12,408.21' },
  { label: 'Est. KESt liability', value: '€3,412.26', accent: true },
];

export function PortfolioStatement() {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between border-b border-[var(--color-rule-strong)] pb-3">
        <span className="font-sans text-sm font-medium text-[var(--color-ink)]">
          Portfolio statement
        </span>
        <span className="editorial-label">Example · 28 May 2026</span>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-[var(--color-ink-muted)]">
            <th className="py-3 text-left font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
              Asset
            </th>
            <th className="py-3 pr-8 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
              Holdings
            </th>
            <th className="hidden py-3 text-left font-mono text-[10px] font-normal uppercase tracking-[0.14em] sm:table-cell">
              Source
            </th>
            <th className="py-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {POSITIONS.map((p) => (
            <tr key={p.asset} className="border-t border-[var(--color-rule)]">
              <td className="py-3.5 font-sans font-medium text-[var(--color-ink)]">{p.asset}</td>
              <td className="py-3.5 pr-8 text-right font-mono tabular-nums text-[var(--color-ink-soft)]">
                {p.holdings}
              </td>
              <td className="hidden py-3.5 font-mono text-xs text-[var(--color-ink-muted)] sm:table-cell">
                {p.source}
              </td>
              <td className="py-3.5 text-right font-mono tabular-nums text-[var(--color-ink)]">
                {p.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-rule)] pt-5">
        {SUMMARY.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              {s.label}
            </dt>
            <dd
              className={`font-mono tabular-nums text-base ${
                s.accent ? 'text-[var(--color-accent-bright)]' : 'text-[var(--color-ink)]'
              }`}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 font-mono text-[11px] text-[var(--color-ink-muted)]">
        3 wallets · 2 exchanges · 1 staking position · 1 NFT
      </p>
    </div>
  );
}
