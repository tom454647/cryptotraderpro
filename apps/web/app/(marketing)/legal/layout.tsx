import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

/**
 * Shared shell for every /legal/* page.
 *
 * Editorial principles preserved from the landing:
 *  - Asymmetric grid (main column 8/12, mono sidebar 4/12)
 *  - Editorial label in IBM Plex Mono on top of each page
 *  - Vienna persona always in the footer
 *  - No spectrum, no chips, no Lucide deco
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-[var(--color-rule)] px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-[var(--color-ink)]">
            <BrandLogo className="h-7 w-auto" />
          </Link>
          <nav className="flex items-center gap-7 text-sm">
            <Link href="/pricing" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
              Pricing
            </Link>
            <Link href="/sign-in" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
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

      <main className="mx-auto max-w-6xl px-8 py-20">{children}</main>

      <footer className="border-t border-[var(--color-rule)] px-8 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[var(--color-ink-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">
            Built in Vienna by an independent operator · OptiRisk Consulting e.U.
          </p>
          <nav className="flex gap-5">
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/imprint">Imprint</Link>
            <Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
