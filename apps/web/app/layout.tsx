import type { Metadata } from 'next';
import { Instrument_Serif, IBM_Plex_Mono, Onest } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

// Onest — modern, OFL, distinct shape (not Inter, not Geist).
// Google Fonts hosted, so self-hosted-by-next/font with zero CLS.
const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CryptoTrader Pro — Read it. Don’t trade it.',
  description:
    'A Vienna-built portfolio tool that aggregates every wallet, exchange, DeFi position and NFT into one read-only view. Austrian-tax-ready. MiCAR-licence-free by design.',
  metadataBase: new URL('https://cryptotraderpro.io'),
  openGraph: {
    title: 'CryptoTrader Pro — Read it. Don’t trade it.',
    description:
      'A Vienna-built portfolio tool. Read-only. Austrian-tax-ready. MiCAR-licence-free by design.',
    url: 'https://cryptotraderpro.io',
    siteName: 'CryptoTrader Pro',
    locale: 'en',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${plexMono.variable} ${onest.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
