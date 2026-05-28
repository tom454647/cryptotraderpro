interface Row {
  n: string;
  pain: string;       // the scene's complaint, in its own voice
  answer: string;     // our short answer headline
  detail: string;     // one line of substantiation
}

/**
 * The manifesto — the prominent "why we exist" section on the landing.
 * Each row pairs a real pain point of the crypto scene (left, muted,
 * in quotes — the scene's own voice) with our answer (right, ink +
 * a burgundy keyword). Editorial index cadence: numbered, hairline
 * rules between rows, no cards, no icons.
 *
 * Copy is operator-iterated — structure and hierarchy are what's locked.
 */
const ROWS: Row[] = [
  {
    n: '01',
    pain: '“Zero fees.” Then the spread quietly skims half a percent off every trade.',
    answer: 'The true cost of a trade — across every exchange.',
    detail: 'Fee + hidden spread + network + withdrawal, side by side. The “0% fee” venue is rarely the cheapest.',
  },
  {
    n: '02',
    pain: 'Your crypto is scattered across five wallets, three exchanges, DeFi and a few NFTs. No tool shows all of it at once.',
    answer: 'One EUR view. Every wallet, exchange, chain, position.',
    detail: 'CEX, DEX, DeFi, staking, LP, NFT — consolidated nightly into a single statement.',
  },
  {
    n: '03',
    pain: 'Austrian crypto tax is a nightmare, and the generic exporters don’t speak ÖkoStRefG.',
    answer: 'FIFO an auditor accepts.',
    detail: 'Altbestand vs. Neubestand split correctly, KESt computed, FinanzOnline + Steuerberater export.',
  },
  {
    n: '04',
    pain: 'You hear about the whale dump and the rug pull after your bag is already down 40%.',
    answer: 'Signals on the assets you actually hold.',
    detail: 'Whale moves, KOL sentiment, rug warnings — filtered to your holdings. The rest is noise.',
  },
  {
    n: '05',
    pain: 'You repeat the same FOMO buys and panic sells, and nobody ever shows you the pattern.',
    answer: 'An AI coach that reflects your own behaviour back.',
    detail: 'Claude reads your trade history and asks the questions a good mentor would. A mirror, not advice.',
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
