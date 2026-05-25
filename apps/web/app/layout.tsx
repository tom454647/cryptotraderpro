import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Refract — Your crypto, refracted',
  description:
    'Refract aggregates your wallets, exchanges, DeFi and NFTs into one clear view. Austrian tax-ready, MiCAR-compliant, read-only by design.',
  metadataBase: new URL('https://refract.fi'),
  openGraph: {
    title: 'Refract — Your crypto, refracted',
    description: 'One clear view across every wallet, exchange, DeFi position and NFT.',
    url: 'https://refract.fi',
    siteName: 'Refract',
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
