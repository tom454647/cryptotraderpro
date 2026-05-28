import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal-shell';

export const metadata: Metadata = {
  title: 'Terms of Service — CryptoTrader Pro',
};

export default function TermsPage() {
  return (
    <LegalShell
      label="Issue 01 · Terms of Service"
      title="Terms of Service"
      lastUpdated="2026-05-25"
      sidebar={
        <>
          <p className="editorial-label">On our legal position</p>
          <p className="mt-6 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
            CryptoTrader Pro is offered as an Information Society Service under
            Directive 2000/31/EC. We are <strong>not</strong> a Crypto-Asset
            Service Provider under MiCAR.
          </p>
          <p className="mt-4 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
            Jurisdiction: Vienna, Austria · Governing law: Austrian law
          </p>
        </>
      }
    >
      <blockquote>
        We read. You decide. The licence-free posture is the product.
      </blockquote>

      <h2>1. What CryptoTrader Pro is</h2>
      <p>
        CryptoTrader Pro is an information and aggregation service operated by
        OptiRisk Consulting e.U. (Vienna, Austria). It reads publicly available
        wallet data and read-only exchange API data on your instruction,
        consolidates it into a single view, and offers tax-calculation
        assistance and market information.
      </p>

      <h2>2. What CryptoTrader Pro is not</h2>
      <p>
        We do <strong>not</strong>, under any circumstance:
      </p>
      <ul>
        <li>Accept, route, transmit, or execute orders on your behalf</li>
        <li>Custody crypto-assets, fiat funds, or private keys</li>
        <li>Provide personalised investment advice</li>
        <li>Operate a trading venue or matching system</li>
        <li>Automatically rebalance, trade, or move assets</li>
      </ul>
      <p>
        These exclusions are load-bearing for our classification as an
        Information Society Service rather than a Crypto-Asset Service
        Provider (CASP) under Regulation (EU) 2023/1114 (MiCAR). They are
        enforced in code (see our open compliance docs on GitHub) and remain
        invariant for as long as CryptoTrader Pro exists.
      </p>

      <h2>3. Read-only API keys</h2>
      <p>
        When you connect an exchange account, you must supply{' '}
        <strong>read-only</strong> API credentials only. We re-validate the
        read-only scope of every key on add and every seven days thereafter.
        If you knowingly supply a key with trading or withdrawal scopes, you
        breach these Terms and we suspend the integration without notice.
      </p>

      <h2>4. Your trading decisions remain yours</h2>
      <p>
        Every order, swap, deposit, or withdrawal happens on the exchange,
        bridge, or wallet of your choice — not here. Affiliate links we
        provide are transparent and disclosed (see{' '}
        <a href="/legal/affiliate-disclosure">Affiliate Disclosure</a>).
        Whether you act on the information we surface is your responsibility
        alone.
      </p>

      <h2>5. Tax helper output is not tax advice</h2>
      <p>
        The Austrian tax engine (FIFO, KESt regime cutoffs, FinanzOnline
        export) is a technical helper. It is not a substitute for advice
        from a qualified Steuerberater. Verify every figure with your tax
        professional before submission.
      </p>

      <h2>6. Subscription, withdrawal, cancellation</h2>
      <p>
        Subscriptions renew automatically until cancelled. EU consumers have a
        14-day right of withdrawal under Directive 2011/83/EU, with the
        statutory exception for digital services begun with explicit consent.
        Cancel any time inside the dashboard; refund handling follows EU
        consumer rules.
      </p>

      <h2>7. Liability</h2>
      <p>
        We exclude liability for trading losses, missed opportunities, and
        third-party platform failures to the maximum extent permitted under
        Austrian consumer-protection law. We remain fully liable for damages
        caused by intent or gross negligence.
      </p>

      <h2>8. Disputes</h2>
      <p>
        Exclusive place of jurisdiction is Vienna, Austria; Austrian law
        applies. Mandatory consumer-protection provisions of your country of
        residence remain unaffected.
      </p>

      <p className="mt-12 text-xs text-[var(--color-ink-muted)]">
        Status: draft. Final wording to be reviewed by Stadler Völkel or BPV
        Hügel before public launch. This page is published as a binding
        statement of position — not as a finished legal document.
      </p>
    </LegalShell>
  );
}
