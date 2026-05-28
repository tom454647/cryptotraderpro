'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand-logo';
import {
  CURRENT_TERMS_VERSION,
  MICAR_ACCEPTANCE_STATEMENT_EN,
} from '@cryptotrader/shared';

/**
 * Editorial post-signup gate.
 *
 * The user has a Supabase session but no acceptedTermsAt on their local
 * mirror — they cannot reach /dashboard until they actively acknowledge
 * the MiCAR statement here. The middleware enforces this.
 *
 * Page intentionally feels like a serious editorial statement — Instrument
 * Serif heading, IBM Plex Mono statement framed by burgundy rule, single
 * primary CTA. No "I agree to Terms ✓" checkbox-soup.
 */
export default function AcceptTermsPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bounce if not signed in.
  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.replace('/sign-in?redirect=/accept-terms');
    })();
  }, [supabase, router]);

  async function accept() {
    setSubmitting(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('No active session');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/me/accept-terms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ version: CURRENT_TERMS_VERSION }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-8 py-16">
      <BrandLogo className="text-xl text-[var(--color-ink)]" />

      <p className="editorial-label mt-12">One thing before we go on</p>

      <h1 className="display mt-6 text-5xl sm:text-6xl">
        Read.
        <br />
        <em className="font-normal text-[var(--color-accent-bright)]">Don&rsquo;t trade.</em>
        <br />
        Acknowledge.
      </h1>

      <p className="mt-10 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
        Before you reach the dashboard, please confirm you understand the
        position CryptoTrader Pro takes — and the position it does <em>not</em>{' '}
        take. This acknowledgement is recorded with timestamp and version (
        <code className="font-mono text-xs text-[var(--color-accent-bright)]">
          {CURRENT_TERMS_VERSION}
        </code>
        ) so we can re-prompt you if the terms ever materially change.
      </p>

      <blockquote className="my-10 border-l-2 border-[var(--color-accent)] py-2 pl-6 font-mono text-sm leading-relaxed text-[var(--color-ink)]">
        {MICAR_ACCEPTANCE_STATEMENT_EN}
      </blockquote>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={accept}
          disabled={submitting}
          className="border-b border-[var(--color-accent-bright)] pb-0.5 text-base text-[var(--color-ink)] hover:text-[var(--color-accent-bright)] disabled:opacity-50"
        >
          {submitting ? 'Recording…' : 'I understand & accept →'}
        </button>
        <Link
          href="/legal/terms"
          className="border-b border-transparent pb-0.5 text-base text-[var(--color-ink-soft)] hover:border-[var(--color-rule-strong)] hover:text-[var(--color-ink)]"
        >
          Read the full Terms
        </Link>
      </div>

      {error && (
        <p className="mt-6 font-mono text-xs text-[var(--color-danger)]">
          Could not record acceptance — {error}. Please try again or contact us
          at hello@cryptotraderpro.io.
        </p>
      )}

      <p className="mt-16 font-mono text-xs leading-relaxed text-[var(--color-ink-muted)]">
        If you do not accept, you can sign out and leave. We will not contact
        you. No portfolio data is read until you accept.
      </p>
    </main>
  );
}
