/**
 * Austrian FIFO tax engine — full implementation lands in Sprint 6.
 * Sprint 1 scope: type contracts + stub so other packages can depend on it.
 *
 * Reference: ÖkoStRefG 2022 + EcoSocial Tax Reform.
 * - Acquisitions from 01.03.2022: 27.5% KESt on realized gains, no speculation period.
 * - Acquisitions before 28.02.2021: legacy 1-year speculation period, tax-free thereafter.
 * - Transition window 01.03.2021–28.02.2022 has special rules.
 * - Crypto-to-crypto swaps from 2022: not taxable (caveat: stablecoin swaps disputed —
 *   modelled conservatively as taxable with a flag).
 */

export const KEST_RATE_AT = 0.275;

export const KEST_REGIME_CUTOFFS = {
  legacyEnd: new Date('2021-02-28T23:59:59Z'),
  transitionEnd: new Date('2022-02-28T23:59:59Z'),
  newRegimeStart: new Date('2022-03-01T00:00:00Z'),
} as const;

export type TaxRegime = 'legacy' | 'transition' | 'new';

export function classifyAcquisition(acquiredAt: Date): TaxRegime {
  if (acquiredAt <= KEST_REGIME_CUTOFFS.legacyEnd) return 'legacy';
  if (acquiredAt >= KEST_REGIME_CUTOFFS.newRegimeStart) return 'new';
  return 'transition';
}
