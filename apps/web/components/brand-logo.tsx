interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
}

/**
 * CryptoTrader Pro logo — a stylized prism refracting a single incoming beam
 * into the brand spectrum (cyan → indigo → violet → magenta). Visualises the
 * Universal-Aggregation pillar: many sources, one clear view.
 *
 * Viewport is wider when the wordmark is shown to fit "CryptoTrader Pro".
 * Use `className="h-9 w-auto"` etc. Pure SVG; the wordmark inherits text-*
 * utilities via currentColor.
 */
export function BrandLogo({
  className,
  showWordmark = true,
}: BrandLogoProps): React.ReactElement {
  return (
    <svg
      viewBox={showWordmark ? '0 0 320 64' : '0 0 72 64'}
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
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Prism — triangle, stroked only */}
      <polygon
        points="22,32 46,12 46,52"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Refracted rays — 4 lines fanning right, each in a spectrum stop */}
      <line x1="46" y1="22" x2="68" y2="14" stroke="oklch(0.78 0.13 200)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="29" x2="68" y2="26" stroke="oklch(0.62 0.18 268)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="35" x2="68" y2="38" stroke="oklch(0.58 0.22 305)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="42" x2="68" y2="50" stroke="oklch(0.66 0.24 340)" strokeWidth="2.5" strokeLinecap="round" />

      {showWordmark && (
        <text
          x="84"
          y="42"
          fontFamily="var(--font-geist-sans), system-ui, sans-serif"
          fontSize="26"
          fontWeight="600"
          letterSpacing="-0.02em"
          fill="currentColor"
        >
          CryptoTrader Pro
        </text>
      )}
    </svg>
  );
}
