interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
}

/**
 * CryptoTrader Pro mark — a stylised prism refracting one incoming beam
 * into four spectrum rays. The spectrum stops live in globals.css as
 * --logo-ray-1..4; they are the ONE place where the original spectrum
 * gradient survives. Everywhere else the brand uses a single burgundy
 * accent (see the editorial-identity comment in globals.css).
 *
 * The wordmark is in Instrument Serif Italic — distinct, editorial,
 * unmistakably not Geist.
 */
export function BrandLogo({
  className,
  showWordmark = true,
}: BrandLogoProps): React.ReactElement {
  return (
    <svg
      viewBox={showWordmark ? '0 0 360 64' : '0 0 72 64'}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CryptoTrader Pro"
      className={className}
    >
      {/* Incoming beam */}
      <line
        x1="0"
        y1="32"
        x2="22"
        y2="32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Prism — thin-stroked triangle */}
      <polygon
        points="22,32 46,12 46,52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Refracted rays — the one place spectrum stops are quoted */}
      <line x1="46" y1="22" x2="68" y2="14" stroke="var(--logo-ray-1)" strokeWidth="2" strokeLinecap="round" />
      <line x1="46" y1="29" x2="68" y2="26" stroke="var(--logo-ray-2)" strokeWidth="2" strokeLinecap="round" />
      <line x1="46" y1="35" x2="68" y2="38" stroke="var(--logo-ray-3)" strokeWidth="2" strokeLinecap="round" />
      <line x1="46" y1="42" x2="68" y2="50" stroke="var(--logo-ray-4)" strokeWidth="2" strokeLinecap="round" />

      {showWordmark && (
        <text
          x="84"
          y="40"
          fontFamily="var(--font-display), Georgia, serif"
          fontSize="22"
          fontStyle="italic"
          fontWeight="400"
          letterSpacing="-0.01em"
          fill="currentColor"
        >
          CryptoTrader Pro
        </text>
      )}
    </svg>
  );
}
