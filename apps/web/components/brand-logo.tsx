interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
}

/**
 * CryptoTrader Pro mark — a stylised prism refracting one incoming beam
 * into four rays.
 *
 * The rays were originally drawn in the four spectrum stops (cyan→indigo→
 * violet→magenta) and that was the last AI-tell visible on the landing.
 * 2026-05-25 operator decision: pull them monochrome to commit fully to the
 * Vienna-editorial direction. The brand stays single-accent (burgundy) +
 * cream throughout — no spectrum quote left in the surface.
 *
 * Both the prism stroke and the rays use currentColor, so the parent's
 * text-* utility (e.g. text-[var(--color-ink)] in the header, text-
 * [var(--color-accent)] for the burgundy-on-cream variant) cascades cleanly.
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

      {/* Refracted rays — monochrome, all in currentColor.
          The spectrum stays a concept (one beam in, four out) — the visual
          payoff is the geometry, not a rainbow. */}
      <line x1="46" y1="22" x2="68" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="46" y1="29" x2="68" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="46" y1="35" x2="68" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="46" y1="42" x2="68" y2="50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

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
