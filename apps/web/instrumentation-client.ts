/**
 * Sentry client-side init — runs in the browser as soon as the page boots.
 * Replaces the legacy sentry.client.config.ts in Next.js 16.
 *
 * We use a low default trace sample rate (10%) and never enable replay in
 * dev. Replay turns on automatically only when NEXT_PUBLIC_SENTRY_REPLAY=1.
 *
 * Note: `captureRouterTransitionStart` arrived in Sentry SDK 9 — we're on
 * 8.50 right now, so we don't export it. Add it back when we bump to 9+.
 */
import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: process.env.NEXT_PUBLIC_SENTRY_REPLAY === '1' ? 0.1 : 0,
    replaysOnErrorSampleRate: process.env.NEXT_PUBLIC_SENTRY_REPLAY === '1' ? 1.0 : 0,
    integrations:
      process.env.NEXT_PUBLIC_SENTRY_REPLAY === '1'
        ? [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })]
        : [],
  });
}
