'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

/**
 * PostHog initialiser + pageview tracker.
 *
 * Why a custom pageview listener instead of letting PostHog autocapture?
 * Next.js App Router uses client-side soft navigation — PostHog's default
 * autocapture only fires on initial load, missing every subsequent route
 * change. So we capture $pageview manually whenever the pathname changes.
 *
 * EU-residency: NEXT_PUBLIC_POSTHOG_HOST must point at https://eu.posthog.com
 * per ADR 0003. Don't fall back to the US host.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;

    posthog.init(key, {
      api_host: host,
      capture_pageview: false,         // we handle pageviews ourselves below
      capture_pageleave: true,
      person_profiles: 'identified_only',
      // GDPR-friendly defaults — no replays, no autocapture in dev.
      autocapture: process.env.NODE_ENV === 'production',
      disable_session_recording: true,
      // Don't ship debug noise in prod.
      loaded: (ph) => {
        if (process.env.NODE_ENV !== 'production') ph.debug(false);
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      {children}
      <PageviewTracker />
    </PHProvider>
  );
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const params = searchParams?.toString();
    const url = params ? `${pathname}?${params}` : pathname;
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture('$pageview', { $current_url: window.location.origin + url });
    }
  }, [pathname, searchParams]);

  return null;
}
