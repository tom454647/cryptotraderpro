import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    typedRoutes: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  },
};

// withSentryConfig wires the Sentry webpack plugin so source maps upload to
// our project on each prod build. In dev it's effectively a no-op.
const sentryWebpackPluginOptions = {
  silent: true,
  // Source-map upload only fires when this token is present (CI sets it).
  // Without it the wrapping is harmless.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  hideSourceMaps: true,
  // We disable telemetry to keep build logs clean.
  telemetry: false,
};

const sentryOptions = {
  // Tunnels Sentry events through our own host to avoid ad-blockers eating them.
  // Optional — only kicks in when explicitly enabled.
  tunnelRoute: process.env.NEXT_PUBLIC_SENTRY_TUNNEL === '1' ? '/monitoring' : undefined,
  // Disable the Sentry SDK's automatic instrumentation of fetch in dev — it
  // adds noise we don't need until we're tracing real traffic.
  disableLogger: process.env.NODE_ENV !== 'production',
};

export default process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions)
  : nextConfig;
