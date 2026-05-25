interface RefractLogoProps {
  className?: string;
  showWordmark?: boolean;
}

/**
 * Refract logo — a stylized prism refracting a single incoming beam
 * into the brand spectrum (cyan → indigo → violet → magenta).
 *
 * The mark is drawn at 256×64 viewport. Use `className="h-9 w-auto"` etc.
 * Pure SVG, no external font dependency for the wordmark (uses currentColor
 * for the prism stroke and a gradient for the refracted rays).
 */
export function RefractLogo({
  className,
  showWordmark = true,
}: RefractLogoProps): React.ReactElement {
  return (
    <svg
      viewBox="0 0 256 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Refract"
      className={className}
    >
      <defs>
        <linearGradient id="refract-spectrum" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.78 0.13 200)" />
          <stop offset="38%" stopColor="oklch(0.62 0.18 268)" />
          <stop offset="68%" stopColor="oklch(0.58 0.22 305)" />
          <stop offset="100%" stopColor="oklch(0.66 0.24 340)" />
        </linearGradient>
      </defs>

      {/* Incoming beam — single white line from the left */}
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
          fontSize="28"
          fontWeight="600"
          letterSpacing="-0.02em"
          fill="currentColor"
        >
          Refract
        </text>
      )}
    </svg>
  );
}
