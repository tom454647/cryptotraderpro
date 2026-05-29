import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal-shell';

export const metadata: Metadata = {
  title: 'Imprint — CryptoTrader Pro',
};

export default function ImprintPage() {
  return (
    <LegalShell
      label="Issue 01 · Imprint"
      title="Imprint"
      lastUpdated="2026-05-25"
      sidebar={
        <>
          <p className="editorial-label">Operator phase</p>
          <p className="mt-6 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
            Phase 1 (now): OptiRisk Consulting e.U., a sole proprietorship
            under Austrian law.
          </p>
          <p className="mt-4 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
            Phase 2 (after €10k revenue or Q4 2026, whichever sooner):
            transition to CryptoTrader Pro GmbH or FlexCo, Vienna.
          </p>
        </>
      }
    >
      <h2>Operator</h2>
      <p>
        <strong>OptiRisk Consulting e.U.</strong>
        <br />
        Thomas Michalik
        <br />
        Vienna, Austria
      </p>
      <p>
        Email:{' '}
        <a href="mailto:hello@cryptotraderpro.io">hello@cryptotraderpro.io</a>
      </p>

      <h2>Information per § 5 ECG</h2>
      <p>
        Business purpose: information-society service for aggregating publicly
        available crypto-asset data and providing tax-calculation assistance.
      </p>
      <p>
        Member of the Austrian Chamber of Commerce (WKO), professional law
        applicable: GewO 1994. Supervisory authority: Magistratisches
        Bezirksamt of the relevant district, Vienna.
      </p>

      <h2>Not a Crypto-Asset Service Provider</h2>
      <p>
        OptiRisk Consulting e.U., operating CryptoTrader Pro, is{' '}
        <strong>
          not a Crypto-Asset Service Provider (CASP) under Regulation (EU)
          2023/1114 (MiCAR)
        </strong>
        . We do not execute, route, or receive orders, do not custody assets,
        and do not provide personalised investment advice. The licence-free
        posture is the product.
      </p>

      <h2>EU online dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute
        resolution at{' '}
        <a href="https://ec.europa.eu/consumers/odr" rel="noreferrer">
          ec.europa.eu/consumers/odr
        </a>
        . We are not, however, obliged to participate in dispute-resolution
        proceedings before a consumer arbitration board and do not do so.
      </p>
    </LegalShell>
  );
}
