import Link from 'next/link';

export default function HomePage(): React.ReactElement {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wider text-slate-400">
        Sprint 1 — Foundation
      </span>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
        CryptoTrader Pro
      </h1>
      <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
        Read-only aggregation of your wallets and exchange balances. Tax-ready exports for Austria.
        No order execution, no custody, no personalized advice — by design.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/pricing"
          className="rounded-md bg-slate-50 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
        >
          See pricing
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
        >
          Dashboard (preview)
        </Link>
      </div>
      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-slate-500">
        CryptoTrader Pro is an information service, not a Crypto-Asset Service Provider (CASP)
        under MiCAR. All trading decisions remain with you, executed on the platform of your
        choice.
      </p>
    </main>
  );
}
