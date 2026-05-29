import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { TIER_LIMITS, TIER_PRICING_EUR, type Tier } from '@cryptotrader/shared';

export const metadata: Metadata = {
  title: 'Pricing — CryptoTrader Pro',
};

interface TierCardProps {
  tier: Tier;
  number: string;          // editorial chapter style: "01", "02", "03"
  name: string;            // "Free" / "Pro" / "Trader"
  tagline: string;
}

function priceLine(tier: Tier): string {
  const p = TIER_PRICING_EUR[tier];
  if (p.monthly === 0) return 'Free';
  return `€${p.monthly.toFixed(2)} / month · €${p.yearly} / year`;
}

function limitsList(tier: Tier): string[] {
  const l = TIER_LIMITS[tier];
  const out: string[] = [];
  out.push(`${l.wallets === 'unlimited' ? 'Unlimited' : l.wallets} wallets`);
  out.push(`${l.exchanges === 'unlimited' ? 'Unlimited' : l.exchanges} exchange accounts`);
  out.push(`Austrian tax report: ${l.taxReports ? 'included' : 'not in this tier'}`);
  out.push(`Whale alerts: ${l.whaleAlerts ? 'on held assets only' : 'not in this tier'}`);
  out.push(`KOL sentiment: ${l.kolSentiment ? 'included' : 'not in this tier'}`);
  out.push(`API access: ${l.apiAccess ? 'included' : 'not in this tier'}`);
  return out;
}

function TierColumn({ tier, number, name, tagline }: TierCardProps) {
  return (
    <article className="border-t border-[var(--color-rule)] pt-8">
      <p className="editorial-label">{`${number} — ${name}`}</p>
      <p className="display mt-4 text-3xl">{priceLine(tier)}</p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-ink-soft)]">
        {tagline}
      </p>
      <ul className="mt-6 space-y-2 font-mono text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {limitsList(tier).map((line) => (
          <li key={line}>· {line}</li>
        ))}
      </ul>
      <button
        type="button"
        disabled
        className="mt-8 cursor-not-allowed border-b border-[var(--color-rule-strong)] pb-0.5 text-sm text-[var(--color-ink-muted)]"
      >
        Subscribe — coming soon
      </button>
    </article>
  );
}

export default function PricingPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-12">
          <div className="sm:col-span-7">
            <p className="editorial-label">Issue 01 · Pricing</p>
            <h1 className="display mt-6 text-5xl sm:text-7xl">
              Three tiers.
              <br />
              <em className="font-normal text-[var(--color-accent-bright)]">
                One promise.
              </em>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
              CryptoTrader Pro charges for the subscription and shares a
              transparent affiliate cut with exchanges you choose to use via
              our links. No paywalled MiCAR safety. No upsell theatre.
            </p>
          </div>

          <aside className="border-l border-[var(--color-rule)] pl-8 sm:col-span-5">
            <p className="editorial-label">Why three?</p>
            <p className="mt-6 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
              <strong className="text-[var(--color-ink)]">Free</strong> exists
              so curious operators can verify our position before paying.{' '}
              <strong className="text-[var(--color-ink)]">Pro</strong> is the
              tier we expect most users on — one of everything,
              Austrian-tax-ready.{' '}
              <strong className="text-[var(--color-ink)]">Trader</strong> turns
              on the active-intelligence stack for heavy users.
            </p>
            <p className="mt-4 font-mono text-sm leading-relaxed text-[var(--color-ink-soft)]">
              Cancel any month. EU 14-day withdrawal applies.
            </p>
          </aside>
        </div>

        <section className="mt-24 grid gap-x-12 gap-y-12 sm:grid-cols-3">
          <TierColumn
            tier="FREE"
            number="01"
            name="Free"
            tagline="Read one wallet, one exchange, see the editorial in motion."
          />
          <TierColumn
            tier="PRO"
            number="02"
            name="Pro"
            tagline="The everyday-operator tier. Unlimited wallets, Austrian tax, bridge & DCA tools, affiliate deeplinks."
          />
          <TierColumn
            tier="TRADER"
            number="03"
            name="Trader"
            tagline="Plus whale-alerts on held assets, KOL sentiment, trade journal with AI coach, Telegram bot, API."
          />
        </section>

        <hr className="my-24 border-t border-[var(--color-rule)]" />

        <section className="grid gap-x-12 gap-y-8 sm:grid-cols-12">
          <div className="sm:col-span-8">
            <p className="editorial-label">A note on fees beyond ours</p>
            <h2 className="display mt-4 text-3xl">
              We don&rsquo;t add a margin to what exchanges already charge you.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-soft)]">
              Trading fees, network gas, withdrawal costs, bridge slippage —
              those are paid on the platforms you choose, at their rates.
              CryptoTrader Pro only charges its subscription. If you click
              through an affiliate link to e.g. Binance, the price you pay
              there is identical to going directly. See{' '}
              <Link href="/legal/affiliate-disclosure" className="underline">
                our affiliate disclosure
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
