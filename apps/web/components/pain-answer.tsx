interface Row {
  n: string;
  pain: string;       // the scene's complaint, in its own voice
  answer: string;     // our short answer headline
  detail: string;     // one line of substantiation
}

/**
 * The manifesto — the prominent "why we exist" section on the landing.
 * Each row pairs a pain point of the crypto scene (left, muted, in quotes)
 * with our answer (right, ink + burgundy keyword). Editorial index cadence.
 *
 * The six rows map 1:1 to the canonical USP pillars in CLAUDE.md (BRIEFING
 * §2 features + True Cost). Do NOT invent USPs here — keep tied to the
 * briefing. Copy is operator-iterated; the pillar each row represents is not.
 */
const ROWS: Row[] = [
  {
    n: '01',
    pain: '“Zero fees.” Then the spread, the gas and the withdrawal quietly make the trade cost more — somewhere you never see it.',
    answer: 'True cost, compared across exchanges.',
    detail: 'Advertised fee plus the hidden spread, network and withdrawal — computed side by side, so the “0% fee” venue never fools you.',
  },
  {
    n: '02',
    pain: 'Your holdings sit across exchange accounts, on-chain wallets, DeFi, staking, LPs and NFTs. No single screen shows the lot.',
    answer: 'Everything you own, in one EUR view.',
    detail: 'CEX, DEX, DeFi, staking, LP and NFT consolidated into one statement, with profit and loss per asset across every source.',
  },
  {
    n: '03',
    pain: 'Austrian crypto tax means ÖkoStRefG, Altbestand cutoffs and KESt — and the generic trackers model none of it.',
    answer: 'FIFO an auditor accepts.',
    detail: 'ÖkoStRefG-2022 rules, Altbestand vs. Neubestand split correctly, KESt computed, FinanzOnline + Steuerberater export.',
  },
  {
    n: '04',
    pain: 'Bridging and buying mean tab-hopping between aggregators, guessing at fees, slippage and the right moment.',
    answer: 'Compare bridges, simulate slippage, plan your DCA.',
    detail: 'LiFi bridge quotes side by side, a slippage simulator, and a DCA planner. We show the numbers; you execute on the platform you choose.',
  },
  {
    n: '05',
    pain: 'You hear about the whale dump, the KOL call and the rug after it already moved your bag.',
    answer: 'Signals on the assets you actually hold.',
    detail: 'Whale moves, KOL sentiment and rug warnings, filtered to your holdings — not the whole noisy market.',
  },
  {
    n: '06',
    pain: 'You repeat the same FOMO buys and panic sells, and no tool ever reflects the pattern back.',
    answer: 'An AI coach for your own trades.',
    detail: 'Claude reads your trade history and asks the questions a good mentor would. Reflection on your behaviour — not advice.',
  },
];

export function PainAnswer() {
  return (
    <section>
      <p className="editorial-label">Why CryptoTrader Pro exists</p>
      <h2 className="display mt-6 text-5xl sm:text-6xl">
        The scene&rsquo;s pain.
        <br />
        <em className="font-normal text-[var(--color-accent-bright)]">Our answer.</em>
      </h2>

      <div className="mt-16">
        {ROWS.map((row) => (
          <div
            key={row.n}
            className="grid gap-x-8 gap-y-3 border-t border-[var(--color-rule)] py-9 sm:grid-cols-12"
          >
            <p className="font-mono text-sm text-[var(--color-accent-bright)] sm:col-span-1">
              {row.n}
            </p>
            <p className="font-mono text-sm italic leading-relaxed text-[var(--color-ink-muted)] sm:col-span-5">
              {row.pain}
            </p>
            <div className="sm:col-span-6">
              <h3 className="display text-2xl text-[var(--color-ink)]">{row.answer}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {row.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
