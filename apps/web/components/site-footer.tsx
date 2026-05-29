import Link from 'next/link';

/**
 * Shared site footer. Single source of truth across landing, pricing and
 * legal pages. Vienna persona + legal nav. Stacks on mobile.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-rule)] px-6 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[var(--color-ink-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">Built in Vienna, European Capital of Crypto.</p>
        <nav className="flex flex-wrap gap-5">
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/imprint">Imprint</Link>
          <Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link>
        </nav>
      </div>
    </footer>
  );
}
