import { DashboardNav } from '@/components/dashboard-nav';
import { SiteFooter } from '@/components/site-footer';

/**
 * Shell for every authenticated dashboard route. The middleware already
 * guarantees a session + accepted terms by the time we render here.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
