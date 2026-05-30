import Link from 'next/link';

export default function DashboardPage(): React.ReactElement {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
      <p className="editorial-label">Issue 01 · Your desk</p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">
        Read your crypto.
        <br />
        <em className="font-normal text-[var(--color-accent-bright)]">We won&rsquo;t trade it.</em>
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
        Two places to start: add the wallets you want to watch, then read the aggregated
        EUR view of everything you hold.
      </p>

      <div className="mt-10 grid gap-px border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">
        <Link
          href="/wallets"
          className="group flex flex-col gap-2 bg-[var(--color-canvas)] p-7 hover:bg-[var(--color-surface)]"
        >
          <span className="editorial-label">01 — Sources</span>
          <span className="font-display text-2xl text-[var(--color-ink)]">Wallets</span>
          <span className="text-sm text-[var(--color-ink-soft)]">
            Add watch-only public addresses across seven EVM chains.
          </span>
        </Link>
        <Link
          href="/portfolio"
          className="group flex flex-col gap-2 bg-[var(--color-canvas)] p-7 hover:bg-[var(--color-surface)]"
        >
          <span className="editorial-label">02 — Aggregated</span>
          <span className="font-display text-2xl text-[var(--color-ink)]">Portfolio</span>
          <span className="text-sm text-[var(--color-ink-soft)]">
            One EUR-denominated view of every position you hold.
          </span>
        </Link>
      </div>

      <p className="mt-12 font-mono text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
        Exchanges, DeFi, NFTs and the Austrian tax engine arrive in later sprints.
      </p>
    </main>
  );
}
