import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal-shell';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — CryptoTrader Pro',
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalShell
      label="Issue 01 · Affiliate Disclosure"
      title="Affiliate Disclosure"
      lastUpdated="2026-05-25"
      sidebar={
        <>
          <p className="editorial-label">In one line</p>
          <p className="mt-6 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
            We earn a referral commission when you open accounts or trade on
            certain exchanges via our links. The price for you is identical.
          </p>
          <p className="mt-4 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
            We never sort or rank exchanges by affiliate payout. Period.
          </p>
        </>
      }
    >
      <blockquote>
        Transparent commission. Independent ranking. Period.
      </blockquote>

      <h2>1. Two revenue streams</h2>
      <p>
        CryptoTrader Pro earns money in two ways:
      </p>
      <ul>
        <li>
          <strong>Subscription fees</strong> — the Free, Pro, and Trader tiers
          you pay for directly.
        </li>
        <li>
          <strong>Affiliate revenue</strong> — a share of trading fees that
          partner exchanges pay us when you open an account via a link from
          our app and trade on their platform. The price you pay on the
          exchange is identical whether you came via us or arrived directly.
        </li>
      </ul>

      <h2>2. Which partners and at what rate</h2>
      <p>
        Current affiliate relationships (subject to change; we update this
        list whenever a new one is added):
      </p>
      <ul>
        <li>
          <strong>Binance</strong> — referral ID <code>376216722</code>, 20–40%
          trading-fee share depending on volume tier
        </li>
        <li>
          <strong>Bybit</strong> — referral ID <code>AYOLGJP</code>, up to 30%
          trading-fee share
        </li>
        <li>
          <strong>MEXC</strong> — referral ID <code>mexc-3nPe1</code>, up to
          50% trading-fee share
        </li>
        <li>
          <strong>Bitpanda, OKX, KuCoin</strong> — relationships pending;
          listed here when active
        </li>
      </ul>

      <h2>3. How we keep rankings honest</h2>
      <p>
        Our Bridge-Compare view, exchange-fee comparison, and DCA planner sort
        by the metric you select (lowest spread, lowest fee, fastest
        settlement) — <strong>never</strong> by affiliate payout. We will not
        ship an interface that hides a cheaper option behind a higher-paying
        one. If we ever do, it's a bug; report it.
      </p>

      <h2>4. How clicks are recorded</h2>
      <p>
        Each affiliate click is logged with your user identifier, the partner,
        the originating context inside our app, and the destination URL. You
        can see your own click history in Settings → Privacy → Affiliate
        clicks. This data exists to honour audit-trail obligations and is
        retained for seven years.
      </p>

      <h2>5. Your decision is your decision</h2>
      <p>
        Whether you click an affiliate link is your call. You can always go to
        the exchange directly. We surface the link because in many cases the
        exchange offers a small sign-up bonus only via referral.
      </p>
    </LegalShell>
  );
}
