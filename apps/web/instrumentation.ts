/**
 * Next.js calls this once per server boot. We forward to the Sentry init
 * for the correct runtime (Node.js vs Edge), so a single Sentry config
 * doesn't end up mismatched between the two.
 *
 * Pattern is Next.js 15+ / 16 recommended — replaces the legacy
 * sentry.server.config.ts / sentry.edge.config.ts pair.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Next.js 15+ calls `onRequestError` for unhandled server-component errors;
// Sentry SDK 8 exports the implementation as `captureRequestError`.
export { captureRequestError as onRequestError } from '@sentry/nextjs';
