import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { PortfolioStatement } from '@/components/portfolio-statement';
import { TrueCostTable } from '@/components/true-cost-table';

/**
 * Landing — editorial layout.
 *
 * Layout choices that explicitly reject the AI-generated SaaS template:
 *  - Left-aligned, asymmetric. No "centred-hero with two buttons" trope.
 *  - Display headline in Instrument Serif Italic, NOT in a sans gradient.
 *  - One single saturated accent (burgundy). No spectrum gradients on text.
 *  - A real footnote line ("Vienna · OptiRisk Consulting e.U.") instead of
 *    a generic "Made with ❤️" or version chip.
 *  - The brand mark sits in a structural header bar, not floating above
 *    the H1 like a logo soup.
 */
export default function HomePage(): React.ReactElement {
  return (
    <>
      <header className="border-b border-[var(--color-rule)] px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <BrandLogo className="text-xl text-[var(--color-ink)]" />
          <nav className="flex items-center gap-7 text-sm">
            <Link href="/pricing" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-sm border border-[var(--color-rule-strong)] px-3 py-1.5 text-[var(--color-ink)] hover:border-[var(--color-accent-bright)]"
            >
              Get access
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-24 sm:py-32">
        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-12">
          <div className="sm:col-span-8">
            <p className="editorial-label">Vienna · est. 2026 · Issue 01</p>

            <h1 className="display mt-8 text-6xl sm:text-7xl md:text-8xl">
              Read your crypto.
              <br />
              <em className="font-normal text-[var(--color-accent-bright)]">
                We won&rsquo;t trade it
              </em>{' '}
              for you.
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
              The true cost of every trade. An aggregated, read-only view of every wallet,
              exchange, DeFi position and NFT you own. Tax-ready for Austria. No order
              execution, no custody, no personalised advice — by design, not by promise.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                href="/sign-up"
                className="border-b border-[var(--color-accent-bright)] pb-0.5 text-base text-[var(--color-ink)] hover:text-[var(--color-accent-bright)]"
              >
                Start a free account &rarr;
              </Link>
              <Link
                href="/pricing"
                className="border-b border-transparent pb-0.5 text-base text-[var(--color-ink-soft)] hover:border-[var(--color-rule-strong)] hover:text-[var(--color-ink)]"
              >
                See pricing
              </Link>
            </div>
          </div>

          <aside className="border-l border-[var(--color-rule)] pl-8 sm:col-span-4">
            <p className="editorial-label">On our position</p>

            <p className="mt-6 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
              CryptoTrader Pro is not a Crypto-Asset Service Provider under MiCAR. We don&rsquo;t
              accept orders, route orders, execute orders, custody funds, or give personalised
              advice.
            </p>

            <p className="mt-4 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
              You stay on Binance, Bybit, Bitpanda or your own self-custody wallet. We read.
              You decide. The licence-free posture is the product.
            </p>
          </aside>
        </div>

        <hr className="my-24 border-t border-[var(--color-rule)]" />

        {/* 01 — True Cost: the original cryptotraderpro.io hook + lead USP. */}
        <section className="grid gap-x-12 gap-y-16 sm:grid-cols-12">
          <article className="sm:col-span-5">
            <p className="editorial-label">01 — True Cost</p>
            <h2 className="display mt-3 text-4xl">
              The fee they advertise
              <br />
              <em className="font-normal text-[var(--color-accent-bright)]">
                isn&rsquo;t the fee you pay.
              </em>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-soft)]">
              Every exchange quotes a headline trading fee. The real cost is fee plus the
              hidden spread, network gas, and withdrawal. We compute what a trade actually
              costs you — across exchanges — so &ldquo;0 % fee&rdquo; never fools you again.
            </p>
          </article>

          {/* True-cost comparison — proof, not assertion. */}
          <div className="overflow-x-auto rounded-sm border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 sm:col-span-7">
            <TrueCostTable />
          </div>
        </section>

        <hr className="my-24 border-t border-[var(--color-rule)]" />

        {/* 02 — Aggregation: statement on the left this time, for rhythm. */}
        <section className="grid gap-x-12 gap-y-16 sm:grid-cols-12">
          <div className="order-2 overflow-x-auto rounded-sm border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 sm:order-1 sm:col-span-7">
            <PortfolioStatement />
          </div>
          <article className="order-1 sm:order-2 sm:col-span-5">
            <p className="editorial-label">02 — Aggregation</p>
            <h2 className="display mt-3 text-4xl">Every layer, one EUR figure.</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-soft)]">
              CEX trades, on-chain holdings, DeFi positions, staked LP, NFT floor — joined into
              one daily EUR statement. The kind of thing a custodian used to print at month-end,
              now generated for you nightly.
            </p>
          </article>
        </section>

        <hr className="my-24 border-t border-[var(--color-rule)]" />

        <section className="grid gap-12 sm:grid-cols-2">
          <article>
            <p className="editorial-label">03 — Tax for Austria</p>
            <h2 className="display mt-3 text-3xl">FIFO that an auditor accepts.</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-soft)]">
              ÖkoStRefG-2022-konform. Altbestand-vs-Neubestand korrekt getrennt. Export für
              FinanzOnline und für deinen Steuerberater.
            </p>
          </article>
          <article>
            <p className="editorial-label">04 — Active intelligence</p>
            <h2 className="display mt-3 text-3xl">Signals on your holdings, not the market.</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-soft)]">
              Whale moves, KOL sentiment, rug warnings — filtered down to the assets you actually
              hold. The rest is noise.
            </p>
          </article>
        </section>
      </main>

      <footer className="border-t border-[var(--color-rule)] px-8 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[var(--color-ink-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">Built in Vienna, European Capital of Crypto.</p>
          <nav className="flex gap-5">
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/imprint">Imprint</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
