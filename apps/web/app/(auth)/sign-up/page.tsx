'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand-logo';

/**
 * Editorial sign-up. Mirrors the sign-in page's two-column layout.
 * The terms-acceptance copy lives on the left as a serious statement —
 * the full acknowledgement modal lives at /accept-terms and is gated
 * by the middleware after first sign-in.
 */
export default function SignUpPage(): React.ReactElement {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Land on /dashboard — middleware will redirect to /accept-terms
        // because acceptedTermsAt is still null.
        router.push('/dashboard');
        router.refresh();
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-x-12 gap-y-12 px-8 py-16 sm:grid-cols-12 sm:items-center">
      <section className="sm:col-span-7">
        <BrandLogo className="text-xl text-[var(--color-ink)]" />
        <p className="editorial-label mt-12">New operator</p>
        <h1 className="display mt-6 text-5xl sm:text-6xl">
          Start
          <br />
          <em className="font-normal text-[var(--color-accent-bright)]">reading.</em>
        </h1>
        <p className="mt-8 max-w-md text-base leading-relaxed text-[var(--color-ink-soft)]">
          We aggregate. You decide. One step after sign-up: you acknowledge
          our MiCAR position — that we are an information service, not a
          Crypto-Asset Service Provider.
        </p>

        <p className="editorial-label mt-12">By creating an account</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">
          you agree to our{' '}
          <Link href="/legal/terms" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/legal/privacy" className="underline">
            Privacy Policy
          </Link>
          . Your portfolio data lives in our EU Postgres — never custodied,
          never transmitted to a trading venue on your behalf.
        </p>

        <p className="editorial-label mt-12">Already on board?</p>
        <p className="mt-2 text-base text-[var(--color-ink-soft)]">
          <Link
            href="/sign-in"
            className="border-b border-[var(--color-rule-strong)] pb-0.5 text-[var(--color-ink)] hover:border-[var(--color-accent-bright)]"
          >
            Sign in →
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
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=/dashboard`}
            view="sign_up"
            showLinks={false}
          />
        </div>
      </section>
    </main>
  );
}
