import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal-shell';

export const metadata: Metadata = {
  title: 'Privacy Policy — CryptoTrader Pro',
};

export default function PrivacyPage() {
  return (
    <LegalShell
      label="Issue 01 · Privacy"
      title="Privacy Policy"
      lastUpdated="2026-05-25"
      sidebar={
        <>
          <p className="editorial-label">EU-only data residency</p>
          <p className="mt-6 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
            Every vendor that touches your personal data is hosted in the
            European Union — typically Frankfurt. We rejected vendors with
            US-only data residency by design (ADR 0003).
          </p>
          <p className="mt-4 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
            On-chain providers and the LLM coach receive only
            pseudonymous/public data — no userId, no email, no name.
          </p>
        </>
      }
    >
      <blockquote>
        Your portfolio data lives in our EU Postgres. Full stop.
      </blockquote>

      <h2>1. Who we are</h2>
      <p>
        Controller is OptiRisk Consulting e.U., Vienna, Austria. Contact:{' '}
        <a href="mailto:hello@cryptotraderpro.io">hello@cryptotraderpro.io</a>.
        On €10k annual revenue we transition operations to CryptoTrader Pro
        GmbH; we update this notice and notify all users at that time.
      </p>

      <h2>2. What we process and why</h2>
      <h3>Account data</h3>
      <p>
        Email, hashed password (or OAuth identifier), language, tax residency.
        Legal basis: contract performance, Art. 6 (1)(b) GDPR.
      </p>
      <h3>Portfolio data</h3>
      <p>
        Wallet addresses you connect, encrypted read-only exchange API keys,
        positions and transactions read from those sources, calculated tax
        lots. Legal basis: contract performance, Art. 6 (1)(b) GDPR.
      </p>
      <h3>Usage analytics</h3>
      <p>
        Pageviews and feature interactions via PostHog (EU-Frankfurt).
        Aggregated, no replays, no session recordings. Legal basis: legitimate
        interest in product improvement, Art. 6 (1)(f) GDPR — opt out in
        Settings.
      </p>
      <h3>Error telemetry</h3>
      <p>
        Stack traces and request metadata via Sentry (EU-Frankfurt) when our
        services fail. Authorization headers and cookies are stripped before
        transmission.
      </p>

      <h2>3. Vendors and where data lives</h2>
      <ul>
        <li>Railway (EU-Frankfurt) — application servers + Postgres + Redis</li>
        <li>Vercel (EU-Edge) — frontend rendering</li>
        <li>Supabase (EU-Frankfurt) — authentication identity</li>
        <li>Stripe (EU-Ireland) — payments + invoicing + EU MOSS VAT</li>
        <li>Sentry (EU-Frankfurt, <code>sentry.de</code> region) — error monitoring</li>
        <li>PostHog (<code>eu.posthog.com</code>) — product analytics</li>
        <li>Resend (EU region) — transactional email</li>
      </ul>
      <p>
        On-chain providers (Alchemy, Helius, CoinGecko, Zerion) and Anthropic
        (LLM coach) receive only anonymised request data — wallet addresses
        are public on-chain; LLM prompts carry no userId, email, or name.
      </p>

      <h2>4. Your rights</h2>
      <p>You may at any time:</p>
      <ul>
        <li>Request a copy of your data (Art. 15)</li>
        <li>Correct inaccurate data (Art. 16)</li>
        <li>Delete your account and all derived data (Art. 17)</li>
        <li>Export your data in a portable format (Art. 20)</li>
        <li>Object to analytics processing (Art. 21)</li>
        <li>Lodge a complaint with the Austrian Data Protection Authority</li>
      </ul>
      <p>
        In-app self-service is available for export and deletion. For anything
        else, reply-by-email is the fastest path.
      </p>

      <h2>5. Retention</h2>
      <p>
        Account data is retained for the lifetime of your subscription plus 30
        days for reactivation. Transaction history and tax-relevant data are
        retained for seven years under Austrian record-keeping rules
        (§§ 132, 207 BAO). Analytics events expire after 12 months.
      </p>

      <h2>6. International transfers</h2>
      <p>
        We do not transfer personal data outside the EU/EEA. Where an on-chain
        provider routes anonymous read-requests through a US endpoint, the
        data exchanged is either pseudonymous public on-chain information or
        anonymised market queries, not personal data.
      </p>

      <p className="mt-12 text-xs text-[var(--color-ink-muted)]">
        Status: draft. Final wording to be DPO-reviewed before public launch.
      </p>
    </LegalShell>
  );
}
