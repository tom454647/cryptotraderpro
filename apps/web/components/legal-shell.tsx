import type { ReactNode } from 'react';

interface LegalShellProps {
  label: string;            // e.g. "ISSUE 01 · TERMS"
  title: string;            // human-readable page name
  lastUpdated: string;      // YYYY-MM-DD
  sidebar: ReactNode;       // mono editorial column on the right
  children: ReactNode;      // body prose
}

/**
 * The 8/4 editorial grid that every legal page renders inside. Keeps the
 * Vienna-editorial cadence consistent across Terms, Privacy, Imprint,
 * Affiliate-Disclosure.
 */
export function LegalShell({ label, title, lastUpdated, sidebar, children }: LegalShellProps) {
  return (
    <div className="grid gap-x-12 gap-y-16 sm:grid-cols-12">
      <div className="sm:col-span-8">
        <p className="editorial-label">{label}</p>
        <h1 className="display mt-6 text-5xl sm:text-6xl">{title}</h1>
        <p className="mt-4 font-mono text-xs text-[var(--color-ink-muted)]">
          Last updated {lastUpdated} · Placeholder — final wording to be reviewed by counsel
        </p>

        <div className="prose-legal mt-12 max-w-2xl">{children}</div>
      </div>

      <aside className="border-l border-[var(--color-rule)] pl-8 sm:col-span-4">
        {sidebar}
      </aside>
    </div>
  );
}
