/**
 * Current Terms version — must be bumped (with the date) every time the
 * /legal/terms page changes in a way that needs re-acceptance.
 *
 * Format: YYYY-MM-DD-vN (sortable, human-readable, never ambiguous).
 * The backend stores this string in User.acceptedTermsVersion so we can
 * detect users on a stale version and re-prompt acceptance.
 */
export const CURRENT_TERMS_VERSION = '2026-05-25-v1';

export const MICAR_ACCEPTANCE_STATEMENT_EN =
  'I understand that CryptoTrader Pro is an information service, not a Crypto-Asset Service Provider (CASP) under MiCAR. ' +
  'It does not execute orders, hold assets, or give personalised investment advice. All trading decisions remain with me, ' +
  'executed on the platform of my choice.';

export const MICAR_ACCEPTANCE_STATEMENT_DE =
  'Ich verstehe, dass CryptoTrader Pro eine Informationsdienstleistung ist und kein Crypto-Asset Service Provider (CASP) ' +
  'gemäß MiCAR. CryptoTrader Pro führt keine Orders aus, verwahrt keine Assets und gibt keine personalisierte Anlageberatung. ' +
  'Alle Handelsentscheidungen treffe ich eigenverantwortlich auf der Plattform meiner Wahl.';
