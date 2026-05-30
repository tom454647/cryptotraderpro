'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, EVM_CHAINS, type Chain, type SyncResult, type Wallet } from '@/lib/api';

function shortAddr(a: string): string {
  return a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a;
}

function chainLabel(c: Chain): string {
  return EVM_CHAINS.find((x) => x.value === c)?.label ?? c;
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Add-form state.
  const [chain, setChain] = useState<Chain>('ETHEREUM');
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Per-wallet busy/feedback state.
  const [busy, setBusy] = useState<Record<string, 'sync' | 'delete'>>({});
  const [notice, setNotice] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      setWallets(await api.get<Wallet[]>('/api/wallets'));
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load wallets');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addWallet(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    try {
      await api.post<Wallet>('/api/wallets', {
        chain,
        address: address.trim(),
        label: label.trim() || undefined,
      });
      setAddress('');
      setLabel('');
      await load();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Could not add wallet');
    } finally {
      setAdding(false);
    }
  }

  async function syncWallet(id: string) {
    setBusy((b) => ({ ...b, [id]: 'sync' }));
    setNotice((n) => ({ ...n, [id]: '' }));
    try {
      const res = await api.post<SyncResult>(`/api/wallets/${id}/sync`, undefined);
      setNotice((n) => ({
        ...n,
        [id]: `${res.positions} position${res.positions === 1 ? '' : 's'} · €${res.valueEur.toLocaleString(
          'de-AT',
          { maximumFractionDigits: 2 },
        )}`,
      }));
      await load();
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 503
          ? 'On-chain data not configured yet (needs ALCHEMY_API_KEY).'
          : err instanceof Error
            ? err.message
            : 'Sync failed';
      setNotice((n) => ({ ...n, [id]: msg }));
    } finally {
      setBusy((b) => {
        const next = { ...b };
        delete next[id];
        return next;
      });
    }
  }

  async function deleteWallet(id: string) {
    setBusy((b) => ({ ...b, [id]: 'delete' }));
    try {
      await api.delete(`/api/wallets/${id}`);
      await load();
    } catch (err) {
      setNotice((n) => ({ ...n, [id]: err instanceof Error ? err.message : 'Delete failed' }));
      setBusy((b) => {
        const next = { ...b };
        delete next[id];
        return next;
      });
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
      <p className="editorial-label">Sources · Watch-only</p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">
        Your <em className="font-normal text-[var(--color-accent-bright)]">wallets</em>.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
        Add a public address and we read its balances. Nothing is signed, nothing is moved —
        every wallet here is watch-only by design.
      </p>

      {/* Add form */}
      <form
        onSubmit={addWallet}
        className="mt-10 flex flex-col gap-4 border-t border-[var(--color-rule)] pt-8 sm:flex-row sm:items-end"
      >
        <label className="flex flex-col gap-2">
          <span className="editorial-label">Chain</span>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value as Chain)}
            className="rounded-none border-b border-[var(--color-rule-strong)] bg-transparent py-2 font-mono text-sm text-[var(--color-ink)] focus:border-[var(--color-accent-bright)] focus:outline-none"
          >
            {EVM_CHAINS.map((c) => (
              <option key={c.value} value={c.value} className="bg-[var(--color-surface)]">
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-2">
          <span className="editorial-label">Address</span>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x…"
            required
            className="rounded-none border-b border-[var(--color-rule-strong)] bg-transparent py-2 font-mono text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-accent-bright)] focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 sm:w-44">
          <span className="editorial-label">Label (optional)</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Cold storage"
            maxLength={40}
            className="rounded-none border-b border-[var(--color-rule-strong)] bg-transparent py-2 font-mono text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-accent-bright)] focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={adding}
          className="whitespace-nowrap border-b border-[var(--color-accent-bright)] pb-0.5 text-base text-[var(--color-ink)] hover:text-[var(--color-accent-bright)] disabled:opacity-50"
        >
          {adding ? 'Adding…' : 'Add wallet →'}
        </button>
      </form>
      {addError && (
        <p className="mt-3 font-mono text-xs text-[var(--color-danger)]">{addError}</p>
      )}

      {/* List */}
      <div className="mt-12">
        {loadError && (
          <p className="font-mono text-sm text-[var(--color-danger)]">{loadError}</p>
        )}

        {wallets && wallets.length === 0 && !loadError && (
          <p className="font-mono text-sm text-[var(--color-ink-muted)]">
            No wallets yet. Add one above to start aggregating.
          </p>
        )}

        {wallets && wallets.length > 0 && (
          <ul className="flex flex-col">
            {wallets.map((w) => (
              <li
                key={w.id}
                className="flex flex-col gap-2 border-t border-[var(--color-rule)] py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans font-medium text-[var(--color-ink)]">
                      {w.label || chainLabel(w.chain)}
                    </span>
                    <span className="editorial-label">{chainLabel(w.chain)}</span>
                  </div>
                  <span className="font-mono text-xs text-[var(--color-ink-muted)]">
                    {shortAddr(w.address)} ·{' '}
                    {w.lastSync
                      ? `synced ${new Date(w.lastSync).toLocaleString('de-AT')}`
                      : 'never synced'}
                  </span>
                  {notice[w.id] && (
                    <span className="font-mono text-xs text-[var(--color-accent-bright)]">
                      {notice[w.id]}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => void syncWallet(w.id)}
                    disabled={!!busy[w.id]}
                    className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] disabled:opacity-50"
                  >
                    {busy[w.id] === 'sync' ? 'Syncing…' : 'Sync'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteWallet(w.id)}
                    disabled={!!busy[w.id]}
                    className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] disabled:opacity-50"
                  >
                    {busy[w.id] === 'delete' ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-12 border-t border-[var(--color-rule)] pt-6 font-mono text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
        Read-only, always. We read public addresses and exchange data with read-only keys —
        CryptoTrader Pro never accepts, forwards, or executes an order.
      </p>
    </main>
  );
}
