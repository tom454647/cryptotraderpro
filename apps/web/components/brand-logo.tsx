interface BrandLogoProps {
  className?: string;       // sizes the whole lockup (icon + wordmark)
  showWordmark?: boolean;
  iconClassName?: string;   // override icon size independently if needed
}

/**
 * Brand lockup = prism icon + wordmark, laid out with flexbox so the
 * wordmark is real HTML text (scales, stays legible) instead of being
 * baked into the SVG at a fixed tiny size.
 *
 * Icon: a clean prism. A single beam enters from the left, passes through
 * a triangular prism, and exits as ONE slightly-bent beam on the right.
 * Deliberately NOT a fan of rays — the fanned version read as a broom.
 * The geometry now says "prism / refraction / a single clear output",
 * which also nods to the aggregation idea (many inputs resolved to one
 * clean line).
 */
export function BrandLogo({
  className,
  showWordmark = true,
  iconClassName,
}: BrandLogoProps): React.ReactElement {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="CryptoTrader Pro"
        className={iconClassName ?? 'h-[1.4em] w-[1.4em] shrink-0'}
        fill="none"
      >
        {/* Incoming beam — enters low-left */}
        <line
          x1="2"
          y1="26"
          x2="13"
          y2="26"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Prism — equilateral triangle, thin outline */}
        <path
          d="M13 30 L22 11 L31 30 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Internal refraction hint — a faint chord across the prism */}
        <line
          x1="13"
          y1="26"
          x2="27.5"
          y2="22"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Exit beam — one beam, bent slightly upward, in the burgundy accent */}
        <line
          x1="27.5"
          y1="22"
          x2="38"
          y2="18"
          stroke="var(--color-accent-bright)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <span
          className="font-display leading-none tracking-[-0.01em]"
          style={{ fontSize: '1.05em' }}
        >
          CryptoTrader&nbsp;Pro
        </span>
      )}
    </span>
  );
}
