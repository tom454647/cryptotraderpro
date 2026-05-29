/**
 * Sentry must initialise BEFORE any NestJS module is imported, so this file
 * runs at the very top of main.ts. ConfigService is not available yet —
 * pull straight from process.env.
 *
 * EU-residency note: the DSN points at `o*.ingest.de.sentry.io` (Frankfurt),
 * per ADR 0003. Switching to `*.ingest.sentry.io` (US) would silently break
 * that — keep the EU host in the DSN.
 */
import * as Sentry from '@sentry/nestjs';

// CPU/memory profiling is intentionally NOT wired here.
// @sentry/profiling-node ships pre-built native binaries per platform; the
// 8.50 release mis-resolves the Windows pre-built on x64 hosts (it tries to
// require the arm64 variant). Re-add nodeProfilingIntegration when we either
// bump to a Sentry release that fixes the resolver or move the API into
// Linux containers permanently (Railway runs Linux — production won't hit
// this path; only Windows dev does).

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    // Performance sampling: lower in prod, full in dev.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Strip anything that smells like a secret before sending.
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },
    // Don't break local dev when the network is flaky.
    sendDefaultPii: false,
  });
}
