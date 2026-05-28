'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand-logo';

/**
 * Editorial sign-in. Wrapped in the same asymmetric layout as the
 * landing — left-aligned heading in Instrument Serif italic, IBM Plex
 * Mono editorial label, single burgundy accent on the form's primary
 * action. The Supabase Auth UI is themed as tight as its variables
 * allow; ThemeSupa is restrictive, so a future iteration may replace
 * it with a custom form using the Supabase JS SDK directly.
 */
export default function SignInPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/dashboard';
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push(redirectTo);
        router.refresh();
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, [supabase, router, redirectTo]);

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-x-12 gap-y-12 px-8 py-16 sm:grid-cols-12 sm:items-center">
      <section className="sm:col-span-7">
        <BrandLogo className="h-7 w-auto text-[var(--color-ink)]" />
        <p className="editorial-label mt-12">Returning operator</p>
        <h1 className="display mt-6 text-5xl sm:text-6xl">
          Welcome
          <br />
          <em className="font-normal text-[var(--color-accent-bright)]">back.</em>
        </h1>
        <p className="mt-8 max-w-md text-base leading-relaxed text-[var(--color-ink-soft)]">
          Read-only by design. Your wallets and exchange data are aggregated
          here; orders happen elsewhere. As they should.
        </p>
        <p className="editorial-label mt-12">No account yet?</p>
        <p className="mt-2 text-base text-[var(--color-ink-soft)]">
          <Link
            href="/sign-up"
            className="border-b border-[var(--color-rule-strong)] pb-0.5 text-[var(--color-ink)] hover:border-[var(--color-accent-bright)]"
          >
            Create one →
          </Link>
        </p>
      </section>

      <section className="sm:col-span-5">
        <div className="border border-[var(--color-rule)] bg-[var(--color-surface)] p-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'oklch(0.48 0.14 25)',
                    brandAccent: 'oklch(0.62 0.16 25)',
                    brandButtonText: 'oklch(0.95 0.014 70)',
                    defaultButtonBackground: 'transparent',
                    defaultButtonBackgroundHover: 'oklch(0.24 0.012 50)',
                    defaultButtonBorder: 'oklch(0.32 0.014 50)',
                    defaultButtonText: 'oklch(0.95 0.014 70)',
                    dividerBackground: 'oklch(0.32 0.014 50)',
                    inputBackground: 'transparent',
                    inputBorder: 'oklch(0.32 0.014 50)',
                    inputBorderHover: 'oklch(0.46 0.018 50)',
                    inputBorderFocus: 'oklch(0.48 0.14 25)',
                    inputText: 'oklch(0.95 0.014 70)',
                    inputLabelText: 'oklch(0.78 0.014 70)',
                    inputPlaceholder: 'oklch(0.58 0.012 60)',
                    messageText: 'oklch(0.78 0.014 70)',
                    messageTextDanger: 'oklch(0.62 0.20 25)',
                    anchorTextColor: 'oklch(0.78 0.014 70)',
                    anchorTextHoverColor: 'oklch(0.62 0.16 25)',
                  },
                  radii: {
                    borderRadiusButton: '2px',
                    buttonBorderRadius: '2px',
                    inputBorderRadius: '2px',
                  },
                  fonts: {
                    bodyFontFamily: 'var(--font-onest), system-ui, sans-serif',
                    buttonFontFamily: 'var(--font-onest), system-ui, sans-serif',
                    inputFontFamily: 'var(--font-onest), system-ui, sans-serif',
                    labelFontFamily: 'var(--font-mono), ui-monospace, monospace',
                  },
                  fontSizes: {
                    baseLabelSize: '11px',
                  },
                },
              },
            }}
            providers={['google']}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=${encodeURIComponent(redirectTo)}`}
            view="sign_in"
            showLinks={false}
          />
        </div>
      </section>
    </main>
  );
}
