'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand-logo';

export default function SignUpPage(): React.ReactElement {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // After sign-up the user lands at /dashboard, which the terms-acceptance
        // middleware (Sprint 2.5) will redirect to /accept-terms first.
        router.push('/dashboard');
        router.refresh();
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-stretch justify-center gap-8 px-6">
      <header className="flex flex-col items-start gap-3">
        <BrandLogo className="h-8 w-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Create your CryptoTrader Pro account</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          One view across every wallet, exchange, DeFi position and NFT.
        </p>
      </header>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#6366f1',
                brandAccent: '#a855f7',
                inputBackground: 'transparent',
                inputBorder: 'rgba(255,255,255,0.15)',
                inputBorderHover: 'rgba(255,255,255,0.35)',
                inputBorderFocus: '#6366f1',
                inputText: '#f1f5f9',
                inputLabelText: '#cbd5e1',
                inputPlaceholder: '#64748b',
                messageText: '#cbd5e1',
                messageTextDanger: '#fca5a5',
                anchorTextColor: '#cbd5e1',
                dividerBackground: 'rgba(255,255,255,0.1)',
              },
              radii: {
                buttonBorderRadius: '8px',
                inputBorderRadius: '8px',
              },
            },
          },
        }}
        providers={['google']}
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=/dashboard`}
        view="sign_up"
        showLinks={false}
      />

      <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
        By creating an account you agree to our{' '}
        <Link href="/legal/terms" className="underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/legal/privacy" className="underline">
          Privacy Policy
        </Link>
        . CryptoTrader Pro is an information service, not a Crypto-Asset Service Provider (CASP)
        under MiCAR — no order execution, no custody, no personalised advice.
      </p>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-[var(--color-text-primary)] underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
