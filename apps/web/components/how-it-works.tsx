interface Step {
  n: string;
  title: string;
  body: string;
}

/**
 * "How it works" — three steps, editorial-numbered like the manifesto.
 * Sits between the manifesto (why) and the proof tables (what it looks
 * like), so the funnel reads: pain → answer → how → proof → CTA.
 *
 * Step 1 leads with the read-only validation (the trust beat lands here,
 * inside the mechanics, not as a headline pillar).
 */
const STEPS: Step[] = [
  {
    n: '01',
    title: 'Connect, read-only',
    body: 'Add your wallet addresses and exchange API keys. We validate every key is read-only before it is ever stored — and re-check every seven days.',
  },
  {
    n: '02',
    title: 'We aggregate, nightly',
    body: 'Balances, trades, DeFi positions, staking, LPs and NFTs are pulled across all your sources and consolidated into one EUR-denominated statement.',
  },
  {
    n: '03',
    title: 'You see everything',
    body: 'The true cost of every trade, your whole portfolio at a glance, alerts on the assets you hold, and an Austrian-tax-ready export. You decide what to do next.',
  },
];

export function HowItWorks() {
  return (
    <section>
      <p className="editorial-label">How it works</p>
      <h2 className="display mt-6 text-4xl sm:text-5xl">
        Three steps. <em className="font-normal text-[var(--color-accent-bright)]">No custody.</em>
      </h2>

      <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-3">
        {STEPS.map((s) => (
          <article key={s.n} className="border-t border-[var(--color-rule)] pt-6">
            <p className="font-mono text-sm text-[var(--color-accent-bright)]">{s.n}</p>
            <h3 className="display mt-3 text-2xl text-[var(--color-ink)]">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
