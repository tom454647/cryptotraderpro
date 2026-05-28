interface BrandLogoProps {
  className?: string;       // sizes the wordmark via font-size (e.g. text-xl)
  showWordmark?: boolean;   // kept for API compatibility; the logo IS the wordmark
}

/**
 * Brand = a pure typographic wordmark. No icon.
 *
 * "CryptoTrader Pro" set in Instrument Serif, inheriting the parent's text
 * colour (cream on the dark canvas). The only accent is the closing full
 * stop in burgundy — a quiet newspaper-masthead signature. "Pro" is NOT
 * italicised and NOT colour-shifted (operator call): the wordmark reads as
 * one clean unit, the red dot is the single signature mark.
 */
export function BrandLogo({ className }: BrandLogoProps): React.ReactElement {
  return (
    <span
      className={`font-display font-normal leading-none tracking-[-0.01em] ${className ?? ''}`}
      aria-label="CryptoTrader Pro"
    >
      CryptoTrader Pro<span className="text-[var(--color-accent-bright)]">.</span>
    </span>
  );
}
