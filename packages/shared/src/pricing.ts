export type Tier = 'FREE' | 'PRO' | 'TRADER';

export interface TierLimits {
  wallets: number | 'unlimited';
  exchanges: number | 'unlimited';
  taxReports: boolean;
  whaleAlerts: boolean;
  kolSentiment: boolean;
  apiAccess: boolean;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  FREE: {
    wallets: 1,
    exchanges: 1,
    taxReports: false,
    whaleAlerts: false,
    kolSentiment: false,
    apiAccess: false,
  },
  PRO: {
    wallets: 'unlimited',
    exchanges: 5,
    taxReports: true,
    whaleAlerts: false,
    kolSentiment: false,
    apiAccess: false,
  },
  TRADER: {
    wallets: 'unlimited',
    exchanges: 'unlimited',
    taxReports: true,
    whaleAlerts: true,
    kolSentiment: true,
    apiAccess: true,
  },
};

export const TIER_PRICING_EUR = {
  FREE: { monthly: 0, yearly: 0 },
  PRO: { monthly: 9.9, yearly: 99 },
  TRADER: { monthly: 24.9, yearly: 249 },
} as const;
