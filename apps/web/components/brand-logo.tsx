interface BrandLogoProps {
  className?: string;       // sizes the wordmark via font-size (e.g. text-xl)
  showWordmark?: boolean;   // kept for API compatibility; the logo IS the wordmark now
}

/**
 * Brand = a pure typographic wordmark. No icon.
 *
 * Operator rejected the prism mark (read as a broom). For an editorial brand
 * the typeface IS the identity — like Stripe or Plain in their wordmark
 * phases. "CryptoTrader" in cream Instrument Serif, "Pro" as the burgundy
 * italic signature (the same italic-accent move used on the hero headline),
 * closed with a burgundy full stop like a newspaper masthead.
 *
 * Inherits text colour from the parent via currentColor on "CryptoTrader",
 * so it works on both dark canvas (cream) and any future light surface.
 */
export function BrandLogo({ className }: BrandLogoProps): React.ReactElement {
  return (
    <span
      className={`font-display font-normal leading-none tracking-[-0.01em] ${className ?? ''}`}
      aria-label="CryptoTrader Pro"
    >
      CryptoTrader{' '}
      <em className="text-[var(--color-accent-bright)]">Pro</em>
      <span className="text-[var(--color-accent-bright)]">.</span>
    </span>
  );
}
