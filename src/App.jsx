import React, { useState, useEffect, useRef } from 'react';
import { Shield, Globe, ExternalLink, Star, Check, Calculator, ChevronDown, Gift, BadgeCheck, X, AlertCircle, ThumbsUp, Scale, RefreshCw, Eye, Lock, Info, Sun, Moon } from 'lucide-react';

// ============================================
// 💰 AFFILIATE CONFIGURATION
// Replace YOUR_CODE with your actual affiliate codes
// All fee data verified from official exchange sources (Jan 2026)
// ============================================

const EXCHANGES = {
  binance: { 
    url: 'https://accounts.binance.com/register?ref=376216722', 
    name: 'Binance', 
    // Simple SVG that always works - Binance diamond pattern
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 126 126'%3E%3Cpath fill='%23F0B90B' d='M38.73 53.38L63 29.1l24.28 24.28 14.14-14.15L63 .95 24.59 39.24l14.14 14.14zM.96 63l14.14-14.14L29.24 63 15.1 77.14.96 63zm37.77 9.62L63 96.9l24.28-24.28 14.15 14.13-.01.01L63 125.05 24.59 86.76l-.02-.02 14.16-14.12zM96.76 63l14.14-14.14L125.04 63l-14.14 14.14L96.76 63zM77.6 62.99h.01L63 48.38 52.26 59.12l-1.23 1.24-2.63 2.63-.01.01.01.01L63 77.62l14.62-14.62-.02-.01z'/%3E%3C/svg%3E",
    emoji: '🟡',
    fee: 0.10,
    spread: 0.05,
    withdraw: { BTC: 0.0005, ETH: 0.00168, SOL: 0.01, XRP: 0.25, DOGE: 5, ADA: 1, AVAX: 0.01, DOT: 0.1, LINK: 0.3, MATIC: 0.1, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.03, UNI: 0.5, SHIB: 500000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.8, users: '185M+', founded: 2017,
    headquarters: 'Global (Multiple)',
    regulated: ['Dubai VARA', 'France AMF', 'Spain', 'Italy', 'Poland'],
    pros: ['Lowest fees (0.1%)', '400+ cryptocurrencies', 'Highest liquidity globally', 'Advanced trading tools', 'Earn & Staking options'],
    cons: ['Complex interface for beginners', 'Not available in US/UK fully', 'Customer support can be slow'],
    bonus: '20% fee discount forever',
    bonusVerified: true,
    color: '#F0B90B', trust: 95, tags: ['recommended', 'lowest-fees'],
  },
  coinbase: { 
    url: 'https://coinbase.com/join/YOUR_CODE', 
    name: 'Coinbase', 
    // Coinbase C logo
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Ccircle cx='512' cy='512' r='512' fill='%230052FF'/%3E%3Cpath fill='white' d='M512 192c-176.7 0-320 143.3-320 320s143.3 320 320 320 320-143.3 320-320-143.3-320-320-320zm0 533.3c-117.8 0-213.3-95.5-213.3-213.3S394.2 298.7 512 298.7 725.3 394.2 725.3 512 629.8 725.3 512 725.3z'/%3E%3C/svg%3E",
    emoji: '🔵',
    fee: 1.49, spread: 0.50,
    withdraw: { BTC: 0.0001, ETH: 0.0012, SOL: 0.01, XRP: 0.02, DOGE: 2, ADA: 0.5, AVAX: 0.01, DOT: 0.1, LINK: 0.15, MATIC: 1, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.02, UNI: 0.3, SHIB: 200000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.5, users: '110M+', founded: 2012,
    headquarters: 'San Francisco, USA',
    regulated: ['SEC registered', 'NASDAQ: COIN', 'FinCEN', '40+ State licenses'],
    pros: ['Most regulated & trusted', 'FDIC insured USD', 'Very beginner friendly', 'Publicly traded company', 'Strong security record'],
    cons: ['Higher fees than competitors', 'Spreads can be wide', 'Limited altcoin selection'],
    bonus: '$10 in Bitcoin (first trade)',
    bonusVerified: true,
    color: '#0052FF', trust: 98, tags: ['beginner-friendly', 'most-trusted'],
  },
  kraken: { 
    url: 'https://www.kraken.com/sign-up', 
    name: 'Kraken', 
    // Kraken octopus/squid simplified
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%235741D9'/%3E%3Cpath fill='white' d='M50 20c-16.5 0-30 13.5-30 30v25h10V50c0-3.3 2.7-6 6-6s6 2.7 6 6v25h8V50c0-3.3 2.7-6 6-6s6 2.7 6 6v25h8V50c0-3.3 2.7-6 6-6s6 2.7 6 6v25h10V50c0-16.5-13.5-30-30-30z'/%3E%3C/svg%3E",
    emoji: '🐙',
    fee: 1.00, spread: 0.10,
    withdraw: { BTC: 0.00015, ETH: 0.0025, SOL: 0.0125, XRP: 0.02, DOGE: 2, ADA: 0.6, AVAX: 0.01, DOT: 0.05, LINK: 0.25, MATIC: 5, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.02, UNI: 0.4, SHIB: 300000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.6, users: '13M+', founded: 2011,
    headquarters: 'San Francisco, USA',
    regulated: ['FinCEN registered', 'UK FCA', 'Multiple State MTL licenses', 'Australia AUSTRAC'],
    pros: ['Never been hacked (14+ years)', 'Proof of reserves published', 'Excellent security', 'Good customer support', 'Available in most US states'],
    cons: ['Fewer coins than Binance', 'Interface can be complex', 'Verification can be slow'],
    bonus: 'None currently',
    bonusVerified: true,
    color: '#5741D9', trust: 97, tags: ['security-focused'],
  },
  bybit: { 
    url: 'https://www.bybit.eu/invite?ref=AYOLGJP', 
    name: 'Bybit', 
    // Bybit simplified B logo
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='12' fill='%23181818'/%3E%3Cpath fill='white' d='M25 20h25c11 0 20 9 20 20s-9 20-20 20H25V20zm10 10v20h15c5.5 0 10-4.5 10-10s-4.5-10-10-10H35z'/%3E%3Crect x='60' y='35' width='10' height='45' fill='%23F7A600'/%3E%3C/svg%3E",
    emoji: '🟠',
    fee: 0.10, spread: 0.08,
    withdraw: { BTC: 0.0002, ETH: 0.003, SOL: 0.01, XRP: 0.25, DOGE: 5, ADA: 1, AVAX: 0.01, DOT: 0.1, LINK: 0.3, MATIC: 0.1, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.03, UNI: 0.5, SHIB: 400000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.7, users: '40M+', founded: 2018,
    headquarters: 'Dubai, UAE',
    regulated: ['Dubai VARA license', 'Cyprus CySEC'],
    pros: ['Very low fees', 'Copy trading feature', 'Fast execution', 'Great mobile app', 'Large bonus offers'],
    cons: ['Not available in US/UK', 'Primarily derivatives focused', 'Newer exchange'],
    bonus: 'Up to $30,000 deposit bonus',
    bonusVerified: true,
    color: '#F7A600', trust: 89, tags: ['low-fees'],
  },
  okx: { 
    url: 'https://www.okx.com/join/YOUR_CODE', 
    name: 'OKX', 
    // OKX logo - 4 squares pattern
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='12' fill='white'/%3E%3Crect x='12' y='12' width='33' height='33' rx='4' fill='black'/%3E%3Crect x='55' y='12' width='33' height='33' rx='4' fill='black'/%3E%3Crect x='12' y='55' width='33' height='33' rx='4' fill='black'/%3E%3Crect x='55' y='55' width='33' height='33' rx='4' fill='black'/%3E%3C/svg%3E",
    emoji: '⬛',
    fee: 0.10, spread: 0.08,
    withdraw: { BTC: 0.0002, ETH: 0.002, SOL: 0.008, XRP: 0.1, DOGE: 4, ADA: 0.8, AVAX: 0.008, DOT: 0.08, LINK: 0.2, MATIC: 0.1, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.02, UNI: 0.4, SHIB: 350000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.6, users: '50M+', founded: 2017,
    headquarters: 'Seychelles',
    regulated: ['Dubai VARA', 'Bahamas SCB license'],
    pros: ['Low fees', 'Built-in Web3 wallet', 'NFT marketplace', 'Good liquidity', '350+ cryptos'],
    cons: ['Not available in US', 'Complex interface', 'Mixed support reviews'],
    bonus: 'Mystery box up to $10,000',
    bonusVerified: true,
    color: '#000000', trust: 87, tags: ['web3-native'],
  },
  bitpanda: { 
    url: 'https://www.bitpanda.com/?ref=YOUR_CODE', 
    name: 'Bitpanda', 
    // Bitpanda logo - B in rounded square (teal green)
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='16' fill='%2300847C'/%3E%3Cpath fill='white' d='M30 20h22c9 0 16 7 16 15 0 6-3 10-8 13 6 2 10 8 10 15 0 10-8 17-18 17H30V20zm14 22h6c4 0 6-2 6-6s-2-6-6-6h-6v12zm0 26h8c5 0 8-3 8-8s-3-8-8-8h-8v16z'/%3E%3C/svg%3E",
    emoji: '🦊',
    fee: 1.49, spread: 0.00,
    withdraw: { BTC: 0.0001, ETH: 0.001, SOL: 0.01, XRP: 0.1, DOGE: 2, ADA: 0.5, AVAX: 0.01, DOT: 0.1, LINK: 0.2, MATIC: 1, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.02, UNI: 0.3, SHIB: 200000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.5, users: '4M+', founded: 2014,
    headquarters: 'Vienna, Austria',
    regulated: ['MiCAR licensed', 'Austrian FMA', 'German BaFin', 'French AMF', 'PSD2 compliant'],
    pros: ['MiCAR compliant (EU)', 'Best app for beginners', 'Austrian company', 'Stocks & ETFs too', 'SEPA instant deposits'],
    cons: ['Higher fees than global exchanges', 'Smaller coin selection', 'Premium fees on simple trades'],
    bonus: '€10 welcome bonus',
    bonusVerified: true,
    color: '#00847C', trust: 94, tags: ['eu-regulated', 'beginner-friendly'],
  },
  mexc: { 
    url: 'https://www.mexc.com/exchange/BTC_USDT?shareCode=mexc-3nPe1', 
    name: 'MEXC', 
    // MEXC M logo with triangles
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='12' fill='white'/%3E%3Cpath fill='%231772F8' d='M20 70L35 35L50 55L65 35L80 70H65L50 45L35 70H20z'/%3E%3C/svg%3E",
    emoji: '🔷',
    fee: 0.00, spread: 0.15,
    withdraw: { BTC: 0.0003, ETH: 0.002, SOL: 0.008, XRP: 0.25, DOGE: 5, ADA: 1, AVAX: 0.01, DOT: 0.1, LINK: 0.3, MATIC: 1, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.03, UNI: 0.5, SHIB: 450000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.4, users: '15M+', founded: 2018,
    headquarters: 'Singapore',
    regulated: ['Limited regulation', 'Estonia license'],
    pros: ['0% maker fees!', '2200+ cryptocurrencies', 'Fastest new listings', 'Low withdrawal fees', 'Good for small caps'],
    cons: ['Less regulated', 'Lower liquidity on some pairs', 'Smaller exchange'],
    bonus: '$1,000 welcome bonus',
    bonusVerified: true,
    color: '#00B897', trust: 82, tags: ['zero-fees', 'new-listings'],
  },
  gemini: { 
    url: 'https://gemini.com/share/YOUR_CODE', 
    name: 'Gemini', 
    // Gemini twin circles logo
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='12' fill='white'/%3E%3Ccircle cx='35' cy='50' r='20' fill='none' stroke='%2300DCFA' stroke-width='6'/%3E%3Ccircle cx='65' cy='50' r='20' fill='none' stroke='%2300DCFA' stroke-width='6'/%3E%3C/svg%3E",
    emoji: '♊',
    fee: 1.49, spread: 0.25,
    withdraw: { BTC: 0.0001, ETH: 0.001, SOL: 0.008, XRP: 0.02, DOGE: 1, ADA: 0.3, AVAX: 0.008, DOT: 0.05, LINK: 0.15, MATIC: 1, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.02, UNI: 0.25, SHIB: 150000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.4, users: '15M+', founded: 2014,
    headquarters: 'New York, USA',
    regulated: ['NYDFS Trust Company', 'SOC 2 certified', 'Multiple state licenses'],
    pros: ['Very regulated (NY approved)', 'SOC 2 security certified', 'Insurance on assets', 'Good for institutions', 'Gemini Dollar (GUSD)'],
    cons: ['Higher fees', 'Smaller coin selection', 'Monthly custody fees possible'],
    bonus: '$10 in Bitcoin',
    bonusVerified: true,
    color: '#00DCFA', trust: 96, tags: ['us-regulated', 'institutional'],
  },
  cryptocom: { 
    url: 'https://cryptocom.sjv.io/K0kRNA', 
    name: 'Crypto.com', 
    // Crypto.com logo - blue shield/lion
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='12' fill='%23002D74'/%3E%3Cpath fill='white' d='M50 15L20 30v25c0 20 30 30 30 30s30-10 30-30V30L50 15zm0 10l20 10v20c0 12-20 20-20 20s-20-8-20-20V35l20-10z'/%3E%3C/svg%3E",
    emoji: '🛡️',
    fee: 0.75, spread: 0.40,
    withdraw: { BTC: 0.0004, ETH: 0.005, SOL: 0.012, XRP: 0.25, DOGE: 50, ADA: 1, AVAX: 0.01, DOT: 0.1, LINK: 0.3, MATIC: 1, ATOM: 0.01, NEAR: 0.01, APT: 0.01, SUI: 0.03, UNI: 0.5, SHIB: 500000, LTC: 0.001, BCH: 0.0001 },
    rating: 4.5, users: '100M+', founded: 2016,
    headquarters: 'Singapore',
    regulated: ['MiCAR licensed (EU)', 'FCA registered (UK)', 'Multiple global licenses', 'VASP registered'],
    pros: ['100M+ users worldwide', 'Visa debit card with cashback', 'Earn interest on crypto', 'User-friendly app', 'Strong brand & sponsorships'],
    cons: ['Spread can be high in app', 'CRO staking required for best rates', 'Exchange not available in all regions'],
    bonus: '$25 sign-up bonus',
    bonusVerified: true,
    color: '#002D74', trust: 92, tags: ['beginner-friendly', 'visa-card'],
  },
};

const WALLETS = {
  ledger: { url: 'https://shop.ledger.com/?r=2b21894e8c10', name: 'Ledger', products: ['Nano X ($149)', 'Nano S Plus ($79)', 'Stax ($399)'], features: ['Bluetooth (X/Stax)', '5,500+ assets', 'Mobile app', 'Secure element chip'] },
  trezor: { url: 'https://trezor.io/?offer_id=YOUR_CODE', name: 'Trezor', products: ['Model T ($179)', 'Model One ($69)', 'Safe 3 ($79)'], features: ['Touchscreen (T/Safe)', 'Open source', 'Shamir backup', 'Coin control'] },
};

const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627EEA', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#9945FF', logo: 'https://cryptologos.cc/logos/solana-sol-logo.svg' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', color: '#23292F', logo: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633', logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', color: '#0033AD', logo: 'https://cryptologos.cc/logos/cardano-ada-logo.svg' },
  { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', color: '#E84142', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', color: '#E6007A', logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA', logo: 'https://cryptologos.cc/logos/chainlink-link-logo.svg' },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon', color: '#8247E5', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.svg' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', color: '#2E3148', logo: 'https://cryptologos.cc/logos/cosmos-atom-logo.svg' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', color: '#00C08B', logo: 'https://cryptologos.cc/logos/near-protocol-near-logo.svg' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', color: '#4CD7D0', logo: 'https://cryptologos.cc/logos/aptos-apt-logo.svg' },
  { id: 'sui', symbol: 'SUI', name: 'Sui', color: '#6FBCF0', logo: 'https://cryptologos.cc/logos/sui-sui-logo.svg' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', color: '#FF007A', logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.svg' },
  { id: 'shiba', symbol: 'SHIB', name: 'Shiba Inu', color: '#FFA409', logo: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.svg' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', color: '#BFBBBB', logo: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', color: '#8DC351', logo: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg' },
];

const FALLBACK_PRICES = { BTC: 104250, ETH: 3340, SOL: 258, XRP: 3.12, DOGE: 0.38, ADA: 1.05, AVAX: 42.50, DOT: 8.20, LINK: 26.80, MATIC: 0.52, ATOM: 9.80, NEAR: 5.90, APT: 9.40, SUI: 4.85, UNI: 14.20, SHIB: 0.0000245, LTC: 128, BCH: 485 };
const FALLBACK_SPREADS = { binance: 0.02, coinbase: 0.40, kraken: 0.08, bybit: 0.05, okx: 0.05, bitpanda: 1.49, mexc: 0.12, gemini: 0.20, cryptocom: 0.40 };
const FEES_LAST_VERIFIED = 'January 2026';

// ============================================
// GAS FEE CONFIGURATION
// Live for BTC/ETH, flat $1 for cheap coins
// ============================================
// ============================================
// CORS PROXY CONFIGURATION
// Multiple proxies for fallback reliability
// ============================================
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
];

// Helper to fetch with CORS proxy fallback
const fetchWithProxy = async (url, proxyIndex = 0) => {
  // First try direct (works for some APIs with CORS headers)
  if (proxyIndex === -1) {
    try {
      const response = await fetch(url, { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) return response;
    } catch (e) {
      // Fall through to proxy
    }
    proxyIndex = 0;
  }
  
  // Try proxies
  if (proxyIndex >= CORS_PROXIES.length) {
    throw new Error('All proxies failed');
  }
  
  const proxyUrl = CORS_PROXIES[proxyIndex] + encodeURIComponent(url);
  try {
    const response = await fetch(proxyUrl, { 
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) return response;
    throw new Error(`Proxy ${proxyIndex} failed`);
  } catch (e) {
    return fetchWithProxy(url, proxyIndex + 1);
  }
};

// ============================================
// LIVE SPREAD API CONFIGURATION
// Fetches real-time bid/ask from 8 exchanges
// Bitpanda has no public orderbook API - uses estimate
// ============================================
const SPREAD_API_CONFIG = {
  binance: {
    url: (symbol) => `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}USDT`,
    parse: (data) => ({ bid: parseFloat(data.bidPrice), ask: parseFloat(data.askPrice) }),
    symbols: { BTC: 'BTC', ETH: 'ETH', SOL: 'SOL', XRP: 'XRP', DOGE: 'DOGE', ADA: 'ADA', AVAX: 'AVAX', DOT: 'DOT', LINK: 'LINK', MATIC: 'MATIC', ATOM: 'ATOM', NEAR: 'NEAR', APT: 'APT', SUI: 'SUI', UNI: 'UNI', SHIB: 'SHIB', LTC: 'LTC', BCH: 'BCH' }
  },
  kraken: {
    url: (symbol) => `https://api.kraken.com/0/public/Ticker?pair=${symbol}USD`,
    parse: (data) => {
      const key = Object.keys(data.result || {})[0];
      if (!key) return null;
      return { bid: parseFloat(data.result[key].b[0]), ask: parseFloat(data.result[key].a[0]) };
    },
    symbols: { BTC: 'XBT', ETH: 'ETH', SOL: 'SOL', XRP: 'XRP', DOGE: 'DOGE', ADA: 'ADA', AVAX: 'AVAX', DOT: 'DOT', LINK: 'LINK', MATIC: 'MATIC', ATOM: 'ATOM', UNI: 'UNI', LTC: 'LTC', BCH: 'BCH' }
  },
  bybit: {
    url: (symbol) => `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}USDT`,
    parse: (data) => {
      if (!data.result?.list?.[0]) return null;
      return { bid: parseFloat(data.result.list[0].bid1Price), ask: parseFloat(data.result.list[0].ask1Price) };
    },
    symbols: { BTC: 'BTC', ETH: 'ETH', SOL: 'SOL', XRP: 'XRP', DOGE: 'DOGE', ADA: 'ADA', AVAX: 'AVAX', DOT: 'DOT', LINK: 'LINK', MATIC: 'MATIC', ATOM: 'ATOM', NEAR: 'NEAR', APT: 'APT', SUI: 'SUI', UNI: 'UNI', SHIB: 'SHIB', LTC: 'LTC', BCH: 'BCH' }
  },
  okx: {
    url: (symbol) => `https://www.okx.com/api/v5/market/ticker?instId=${symbol}-USDT`,
    parse: (data) => {
      if (!data.data?.[0]) return null;
      return { bid: parseFloat(data.data[0].bidPx), ask: parseFloat(data.data[0].askPx) };
    },
    symbols: { BTC: 'BTC', ETH: 'ETH', SOL: 'SOL', XRP: 'XRP', DOGE: 'DOGE', ADA: 'ADA', AVAX: 'AVAX', DOT: 'DOT', LINK: 'LINK', MATIC: 'MATIC', ATOM: 'ATOM', NEAR: 'NEAR', APT: 'APT', SUI: 'SUI', UNI: 'UNI', SHIB: 'SHIB', LTC: 'LTC', BCH: 'BCH' }
  },
  mexc: {
    url: (symbol) => `https://api.mexc.com/api/v3/ticker/bookTicker?symbol=${symbol}USDT`,
    parse: (data) => ({ bid: parseFloat(data.bidPrice), ask: parseFloat(data.askPrice) }),
    symbols: { BTC: 'BTC', ETH: 'ETH', SOL: 'SOL', XRP: 'XRP', DOGE: 'DOGE', ADA: 'ADA', AVAX: 'AVAX', DOT: 'DOT', LINK: 'LINK', MATIC: 'MATIC', ATOM: 'ATOM', NEAR: 'NEAR', APT: 'APT', SUI: 'SUI', UNI: 'UNI', SHIB: 'SHIB', LTC: 'LTC', BCH: 'BCH' }
  },
  gemini: {
    url: (symbol) => `https://api.gemini.com/v1/pubticker/${symbol.toLowerCase()}usd`,
    parse: (data) => ({ bid: parseFloat(data.bid), ask: parseFloat(data.ask) }),
    symbols: { BTC: 'btc', ETH: 'eth', SOL: 'sol', DOGE: 'doge', ADA: 'ada', AVAX: 'avax', DOT: 'dot', LINK: 'link', MATIC: 'matic', ATOM: 'atom', UNI: 'uni', SHIB: 'shib', LTC: 'ltc', BCH: 'bch' }
  },
  coinbase: {
    url: (symbol) => `https://api.exchange.coinbase.com/products/${symbol}-USD/ticker`,
    parse: (data) => ({ bid: parseFloat(data.bid), ask: parseFloat(data.ask) }),
    symbols: { BTC: 'BTC', ETH: 'ETH', SOL: 'SOL', XRP: 'XRP', DOGE: 'DOGE', ADA: 'ADA', AVAX: 'AVAX', DOT: 'DOT', LINK: 'LINK', MATIC: 'MATIC', ATOM: 'ATOM', NEAR: 'NEAR', APT: 'APT', SUI: 'SUI', UNI: 'UNI', SHIB: 'SHIB', LTC: 'LTC', BCH: 'BCH' }
  },
  cryptocom: {
    url: (symbol) => `https://api.crypto.com/exchange/v1/public/get-ticker?instrument_name=${symbol}_USD`,
    parse: (data) => {
      if (!data.result?.data?.[0]) return null;
      return { bid: parseFloat(data.result.data[0].b), ask: parseFloat(data.result.data[0].k) };
    },
    symbols: { BTC: 'BTC', ETH: 'ETH', SOL: 'SOL', XRP: 'XRP', DOGE: 'DOGE', ADA: 'ADA', AVAX: 'AVAX', DOT: 'DOT', LINK: 'LINK', MATIC: 'MATIC', ATOM: 'ATOM', NEAR: 'NEAR', APT: 'APT', SUI: 'SUI', UNI: 'UNI', SHIB: 'SHIB', LTC: 'LTC', BCH: 'BCH' }
  },
  // Bitpanda has no public orderbook API - always uses fallback estimate
  bitpanda: null
};

const FAQ = [
  { q: 'What is "True Cost" and why does it matter?', a: 'True Cost = Trading Fee + Spread (+ Withdrawal Fee if enabled). Most people only compare trading fees (0.1-0.6%), but spreads alone can add 0.5-2% extra! Our calculator adds up EVERYTHING so you see the real price before you buy.' },
  { q: 'What is spread and why do exchanges hide it?', a: 'Spread is the gap between buy and sell prices. Example: If Bitcoin shows $100,000 but you actually pay $100,500 when buying, that\'s a $500 (0.5%) hidden cost. Many exchanges advertise "0% fees" while quietly making millions on spreads. We expose this hidden cost.' },
  { q: 'Why do prices differ between exchanges?', a: 'Each exchange has its own order book with different buyers and sellers. Higher-volume exchanges (Binance, Coinbase) typically have prices closer to the "true" market price and tighter spreads. Price differences of 0.01-0.3% between exchanges are normal — this is why comparing matters.' },
  { q: 'Which exchange has the lowest fees?', a: 'It depends on your priorities! MEXC has 0% maker fees but wider spreads. Binance offers the best overall combination: low fees + tight spreads + reasonable withdrawals. For beginners who value safety over savings: Coinbase or Kraken, despite higher fees, offer better regulation and insurance.' },
  { q: 'Should I withdraw crypto to my own wallet?', a: 'If you\'re holding over $1,000 long-term: YES, absolutely. "Not your keys, not your coins" isn\'t just a saying — exchange hacks (Mt. Gox, FTX) have lost billions. A hardware wallet (Ledger $79, Trezor $69) costs less than a single bad trade and gives you complete control forever.' },
  { q: 'What about network/gas fees?', a: 'Network fees only apply when you withdraw crypto to your own wallet. For simply buying on an exchange, you only pay the trading fee + spread. If you want to withdraw later, the withdrawal fee already includes the network cost.' },
  { q: 'Are the fees on this site accurate?', a: 'We verify all trading fees, withdrawal fees, and spreads monthly from official exchange documentation. Prices update live every 30 seconds via Binance API. Spreads shown are typical values — actual spreads vary with market conditions. Last verification: January 2026.' },
  { q: 'How does CryptoTrader Pro make money?', a: 'We earn affiliate commissions when you sign up through our links — this costs you nothing extra. In fact, our links often include exclusive bonuses (like 20% fee discount on Binance). We believe in 100% transparency: every affiliate link is clearly marked.' },
];

// ============================================
// THEME SYSTEM
// ============================================
const themes = {
  light: {
    bg: '#FAFAF9',
    bgAlt: '#FFFFFF',
    bgCard: '#FFFFFF',
    border: '#E5E5E5',
    borderLight: '#F0F0F0',
    text: '#1A1A1A',
    textMuted: '#6B7280',
    textLight: '#9CA3AF',
    accent: '#16A34A',
    accentBg: 'rgba(22, 163, 74, 0.08)',
    accentBorder: 'rgba(22, 163, 74, 0.2)',
    danger: '#DC2626',
    warning: '#D97706',
    shadow: '0 1px 3px rgba(0,0,0,0.08)',
    shadowLg: '0 4px 12px rgba(0,0,0,0.08)',
  },
  dark: {
    bg: '#0A0A0A',
    bgAlt: '#141414',
    bgCard: '#1A1A1A',
    border: '#2A2A2A',
    borderLight: '#222222',
    text: '#FAFAFA',
    textMuted: '#A1A1AA',
    textLight: '#71717A',
    accent: '#22C55E',
    accentBg: 'rgba(34, 197, 94, 0.1)',
    accentBorder: 'rgba(34, 197, 94, 0.3)',
    danger: '#EF4444',
    warning: '#F59E0B',
    shadow: '0 1px 3px rgba(0,0,0,0.3)',
    shadowLg: '0 4px 12px rgba(0,0,0,0.4)',
  }
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function CryptoTraderPro() {
  // Theme state - default to LIGHT, toggle available
  const [isDark, setIsDark] = useState(false);
  const t = isDark ? themes.dark : themes.light;

  // App state
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [amount, setAmount] = useState(1000);
  const [includeWithdrawal, setIncludeWithdrawal] = useState(false);
  const [showSpread, setShowSpread] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const [isDCAMode, setIsDCAMode] = useState(false); // Single buy default
  
  // Live data state
  const [livePrices, setLivePrices] = useState(FALLBACK_PRICES);
  const [liveSpreads, setLiveSpreads] = useState(FALLBACK_SPREADS);
  const [spreadStatus, setSpreadStatus] = useState({}); // tracks which exchanges have live data
  const [priceLoading, setPriceLoading] = useState(true);
  const [spreadLoading, setSpreadLoading] = useState(true);
  const [priceError, setPriceError] = useState(null);
  
  const calculatorRef = useRef(null);
  const coinDropdownRef = useRef(null);

  // Fetch live prices from Binance
  const fetchLivePrices = async () => {
    try {
      setPriceLoading(true);
      const symbols = COINS.map(c => `"${c.symbol}USDT"`).join(',');
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=[${symbols}]`);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      const newPrices = { ...FALLBACK_PRICES };
      data.forEach(item => {
        const symbol = item.symbol.replace('USDT', '');
        newPrices[symbol] = parseFloat(item.price);
      });
      setLivePrices(newPrices);
      setPriceError(null);
    } catch (err) {
      setPriceError('Using cached prices');
    } finally {
      setPriceLoading(false);
    }
  };

  // Fetch live spreads from all exchanges (with CORS proxy)
  const fetchLiveSpreads = async (coinSymbol) => {
    setSpreadLoading(true);
    const newSpreads = { ...FALLBACK_SPREADS };
    const newStatus = {};
    
    const fetchPromises = Object.entries(SPREAD_API_CONFIG).map(async ([exchange, config]) => {
      // Bitpanda has no API - always use fallback
      if (!config) {
        newStatus[exchange] = 'estimate';
        return;
      }
      
      const symbol = config.symbols[coinSymbol];
      if (!symbol) {
        newStatus[exchange] = 'unsupported';
        return;
      }
      
      const apiUrl = config.url(symbol);
      
      try {
        // Try with CORS proxy
        const response = await fetchWithProxy(apiUrl, -1); // -1 = try direct first
        const data = await response.json();
        const parsed = config.parse(data);
        
        if (parsed && parsed.bid > 0 && parsed.ask > 0) {
          // Calculate spread: (ask - bid) / midpoint * 100
          const midpoint = (parsed.ask + parsed.bid) / 2;
          const spreadPercent = ((parsed.ask - parsed.bid) / midpoint) * 100;
          
          // Sanity check: spread should be between 0 and 5%
          if (spreadPercent >= 0 && spreadPercent <= 5) {
            newSpreads[exchange] = Math.round(spreadPercent * 1000) / 1000; // 3 decimal precision
            newStatus[exchange] = 'live';
          } else {
            // Unusual spread - use fallback but mark as fetched
            newStatus[exchange] = 'fallback';
          }
        } else {
          newStatus[exchange] = 'fallback';
        }
      } catch (err) {
        // All methods failed - use fallback
        console.log(`[Spread] ${exchange}: fallback (${err.message})`);
        newStatus[exchange] = 'fallback';
      }
    });
    
    await Promise.allSettled(fetchPromises);
    
    setLiveSpreads(newSpreads);
    setSpreadStatus(newStatus);
    setSpreadLoading(false);
  };

  // Initial load: fetch prices
  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch spreads when coin changes
  useEffect(() => {
    fetchLiveSpreads(selectedCoin.symbol);
    // Refresh spreads every 60 seconds
    const interval = setInterval(() => fetchLiveSpreads(selectedCoin.symbol), 60000);
    return () => clearInterval(interval);
  }, [selectedCoin.symbol]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (coinDropdownRef.current && !coinDropdownRef.current.contains(e.target)) {
        setShowCoinDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Format currency
  const fmt = (n) => {
    if (n === undefined || n === null || isNaN(n)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  };

  // Calculate results
  const currentPrice = livePrices[selectedCoin.symbol] || FALLBACK_PRICES[selectedCoin.symbol];
  const coinAmount = amount / currentPrice;
  
  // DCA multiplier (12 months if DCA mode, 1 if single purchase)
  const dcaMultiplier = isDCAMode ? 12 : 1;
  const totalInvestment = amount * dcaMultiplier;
  
  const results = Object.entries(EXCHANGES).map(([key, ex]) => {
    const tradingFee = amount * (ex.fee / 100);
    const spreadPercent = liveSpreads[key] || ex.spread;
    const spreadCost = showSpread ? amount * (spreadPercent / 100) : 0;
    const withdrawalFee = includeWithdrawal ? (ex.withdraw[selectedCoin.symbol] || 0) * currentPrice : 0;
    const totalCost = tradingFee + spreadCost + withdrawalFee;
    // DCA costs (monthly fee * 12, withdrawal only once at end of year)
    const dcaTotalCost = isDCAMode ? (tradingFee + spreadCost) * 12 + withdrawalFee : totalCost;
    return { key, ...ex, tradingFee, spreadCost, spreadPercent, withdrawalFee, totalCost, dcaTotalCost };
  }).sort((a, b) => a.dcaTotalCost - b.dcaTotalCost);

  const best = results[0];
  const worst = results[results.length - 1];
  const potentialSavings = worst.dcaTotalCost - best.dcaTotalCost;
  const avgMarketCost = results.reduce((sum, r) => sum + r.dcaTotalCost, 0) / results.length;
  const savingsVsAverage = avgMarketCost - best.dcaTotalCost;

  // ==========================================
  // LEGAL MODAL
  // ==========================================
  const LegalModal = ({ type, onClose }) => {
    const content = {
      impressum: { 
        title: 'Impressum', 
        body: `Informationspflicht laut §5 E-Commerce Gesetz, §14 Unternehmensgesetzbuch, §63 Gewerbeordnung und Offenlegungspflicht laut §25 Mediengesetz

Betreiber & Medieninhaber:
OptiRisk Consulting e.U.
Inhaber: Thomas Michalik
Döblerhofstraße 10/167
1030 Wien
Österreich

Kontakt:
E-Mail: info@cryptotraderpro.io

EU-Streitschlichtung:
Gemäß Verordnung über Online-Streitbeilegung in Verbraucherangelegenheiten (ODR-Verordnung) möchten wir Sie über die Online-Streitbeilegungsplattform (OS-Plattform) informieren.
Verbraucher haben die Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform der Europäischen Kommission zu richten: https://ec.europa.eu/consumers/odr

Haftung für Inhalte dieser Website:
Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.

Haftung für Links:
Unsere Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.

Urheberrecht:
Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht.` 
      },
      privacy: { 
        title: 'Datenschutzerklärung', 
        body: `Datenschutzerklärung gemäß DSGVO
Stand: ${FEES_LAST_VERIFIED}

Verantwortlicher:
OptiRisk Consulting e.U.
Inhaber: Thomas Michalik
Döblerhofstraße 10/167, 1030 Wien
E-Mail: info@cryptotraderpro.io

1. Erhebung und Verarbeitung von Daten
Beim Besuch unserer Website werden automatisch folgende Daten erfasst:
• IP-Adresse (anonymisiert)
• Datum und Uhrzeit des Zugriffs
• Browsertyp und -version
• Verwendetes Betriebssystem

2. Google Analytics
Diese Website nutzt Google Analytics mit IP-Anonymisierung. Die Datenverarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. f DSGVO. Sie können die Erfassung durch Google Analytics verhindern, indem Sie ein Browser-Add-on installieren: https://tools.google.com/dlpage/gaoptout

3. Affiliate-Links
Wir verwenden Affiliate-Links zu Kryptobörsen. Bei Klick auf diese Links werden Daten an die jeweiligen Anbieter übertragen. Die Datenschutzbestimmungen der jeweiligen Börsen gelten.

4. Cookies
Wir verwenden nur technisch notwendige Cookies. Keine Tracking-Cookies ohne Ihre Einwilligung.

5. Ihre Rechte
Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Beschwerden können bei der Österreichischen Datenschutzbehörde (dsb.gv.at) eingereicht werden.

6. Kontakt
Bei Fragen zum Datenschutz: info@cryptotraderpro.io` 
      },
      terms: { 
        title: 'Nutzungsbedingungen / Terms of Service', 
        body: `Nutzungsbedingungen für CryptoTrader Pro
Stand: ${FEES_LAST_VERIFIED}

1. Geltungsbereich
Diese Nutzungsbedingungen gelten für die Nutzung der Website cryptotraderpro.io, betrieben von OptiRisk Consulting e.U., Wien, Österreich.

2. Keine Finanzberatung
Die auf dieser Website bereitgestellten Informationen dienen ausschließlich zu Informationszwecken und stellen KEINE Anlageberatung, Finanzberatung oder Empfehlung zum Kauf oder Verkauf von Kryptowährungen dar.

3. Keine Gewährleistung
• Gebühren und Preise werden regelmäßig aktualisiert, können jedoch von den tatsächlichen Gebühren der Börsen abweichen
• Live-Preise werden von externen APIs bezogen
• Wir übernehmen keine Haftung für die Richtigkeit der Daten

4. Risikohinweis
Kryptowährungen sind hochvolatil und risikobehaftet. Sie können Ihr gesamtes eingesetztes Kapital verlieren. Investieren Sie nur, was Sie bereit sind zu verlieren.

5. Affiliate-Hinweis
Diese Website enthält Affiliate-Links. Bei Registrierung über unsere Links erhalten wir eine Provision. Dies hat keinen Einfluss auf die von Ihnen gezahlten Gebühren.

6. Anwendbares Recht
Es gilt österreichisches Recht. Gerichtsstand ist Wien.

7. Kontakt
info@cryptotraderpro.io` 
      },
      affiliate: { 
        title: 'Affiliate Disclosure / Werbehinweis', 
        body: `TRANSPARENZHINWEIS gemäß österreichischem Mediengesetz

Offenlegung von Affiliate-Partnerschaften:

CryptoTrader Pro (betrieben von OptiRisk Consulting e.U.) ist Teilnehmer von Affiliate-Programmen verschiedener Kryptobörsen und Wallet-Anbieter.

Was bedeutet das?
• Bei Klick auf unsere Links und anschließender Registrierung erhalten wir eine Provision
• Diese Provision kostet Sie als Nutzer NICHTS zusätzlich
• Oft erhalten Sie über unsere Links sogar exklusive Boni (z.B. 20% Gebührenrabatt bei Binance)

Unsere Verpflichtung:
• Alle Affiliate-Links sind als solche erkennbar
• Unser Ranking basiert auf TRUE COST (tatsächlichen Gesamtkosten), NICHT auf Provisionshöhe
• Wir empfehlen nur Börsen, die wir selbst für seriös halten

Aktuelle Affiliate-Partner:
• Binance
• Coinbase
• Crypto.com
• Bybit
• OKX
• Bitpanda
• MEXC
• Gemini
• Ledger
• Trezor

Bei Fragen: info@cryptotraderpro.io` 
      },
    };
    const c = content[type];
    
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '32px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: t.shadowLg, fontFamily: '"Space Mono", monospace', margin: '20px 0' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', padding: '10px', cursor: 'pointer', zIndex: 10 }}>
            <X size={20} color={t.textMuted} />
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: t.text, marginBottom: '24px', paddingRight: '40px', fontFamily: '"Space Mono", monospace' }}>{c.title}</h2>
          <div style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: '"Space Mono", monospace' }}>{c.body}</div>
        </div>
      </div>
    );
  };

  // ==========================================
  // EXCHANGE MODAL
  // ==========================================
  const ExchangeModal = ({ exchangeKey, onClose }) => {
    const ex = EXCHANGES[exchangeKey];
    const result = results.find(r => r.key === exchangeKey);
    
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '32px', maxWidth: '600px', width: '100%', position: 'relative', margin: '40px 0', boxShadow: t.shadowLg, fontFamily: '"Space Mono", monospace' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', padding: '8px', cursor: 'pointer' }}>
            <X size={16} color={t.textMuted} />
          </button>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: t.bgAlt, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {ex.logo ? <img src={ex.logo} alt={ex.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} /> : null}
              <span style={{ display: ex.logo ? 'none' : 'flex', fontSize: '24px' }}>{ex.emoji}</span>
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: t.text, margin: 0, fontFamily: '"Space Mono", monospace' }}>{ex.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= Math.round(ex.rating) ? '#F59E0B' : 'none'} color={i <= Math.round(ex.rating) ? '#F59E0B' : t.textLight} />)}</div>
                <span style={{ fontSize: '12px', color: t.textMuted, fontFamily: '"Space Mono", monospace' }}>{ex.rating}/5 · {ex.users} users · Since {ex.founded}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {ex.tags?.map(tag => (
              <span key={tag} style={{ padding: '4px 10px', background: tag.includes('recommended') || tag.includes('lowest') ? t.accentBg : t.bgAlt, border: `1px solid ${tag.includes('recommended') || tag.includes('lowest') ? t.accentBorder : t.border}`, borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: tag.includes('recommended') || tag.includes('lowest') ? t.accent : t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"Space Mono", monospace' }}>{tag.replace('-', ' ')}</span>
            ))}
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Trading Fee', value: `${ex.fee}%`, color: ex.fee <= 0.1 ? t.accent : t.warning },
              { label: spreadStatus[exchangeKey] === 'live' ? 'Live Spread' : 'Est. Spread', value: `${(liveSpreads[exchangeKey] || ex.spread).toFixed(3)}%`, color: spreadStatus[exchangeKey] === 'live' ? t.accent : t.textMuted },
              { label: 'Trust Score', value: `${ex.trust}/100`, color: ex.trust >= 95 ? t.accent : t.warning },
              { label: isDCAMode ? 'YEARLY COST' : 'TRUE COST', value: fmt(result?.dcaTotalCost), color: result === best ? t.accent : t.text },
            ].map((stat, i) => (
              <div key={i} style={{ background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: t.textLight, marginBottom: '4px', fontFamily: '"Space Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: stat.color, fontFamily: '"Space Mono", monospace' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Pros & Cons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', color: t.accent, marginBottom: '8px', fontWeight: 600, fontFamily: '"Space Mono", monospace' }}>✓ PROS</div>
              {ex.pros?.slice(0, 3).map((p, i) => <div key={i} style={{ fontSize: '12px', color: t.textMuted, marginBottom: '4px', fontFamily: '"Space Mono", monospace' }}>· {p}</div>)}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: t.danger, marginBottom: '8px', fontWeight: 600, fontFamily: '"Space Mono", monospace' }}>✗ CONS</div>
              {ex.cons?.slice(0, 3).map((c, i) => <div key={i} style={{ fontSize: '12px', color: t.textMuted, marginBottom: '4px', fontFamily: '"Space Mono", monospace' }}>· {c}</div>)}
            </div>
          </div>

          {/* Bonus */}
          {ex.bonus && ex.bonus !== 'None currently' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: '8px', marginBottom: '20px' }}>
              <Gift size={20} color={t.accent} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: t.accent, fontFamily: '"Space Mono", monospace' }}>{ex.bonus}</div>
                <div style={{ fontSize: '11px', color: t.textMuted, fontFamily: '"Space Mono", monospace' }}>Exclusive via our affiliate link</div>
              </div>
            </div>
          )}

          {/* CTA */}
          <a href={ex.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: t.accent, color: 'white', fontWeight: 600, fontSize: '14px', borderRadius: '8px', textDecoration: 'none', fontFamily: '"Space Mono", monospace' }}>
            Open {ex.name} Account <ExternalLink size={16} />
          </a>
          <p style={{ fontSize: '10px', color: t.textLight, textAlign: 'center', marginTop: '12px', fontFamily: '"Space Mono", monospace' }}>Affiliate link · We earn commission at no extra cost to you</p>
        </div>
      </div>
    );
  };

  // ==========================================
  // SHARE FUNCTION
  // ==========================================
  const handleShare = async () => {
    const shareData = {
      title: 'CryptoTrader Pro - TRUE COST Calculator',
      text: isDCAMode 
        ? `I could save ${fmt(potentialSavings)}/year on crypto fees with the right exchange! Check out this free calculator:`
        : `I just saved ${fmt(potentialSavings)} on crypto fees! Check out this free calculator:`,
      url: 'https://cryptotraderpro.io'
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: '"Space Mono", monospace', transition: 'background 0.3s, color 0.3s' }}>
      
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Modals */}
      {selectedExchange && <ExchangeModal exchangeKey={selectedExchange} onClose={() => setSelectedExchange(null)} />}
      {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}

      {/* ==================== HEADER ==================== */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: t.bgCard, borderBottom: `1px solid ${t.border}`, transition: 'background 0.3s' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo - larger */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: t.text, letterSpacing: '-0.02em' }}>CryptoTrader</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: t.accent }}>Pro</span>
          </div>
          
          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Combined Live Status indicator */}
            <div 
              title={`Live data: Prices every 30s, Spreads from ${Object.values(spreadStatus).filter(s => s === 'live').length}/8 exchanges`}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '4px' }}
            >
              <span style={{ 
                width: '6px', height: '6px', borderRadius: '50%', 
                background: priceError ? '#EAB308' : t.accent, 
                animation: priceLoading || spreadLoading ? 'none' : 'pulse 2s infinite' 
              }} />
              <span style={{ fontSize: '9px', fontWeight: 600, color: priceError ? '#EAB308' : t.accent }}>
                {priceLoading || spreadLoading ? '...' : 'LIVE'}
              </span>
            </div>
            
            {/* Verified checkmark */}
            <div title={`Fees verified ${FEES_LAST_VERIFIED}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px' }}>
              <BadgeCheck size={14} color={t.accent} />
            </div>
            
            {/* Share button */}
            <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', cursor: 'pointer' }} title="Share">
              <ExternalLink size={14} color={t.textMuted} />
            </button>
            
            {/* Theme toggle */}
            <button onClick={() => setIsDark(!isDark)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', cursor: 'pointer' }}>
              {isDark ? <Sun size={14} color={t.textMuted} /> : <Moon size={14} color={t.textMuted} />}
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* ==================== HERO ==================== */}
        <section style={{ padding: '80px 0 60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 700, color: t.text, lineHeight: 1.05, marginBottom: '20px', letterSpacing: '-0.01em' }}>
            Stop Overpaying
            <br />
            <span style={{ color: t.accent }}>For Crypto.</span>
          </h1>
          <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: isDark ? '#A1A1AA' : '#555555', maxWidth: '520px', margin: '0 auto 12px', lineHeight: 1.65, fontWeight: 400 }}>
            See the <span style={{ color: t.accent, fontWeight: 600 }}>TRUE COST</span> before you trade.
          </p>
          <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: isDark ? '#71717A' : '#888888', maxWidth: '450px', margin: '0 auto 36px', lineHeight: 1.6, fontWeight: 400 }}>
            No hidden spreads. No surprise fees.
          </p>
          
          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <button onClick={() => calculatorRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '18px 36px', background: t.accent, color: 'white', fontSize: '17px', fontWeight: 600, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: '"Space Mono", monospace', letterSpacing: '-0.01em', boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)' }}>
              Calculate True Cost
            </button>
            <a href="#exchanges" onClick={(e) => { e.preventDefault(); document.getElementById('exchanges')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ fontSize: '15px', color: isDark ? '#A1A1AA' : '#666666', textDecoration: 'none', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px', fontFamily: '"Space Mono", monospace' }}>
              View supported exchanges <span style={{ color: t.accent }}>→</span>
            </a>
          </div>
          
          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {[
              { value: '9', label: 'Exchanges compared' },
              { value: '18', label: 'Cryptocurrencies tracked' },
              { value: '100%', label: 'Transparent pricing' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', minWidth: '140px' }}>
                <div style={{ fontSize: 'clamp(40px, 8vw, 60px)', fontWeight: 700, color: t.accent, letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: isDark ? '#A1A1AA' : '#555555', letterSpacing: '0.02em', fontWeight: 400, marginTop: '8px', lineHeight: 1.4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== CALCULATOR ==================== */}
        <section ref={calculatorRef} style={{ marginBottom: '60px' }}>

          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: t.shadow }}>
            
            {/* Calculator Header */}
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calculator size={22} color={t.accent} />
                <span style={{ fontSize: '18px', fontWeight: 700, color: t.text, letterSpacing: '-0.01em' }}>TRUE COST Calculator</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: t.textMuted }}>{selectedCoin.symbol}:</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: t.text }}>{fmt(currentPrice)}</span>
                <button onClick={fetchLivePrices} style={{ padding: '6px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '4px', cursor: 'pointer', display: 'flex' }}>
                  <RefreshCw size={16} color={t.textMuted} style={{ animation: priceLoading ? 'spin 1s linear infinite' : 'none' }} />
                </button>
              </div>
            </div>

            <div style={{ padding: '28px' }}>
              
              {/* Coin Selector */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: t.textMuted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Cryptocurrency</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {COINS.slice(0, 6).map(c => {
                    const price = livePrices[c.symbol] || FALLBACK_PRICES[c.symbol];
                    const isSelected = selectedCoin.id === c.id;
                    return (
                      <button key={c.id} onClick={() => setSelectedCoin(c)} style={{ padding: '14px 10px', background: isSelected ? t.accentBg : t.bgAlt, border: `1px solid ${isSelected ? t.accentBorder : t.border}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                          <img src={c.logo} alt={c.name} style={{ width: '22px', height: '22px', borderRadius: '50%', background: ['XRP', 'ATOM', 'NEAR'].includes(c.symbol) ? 'white' : 'transparent', padding: ['XRP', 'ATOM', 'NEAR'].includes(c.symbol) ? '2px' : 0 }} onError={(e) => { e.target.style.display = 'none'; }} />
                          <span style={{ fontSize: '16px', fontWeight: 700, color: isSelected ? t.accent : t.text }}>{c.symbol}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: t.textMuted }}>{fmt(price)}</div>
                      </button>
                    );
                  })}
                </div>
                
                {/* More coins dropdown */}
                <div ref={coinDropdownRef}>
                  <button onClick={() => setShowCoinDropdown(!showCoinDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 18px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', cursor: 'pointer', marginTop: '10px', width: '100%', justifyContent: 'center', color: t.textMuted, fontSize: '14px', fontFamily: '"Space Mono", monospace' }}>
                    <ChevronDown size={16} style={{ transform: showCoinDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
                    {showCoinDropdown ? 'Hide' : 'Show 12 more coins'}
                  </button>
                  
                  {showCoinDropdown && (
                    <div style={{ marginTop: '10px', padding: '14px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {COINS.slice(6).map(c => {
                          const price = livePrices[c.symbol] || FALLBACK_PRICES[c.symbol];
                          const isSelected = selectedCoin.id === c.id;
                          return (
                            <button key={c.id} onClick={() => { setSelectedCoin(c); setShowCoinDropdown(false); }} style={{ padding: '12px 8px', background: isSelected ? t.accentBg : t.bgCard, border: `1px solid ${isSelected ? t.accentBorder : t.border}`, borderRadius: '6px', cursor: 'pointer', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <img src={c.logo} alt={c.name} style={{ width: '20px', height: '20px', borderRadius: '50%', background: ['XRP', 'ATOM', 'NEAR'].includes(c.symbol) ? 'white' : 'transparent', padding: ['XRP', 'ATOM', 'NEAR'].includes(c.symbol) ? '2px' : 0 }} onError={(e) => { e.target.style.display = 'none'; }} />
                                <span style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? t.accent : t.text }}>{c.symbol}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>{fmt(price)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount & Options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
                {/* Amount + DCA Toggle */}
                <div>
                  {/* DCA Mode Toggle */}
                  <div style={{ display: 'flex', marginBottom: '16px', background: t.bgAlt, borderRadius: '8px', padding: '4px', border: `1px solid ${t.border}` }}>
                    <button 
                      onClick={() => setIsDCAMode(false)} 
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        background: !isDCAMode ? t.accent : 'transparent', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        color: !isDCAMode ? 'white' : t.textMuted,
                        fontSize: '13px',
                        fontWeight: 600,
                        fontFamily: '"Space Mono", monospace',
                        transition: 'all 0.2s'
                      }}
                    >
                      Single Buy
                    </button>
                    <button 
                      onClick={() => setIsDCAMode(true)} 
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        background: isDCAMode ? t.accent : 'transparent', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        color: isDCAMode ? 'white' : t.textMuted,
                        fontSize: '13px',
                        fontWeight: 600,
                        fontFamily: '"Space Mono", monospace',
                        transition: 'all 0.2s'
                      }}
                    >
                      Monthly DCA ⭐
                    </button>
                  </div>

                  <label style={{ display: 'block', fontSize: '13px', color: t.textMuted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isDCAMode ? 'Monthly Amount (USD)' : 'Amount (USD)'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                    <span style={{ padding: '0 14px', color: t.textMuted, fontSize: '18px' }}>$</span>
                    <input type="number" value={amount} onChange={e => setAmount(Math.max(0, parseFloat(e.target.value) || 0))} style={{ flex: 1, padding: '14px 14px 14px 0', background: 'transparent', border: 'none', color: t.text, fontSize: '18px', fontWeight: 600, fontFamily: '"Space Mono", monospace', outline: 'none' }} />
                    {isDCAMode && <span style={{ padding: '0 14px', color: t.textMuted, fontSize: '14px' }}>/mo</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    {(isDCAMode ? [100, 250, 500, 1000, 2000] : [100, 500, 1000, 5000, 10000]).map(val => (
                      <button key={val} onClick={() => setAmount(val)} style={{ flex: 1, padding: '10px', background: amount === val ? t.accent : t.bgAlt, border: `1px solid ${amount === val ? t.accent : t.border}`, borderRadius: '4px', color: amount === val ? 'white' : t.textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"Space Mono", monospace' }}>${val >= 1000 ? `${val/1000}K` : val}</button>
                    ))}
                  </div>
                  
                  {/* DCA Summary */}
                  {isDCAMode && (
                    <div style={{ marginTop: '12px', padding: '12px', background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: t.textMuted }}>Yearly investment:</span>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: t.accent }}>{fmt(totalInvestment)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: t.textMuted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Options</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'withdrawal', label: 'Include withdrawal fee', desc: 'Cost to move to your wallet', checked: includeWithdrawal, onChange: () => setIncludeWithdrawal(!includeWithdrawal) },
                      { id: 'spread', label: 'Include spread', desc: 'The hidden cost most ignore', checked: showSpread, onChange: () => setShowSpread(!showSpread) }
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={opt.checked} onChange={opt.onChange} style={{ display: 'none' }} />
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: opt.checked ? t.accent : 'transparent', border: `2px solid ${opt.checked ? t.accent : t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {opt.checked && <Check size={14} color="white" />}
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: t.text }}>{opt.label}</div>
                          <div style={{ fontSize: '13px', color: t.textMuted }}>{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* ========== SAVINGS BOX ========== */}
              {potentialSavings > 3 && (
                <div style={{ 
                  background: `linear-gradient(135deg, ${isDark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)'} 0%, ${isDark ? 'rgba(34,197,94,0.04)' : 'rgba(34,197,94,0.02)'} 100%)`,
                  border: `1px solid ${t.accentBorder}`,
                  borderRadius: '10px',
                  padding: '20px 24px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>💰</span>
                    <div>
                      <div style={{ fontSize: '13px', color: t.textMuted, marginBottom: '2px' }}>
                        You could save
                      </div>
                      <div style={{ fontSize: '14px', color: t.text }}>
                        <span style={{ color: t.accent, fontWeight: 700 }}>cheapest</span>
                        <span style={{ color: t.textMuted }}> vs </span>
                        <span style={{ color: t.danger, fontWeight: 600 }}>most expensive</span>
                        <span style={{ color: t.textMuted }}> exchange</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 700, color: t.accent, lineHeight: 1 }}>
                      {fmt(potentialSavings)}
                    </div>
                    <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px' }}>
                      {isDCAMode ? 'in a year' : 'per deal'}
                    </div>
                  </div>
                </div>
              )}

              {/* Results Table */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: t.textMuted, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Results · {isDCAMode ? 'Yearly TRUE COST' : 'TRUE COST'} · Sorted lowest first
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {results.map((ex, i) => {
                    const displayCost = ex.dcaTotalCost;
                    const totalPay = totalInvestment + displayCost;
                    const extraVsBest = displayCost - best.dcaTotalCost;
                    return (
                    <div key={ex.key} onClick={() => setSelectedExchange(ex.key)} style={{ padding: '18px', background: i === 0 ? t.accentBg : t.bgAlt, border: `1px solid ${i === 0 ? t.accentBorder : t.border}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {/* Top Row: Exchange + Total */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: t.bgCard, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {i === 0 ? <span style={{ fontSize: '18px' }}>🏆</span> : <><img src={ex.logo} alt={ex.name} style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '4px' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} /><span style={{ display: 'none', fontSize: '18px' }}>{ex.emoji}</span></>}
                          </div>
                          <div>
                            <div style={{ fontSize: '17px', fontWeight: 700, color: t.text }}>{ex.name}</div>
                            {i === 0 && <div style={{ fontSize: '12px', fontWeight: 600, color: t.accent }}>✓ LOWEST TRUE COST</div>}
                            {i > 0 && extraVsBest > 1 && <div style={{ fontSize: '12px', fontWeight: 600, color: t.danger }}>+{fmt(extraVsBest)} vs best</div>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '22px', fontWeight: 700, color: i === 0 ? t.accent : t.text }}>{fmt(totalPay)}</div>
                          <div style={{ fontSize: '11px', color: t.textMuted }}>
                            {isDCAMode ? 'Total/year' : 'Total'} <span style={{ color: i === 0 ? t.accent : t.danger, fontWeight: 600 }}>({fmt(displayCost)} fees)</span>
                          </div>
                        </div>
                      </div>

                      {/* Fee Breakdown Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: includeWithdrawal ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px', padding: '12px', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', borderRadius: '6px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>
                            {fmt(isDCAMode ? ex.tradingFee * 12 : ex.tradingFee)}
                          </div>
                          <div style={{ fontSize: '10px', color: t.textLight, textTransform: 'uppercase' }}>
                            Fee ({ex.fee}%){isDCAMode && ' ×12'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>
                            {fmt(isDCAMode ? ex.spreadCost * 12 : ex.spreadCost)}
                          </div>
                          <div style={{ fontSize: '10px', color: t.textLight, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            Spread{isDCAMode && ' ×12'}
                            <span style={{ 
                              fontSize: '7px', 
                              padding: '1px 4px', 
                              borderRadius: '3px', 
                              background: spreadStatus[ex.key] === 'live' ? t.accentBg : 'rgba(234,179,8,0.15)', 
                              color: spreadStatus[ex.key] === 'live' ? t.accent : '#EAB308',
                              fontWeight: 700
                            }}>
                              {spreadStatus[ex.key] === 'live' ? 'LIVE' : 'EST'}
                            </span>
                          </div>
                        </div>
                        {includeWithdrawal && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>
                              {fmt(ex.withdrawalFee)}
                            </div>
                            <div style={{ fontSize: '10px', color: t.textLight, textTransform: 'uppercase' }}>
                              Withdraw{isDCAMode && ' (1×)'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <a href={ex.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'block', width: '100%', padding: '14px', background: i === 0 ? t.accent : t.bgCard, border: `1px solid ${i === 0 ? t.accent : t.border}`, borderRadius: '6px', color: i === 0 ? 'white' : t.text, fontSize: '15px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                        {i === 0 ? '🎁 Get Best Deal' : `Trade on ${ex.name}`} →
                      </a>
                    </div>
                  );})}
                </div>
              </div>

              {/* Info Box */}
              <div style={{ marginTop: '28px', padding: '18px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <Info size={18} color={t.textMuted} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '13px', color: t.textMuted, lineHeight: 1.7 }}>
                    <span style={{ color: t.accent }}>● Live:</span> Prices (30s), Spreads ({Object.values(spreadStatus).filter(s => s === 'live').length}/8 exchanges).
                    <br /><span style={{ color: t.warning }}>● Verified {FEES_LAST_VERIFIED}:</span> Trading fees & withdrawal fees.
                    <br /><span style={{ fontSize: '11px', color: t.textLight }}>
                      <span style={{ color: t.accent }}>LIVE</span> = Real-time data · 
                      <span style={{ color: '#EAB308' }}> &lt;$1</span> = Low-cost chains (SOL, XRP, etc.) · 
                      <span style={{ color: t.textLight }}> ~</span> = Estimate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== COMPARE ALL EXCHANGES ==================== */}
        <section id="exchanges" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: t.text, marginBottom: '10px', textAlign: 'center', letterSpacing: '-0.01em' }}>Compare All Exchanges</h2>
          <p style={{ fontSize: '14px', color: isDark ? '#A1A1AA' : '#666666', textAlign: 'center', marginBottom: '24px', fontWeight: 400, lineHeight: 1.6 }}>Tap any exchange for details and exclusive bonuses</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {Object.entries(EXCHANGES).map(([k, ex]) => {
              const r = results.find(x => x.key === k);
              const isRecommended = ex.tags?.includes('recommended');
              const hasZeroFees = ex.tags?.includes('zero-fees');
              
              return (
                <div key={k} onClick={() => setSelectedExchange(k)} style={{ background: t.bgCard, border: `1px solid ${isRecommended ? t.accentBorder : t.border}`, borderRadius: '8px', padding: '16px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
                  {isRecommended && <div style={{ position: 'absolute', top: '-8px', right: '12px', padding: '4px 8px', background: t.accent, borderRadius: '4px', fontSize: '8px', fontWeight: 600, color: 'white', textTransform: 'uppercase' }}>★ Top Pick</div>}
                  {hasZeroFees && !isRecommended && <div style={{ position: 'absolute', top: '-8px', right: '12px', padding: '4px 8px', background: t.warning, borderRadius: '4px', fontSize: '8px', fontWeight: 600, color: 'white', textTransform: 'uppercase' }}>0% Fees</div>}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: t.bgAlt, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={ex.logo} alt={ex.name} style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '4px' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                        <span style={{ display: 'none', fontSize: '14px' }}>{ex.emoji}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: t.text }}>{ex.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          {[1,2,3,4,5].map(s => <Star key={s} size={9} color={s <= Math.round(ex.rating) ? '#F59E0B' : t.textLight} fill={s <= Math.round(ex.rating) ? '#F59E0B' : 'none'} />)}
                          <span style={{ fontSize: '9px', color: t.textMuted, marginLeft: '3px' }}>{ex.users}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: ex.fee <= 0.1 ? t.accent : t.warning }}>{ex.fee}%</div>
                      <div style={{ fontSize: '8px', color: t.textLight, textTransform: 'uppercase' }}>Fee</div>
                    </div>
                  </div>

                  {ex.bonus && ex.bonus !== 'None currently' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', background: t.accentBg, borderRadius: '4px', marginBottom: '12px' }}>
                      <Gift size={11} color={t.accent} />
                      <span style={{ fontSize: '10px', color: t.accent, fontWeight: 600 }}>{ex.bonus}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '8px', color: t.textLight, textTransform: 'uppercase' }}>Trust</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: ex.trust >= 95 ? t.accent : t.warning }}>{ex.trust}/100</div>
                      </div>
                      {r && (
                        <div>
                          <div style={{ fontSize: '8px', color: t.textLight, textTransform: 'uppercase' }}>Cost</div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: r === best ? t.accent : t.text }}>{fmt(r.totalCost)}</div>
                        </div>
                      )}
                    </div>
                    <a href={ex.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ padding: '10px 16px', background: t.accent, borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: 'white', textDecoration: 'none' }}>Sign Up</a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================== HARDWARE WALLETS ==================== */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Lock size={18} color={t.accent} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.text, letterSpacing: '-0.01em' }}>Secure Your Crypto</h3>
            </div>
            <p style={{ fontSize: '13px', color: isDark ? '#A1A1AA' : '#666666', lineHeight: 1.65, fontWeight: 400, marginBottom: '16px' }}>
              <strong style={{ color: t.text, fontWeight: 600 }}>"Not your keys, not your coins."</strong> A hardware wallet is essential for holdings over $1,000.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <a href={WALLETS.ledger.url} target="_blank" rel="noopener noreferrer" style={{ padding: '12px', background: t.accent, borderRadius: '6px', color: 'white', fontWeight: 600, textDecoration: 'none', fontSize: '13px', textAlign: 'center' }}>
                Ledger <span style={{ fontSize: '10px', opacity: 0.8, fontWeight: 400 }}>$79</span>
              </a>
              <a href={WALLETS.trezor.url} target="_blank" rel="noopener noreferrer" style={{ padding: '12px', background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', color: t.text, fontWeight: 600, textDecoration: 'none', fontSize: '13px', textAlign: 'center' }}>
                Trezor <span style={{ fontSize: '10px', color: isDark ? '#71717A' : '#888888', fontWeight: 400 }}>$69</span>
              </a>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: t.text, marginBottom: '10px', textAlign: 'center', letterSpacing: '-0.01em' }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: '14px', color: isDark ? '#A1A1AA' : '#666666', textAlign: 'center', marginBottom: '32px', fontWeight: 400, lineHeight: 1.6 }}>Everything you need to know about crypto fees and TRUE COST</p>
          
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' }}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: t.text, paddingRight: '16px', letterSpacing: '-0.01em' }}>{f.q}</span>
                  <ChevronDown size={16} color={t.textMuted} style={{ transform: expandedFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s', flexShrink: 0 }} />
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: '0 20px 16px', fontSize: '13px', color: isDark ? '#A1A1AA' : '#666666', lineHeight: 1.7, fontWeight: 400 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ==================== FOOTER ==================== */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '40px 20px', background: t.bgCard }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>CryptoTrader</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: t.accent }}>Pro</span>
              </div>
              <p style={{ fontSize: '11px', color: t.textMuted, lineHeight: 1.6 }}>Free calculator showing the TRUE COST of buying crypto. Compare 9 exchanges, 18 coins.</p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: t.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Exchanges</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.values(EXCHANGES).slice(0, 5).map(ex => (
                  <a key={ex.name} href={ex.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: t.textMuted, textDecoration: 'none' }}>{ex.name}</a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: t.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href={WALLETS.ledger.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: t.textMuted, textDecoration: 'none' }}>Ledger Wallets</a>
                <a href={WALLETS.trezor.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: t.textMuted, textDecoration: 'none' }}>Trezor Wallets</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: t.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rechtliches</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: t.textMuted }}>
                <span onClick={() => setLegalModal('impressum')} style={{ cursor: 'pointer' }}>Impressum</span>
                <span onClick={() => setLegalModal('privacy')} style={{ cursor: 'pointer' }}>Datenschutz</span>
                <span onClick={() => setLegalModal('terms')} style={{ cursor: 'pointer' }}>Nutzungsbedingungen</span>
                <span onClick={() => setLegalModal('affiliate')} style={{ cursor: 'pointer' }}>Werbehinweis</span>
              </div>
            </div>
          </div>
          
          <div style={{ paddingTop: '20px', borderTop: `1px solid ${t.border}`, fontSize: '12px', color: t.textLight, textAlign: 'center' }}>
            <p style={{ marginBottom: '8px' }}>© {new Date().getFullYear()} CryptoTrader Pro · Wien, Österreich</p>
            <p style={{ marginBottom: '4px' }}>Keine Finanzberatung. Kryptowährungen sind volatil und risikoreich. Sie können Ihr gesamtes Kapital verlieren.</p>
            <p><strong style={{ color: t.textMuted }}>Werbehinweis:</strong> Diese Seite enthält Affiliate-Links. Bei Registrierung erhalten wir eine Provision – für Sie entstehen keine Mehrkosten.</p>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; font-size: 16px !important; }
        button, a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        button:hover, a:hover { opacity: 0.9; }
        button:active, a:active { transform: scale(0.98); }
        @media (max-width: 380px) {
          main { padding: 0 12px !important; }
        }
      `}</style>
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://api.binance.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    </div>
  );
}
