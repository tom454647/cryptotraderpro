'use client';

import { useState } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand-logo';

const LINKS: { href: Route; label: string }[] = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/wallets', label: 'Wallets' },
];

/**
 * Dashboard top bar — masthead wordmark, section nav, sign-out. Editorial:
 * mono labels, burgundy underline on the active section, no chips or icons.
 */
export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/sign-in');
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--color-rule)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
        <Link href="/dashboard" className="text-lg text-[var(--color-ink)]">
          <BrandLogo />
        </Link>

        <nav className="flex items-center gap-7">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b pb-0.5 font-mono text-xs uppercase tracking-[0.14em] ${
                  active
                    ? 'border-[var(--color-accent-bright)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-50"
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </nav>
      </div>
    </header>
  );
}
