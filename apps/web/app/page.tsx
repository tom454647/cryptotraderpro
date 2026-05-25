import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

export default function HomePage(): React.ReactElement {
  return (
    <main className="spectrum-glow mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
      <BrandLogo className="h-9 w-auto" />

      <span className="rounded-full border border-[var(--color-border-subtle)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        Pre-launch · Sprint 1
      </span>

      <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
        Your crypto,{' '}
        <span className="wordmark-spectrum">in full view</span>.
      </h1>

      <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
        One clear view across every wallet, exchange, DeFi position and NFT. Austrian tax-ready.
        Read-only by design — no order execution, no custody, no personalized advice.
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Link
          href="/pricing"
          className="rounded-md bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-canvas)] transition hover:opacity-90"
        >
          See pricing
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:border-[var(--color-brand-indigo)]"
        >
          Preview dashboard
        </Link>
      </div>

      <p className="mt-12 max-w-2xl font-mono text-[11px] leading-relaxed text-[var(--color-text-muted)]">
        CryptoTrader Pro is an information service, not a Crypto-Asset Service Provider (CASP)
        under MiCAR. All trading decisions remain with you, executed on the platform of your
        choice.
      </p>
    </main>
  );
}
