import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

/**
 * Shared shell for every /legal/* page. Uses the same SiteHeader/SiteFooter
 * as the landing and pricing pages (single source of truth, responsive).
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20 sm:px-8">{children}</main>
      <SiteFooter />
    </>
  );
}
