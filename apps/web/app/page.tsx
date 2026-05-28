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
          <div className="sm:col-span-7">
            <p className="editorial-label">Vienna · est. 2026 · Issue 01</p>

            <h1 className="display mt-8 text-6xl sm:text-7xl md:text-8xl">
              See all of it.
              <br />
              <em className="font-normal text-[var(--color-accent-bright)]">
                Know the real cost.
              </em>
              <br />
              Keep every key.
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
              CryptoTrader Pro pulls every wallet, exchange, chain, DeFi position and NFT into
              one EUR view — with the true cost of every trade and Austrian-tax-ready FIFO.
              Read-only at the code level. You aggregate and decide; we never place a trade.
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

          <aside className="flex flex-col justify-center border-l border-[var(--color-rule)] pl-8 sm:col-span-5">
            <p className="editorial-label">The principle</p>

            <p className="display mt-6 text-2xl leading-snug text-[var(--color-ink)]">
              Every other tracker eventually wants keys that can trade, buries the real fees, or
              sells your attention.
            </p>

            <p className="mt-6 text-base leading-relaxed text-[var(--color-ink-soft)]">
              We took the opposite oath. Read-only, enforced in code. Honest about every cost.
              Built for Austrian tax from day one — in the European capital of crypto.
            </p>

            <p className="mt-6 text-base leading-relaxed text-[var(--color-ink-soft)]">
              The only crypto cockpit{' '}
              <span className="text-[var(--color-ink)]">
                structurally incapable of moving your money.
              </span>{' '}
              That isn&rsquo;t the limitation — it&rsquo;s the product.
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
