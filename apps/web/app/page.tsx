import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { PortfolioStatement } from '@/components/portfolio-statement';
import { TrueCostTable } from '@/components/true-cost-table';
import { PainAnswer } from '@/components/pain-answer';

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
              Everything you hold.
              <br />
              <em className="font-normal text-[var(--color-accent-bright)]">
                Priced honestly. Taxed correctly.
              </em>
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
              Every wallet, exchange, DeFi position and NFT you own — aggregated read-only into
              one EUR view, with the true cost of every trade and an Austrian-tax-ready FIFO
              export. You keep every key; we never place a trade.
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

        {/* The manifesto — all six USPs as scene-pain → our-answer. */}
        <PainAnswer />

        <hr className="my-24 border-t border-[var(--color-rule)]" />

        {/* Proof, not assertion — the two flagship assets side by side. */}
        <section>
          <p className="editorial-label">Proof, not promises</p>
          <h2 className="display mt-6 text-4xl sm:text-5xl">What it actually looks like.</h2>

          <div className="mt-12 grid gap-12 sm:grid-cols-2">
            <div>
              <p className="editorial-label">True cost, computed</p>
              <div className="mt-4 overflow-x-auto rounded-sm border border-[var(--color-rule)] bg-[var(--color-surface)] p-5">
                <TrueCostTable />
              </div>
            </div>
            <div>
              <p className="editorial-label">Everything, in one statement</p>
              <div className="mt-4 overflow-x-auto rounded-sm border border-[var(--color-rule)] bg-[var(--color-surface)] p-5">
                <PortfolioStatement />
              </div>
            </div>
          </div>
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
