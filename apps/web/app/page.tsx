import Link from 'next/link';
import { PortfolioStatement } from '@/components/portfolio-statement';
import { TrueCostTable } from '@/components/true-cost-table';
import { PainAnswer } from '@/components/pain-answer';
import { HowItWorks } from '@/components/how-it-works';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

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
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-12">
          <div className="sm:col-span-7">
            <p className="editorial-label">Vienna · est. 2026 · Issue 01</p>

            <h1 className="display mt-8 text-5xl sm:text-7xl md:text-8xl">
              Everything you hold.
              <br />
              <em className="font-normal text-[var(--color-accent-bright)]">
                Priced honestly. Taxed correctly.
              </em>
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
              Every wallet, exchange, chain, DeFi position and NFT you own — in one EUR view.
              The true cost of every trade, compared across exchanges. Austrian tax an auditor
              accepts. The monitoring nightmare, over.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Link
                href="/sign-up"
                className="rounded-sm bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-accent-bright)]"
              >
                Start a free account
              </Link>
              <Link
                href="/pricing"
                className="border-b border-transparent px-1 pb-0.5 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-rule-strong)] hover:text-[var(--color-ink)]"
              >
                See pricing &rarr;
              </Link>
            </div>
          </div>

          <aside className="flex flex-col justify-center border-l border-[var(--color-rule)] pl-8 sm:col-span-5">
            <p className="editorial-label">What we are</p>

            <p className="display mt-6 text-2xl leading-snug text-[var(--color-ink)]">
              An information and aggregation service — built in the European capital of crypto.
            </p>

            <p className="mt-6 text-base leading-relaxed text-[var(--color-ink-soft)]">
              We read your wallet and exchange data on your instruction, surface market
              information, compute your Austrian tax, and document your trades. You stay in
              control — every order happens on the platform of your choice.
            </p>

            <p className="mt-6 font-mono text-sm leading-relaxed text-[var(--color-ink-muted)]">
              Read-only, always. Your keys never leave your hands.
            </p>
          </aside>
        </div>

        <hr className="my-24 border-t border-[var(--color-rule)]" />

        {/* The manifesto — the five USPs as scene-pain → our-answer. */}
        <PainAnswer />

        <hr className="my-24 border-t border-[var(--color-rule)]" />

        {/* How it works — three steps between why and proof. */}
        <HowItWorks />

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

        <hr className="my-24 border-t border-[var(--color-rule)]" />

        {/* Final CTA — close the funnel for the convinced reader. */}
        <section className="grid items-end gap-x-12 gap-y-10 sm:grid-cols-12">
          <div className="sm:col-span-8">
            <p className="editorial-label">Ready when you are</p>
            <h2 className="display mt-6 text-5xl sm:text-6xl">
              See your whole portfolio —{' '}
              <em className="font-normal text-[var(--color-accent-bright)]">
                and what it really costs you.
              </em>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
              Free to start, one wallet and one exchange. Upgrade when you want unlimited sources,
              the Austrian tax export and the active-intelligence stack.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 sm:col-span-4 sm:justify-end">
            <Link
              href="/sign-up"
              className="rounded-sm bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-accent-bright)]"
            >
              Start a free account
            </Link>
            <Link
              href="/pricing"
              className="border-b border-transparent px-1 pb-0.5 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-rule-strong)] hover:text-[var(--color-ink)]"
            >
              See pricing &rarr;
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
