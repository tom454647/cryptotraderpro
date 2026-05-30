'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MICAR_DISCLAIMER_SHORT_EN } from '@cryptotrader/shared';
import { api, type PortfolioView } from '@/lib/api';

function eur(n: number): string {
  return n.toLocaleString('de-AT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  });
}

function amount(n: number): string {
  return n.toLocaleString('de-AT', { maximumFractionDigits: 6 });
}

export default function PortfolioPage() {
  const [view, setView] = useState<PortfolioView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setView(await api.get<PortfolioView>('/api/portfolio'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load portfolio');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const empty = view && view.positionCount === 0;

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
      <p className="editorial-label">Aggregated · EUR</p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">
        Your <em className="font-normal text-[var(--color-accent-bright)]">portfolio</em>.
      </h1>

      {loading && (
        <p className="mt-8 font-mono text-sm text-[var(--color-ink-muted)]">Reading positions…</p>
      )}

      {error && <p className="mt-8 font-mono text-sm text-[var(--color-danger)]">{error}</p>}

      {empty && (
        <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
          No positions yet. Add a wallet on the{' '}
          <Link href="/wallets" className="border-b border-[var(--color-accent-bright)]">
            Wallets
          </Link>{' '}
          page and hit <span className="font-mono text-sm">Sync</span> to pull its balances into
          this view.
        </p>
      )}

      {view && !empty && (
        <>
          <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-b border-[var(--color-rule-strong)] py-7">
            <div className="flex flex-col gap-1">
              <span className="editorial-label">Total value</span>
              <span className="font-mono text-3xl tabular-nums text-[var(--color-ink)]">
                {eur(view.totalValueEur)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="editorial-label">Sources</span>
              <span className="font-mono text-base tabular-nums text-[var(--color-ink-soft)]">
                {view.walletCount} wallet{view.walletCount === 1 ? '' : 's'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="editorial-label">Positions</span>
              <span className="font-mono text-base tabular-nums text-[var(--color-ink-soft)]">
                {view.positionCount}
              </span>
            </div>
          </div>

          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="text-[var(--color-ink-muted)]">
                <th className="py-3 text-left font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
                  Asset
                </th>
                <th className="py-3 pr-8 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
                  Holdings
                </th>
                <th className="hidden py-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em] sm:table-cell">
                  Price
                </th>
                <th className="py-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em]">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {view.assets.map((a) => (
                <tr key={a.asset} className="border-t border-[var(--color-rule)]">
                  <td className="py-3.5 font-sans font-medium text-[var(--color-ink)]">
                    {a.asset}
                    {a.sources > 1 && (
                      <span className="ml-2 font-mono text-[10px] text-[var(--color-ink-muted)]">
                        {a.sources} sources
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 pr-8 text-right font-mono tabular-nums text-[var(--color-ink-soft)]">
                    {amount(a.amount)}
                  </td>
                  <td className="hidden py-3.5 text-right font-mono tabular-nums text-[var(--color-ink-muted)] sm:table-cell">
                    {a.priceEur != null ? eur(a.priceEur) : '—'}
                  </td>
                  <td className="py-3.5 text-right font-mono tabular-nums text-[var(--color-ink)]">
                    {a.valueEur != null ? eur(a.valueEur) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {view.pricedCoverage < 1 && (
            <p className="mt-4 font-mono text-[11px] text-[var(--color-ink-muted)]">
              Some positions show “—” for value — no EUR price was available for those assets
              ({Math.round(view.pricedCoverage * 100)}% priced).
            </p>
          )}
        </>
      )}

      <p className="mt-12 border-t border-[var(--color-rule)] pt-6 font-mono text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
        {MICAR_DISCLAIMER_SHORT_EN} Data is read from public blockchain sources; prices via
        CoinGecko. No investment advice.
      </p>
    </main>
  );
}
