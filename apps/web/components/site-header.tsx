import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

/**
 * Shared site header. Single source of truth for the top nav across
 * landing, pricing and legal pages (was duplicated three times).
 *
 * Mobile fixes: wordmark scales down (text-lg → text-xl), nav items are
 * whitespace-nowrap with tighter gaps, and on the narrowest screens the
 * "Pricing"/"Sign in" text links hide, leaving the wordmark + the primary
 * "Get access" pill so nothing wraps.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-rule)] px-6 py-5 sm:px-8 sm:py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-[var(--color-ink)]">
          <BrandLogo className="text-lg sm:text-xl" />
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-7">
          <Link
            href="/pricing"
            className="hidden whitespace-nowrap text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] sm:inline"
          >
            Pricing
          </Link>
          <Link
            href="/sign-in"
            className="hidden whitespace-nowrap text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="whitespace-nowrap rounded-sm border border-[var(--color-rule-strong)] px-3 py-1.5 text-[var(--color-ink)] hover:border-[var(--color-accent-bright)]"
          >
            Get access
          </Link>
        </nav>
      </div>
    </header>
  );
}
