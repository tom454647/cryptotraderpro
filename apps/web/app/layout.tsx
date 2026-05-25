import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CryptoTrader Pro — Read-Only Portfolio Aggregation',
  description:
    'Aggregate your crypto holdings across wallets and exchanges in read-only mode. Tax-ready, MiCAR-compliant, you stay in control.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
