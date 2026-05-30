import { createClient } from '@/lib/supabase/client';

/**
 * Browser-side client for the NestJS API. Every call carries the current
 * Supabase access token as a Bearer header — the API's global AuthGuard
 * rejects anything unauthenticated with a 401.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new ApiError(401, 'Your session has expired — please sign in again.');
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { ...(await authHeaders()), ...(init.headers ?? {}) },
    });
  } catch {
    throw new ApiError(0, 'Could not reach the API. Is it running on :3001?');
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const message =
      (body && typeof body === 'object' && 'message' in body
        ? String((body as { message: unknown }).message)
        : null) ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }
  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET', cache: 'no-store' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};

// ── Shared response shapes (mirror the API DTOs) ────────────────────────────

export type Chain =
  | 'ETHEREUM'
  | 'BSC'
  | 'POLYGON'
  | 'ARBITRUM'
  | 'OPTIMISM'
  | 'BASE'
  | 'AVALANCHE'
  | 'SOLANA';

export interface Wallet {
  id: string;
  address: string;
  chain: Chain;
  label: string | null;
  isWatchOnly: boolean;
  lastSync: string | null;
  createdAt: string;
}

export interface SyncResult {
  walletId: string;
  positions: number;
  valueEur: number;
  syncedAt: string;
}

export interface PortfolioAsset {
  asset: string;
  amount: number;
  valueEur: number | null;
  priceEur: number | null;
  sources: number;
}

export interface PortfolioView {
  totalValueEur: number;
  assets: PortfolioAsset[];
  walletCount: number;
  positionCount: number;
  pricedCoverage: number;
}

/** Chains the EVM connector can sync today. SOLANA lands in Sprint 4. */
export const EVM_CHAINS: { value: Chain; label: string }[] = [
  { value: 'ETHEREUM', label: 'Ethereum' },
  { value: 'BASE', label: 'Base' },
  { value: 'ARBITRUM', label: 'Arbitrum' },
  { value: 'OPTIMISM', label: 'Optimism' },
  { value: 'POLYGON', label: 'Polygon' },
  { value: 'BSC', label: 'BNB Chain' },
  { value: 'AVALANCHE', label: 'Avalanche' },
];
