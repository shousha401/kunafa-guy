interface FlagStripeProps {
  width?: number;
  className?: string;
}

/**
 * Palestinian flag accent — the ONLY component allowed to use flag.* colors.
 * Thin horizontal rule: black/white/green bands with red triangle. Decorative.
 */
export function FlagStripe({ width = 64, className = '' }: FlagStripeProps) {
  return (
    <svg
      width={width}
      height={12}
      viewBox="0 0 64 12"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <rect x="0" y="0" width="64" height="4" fill="#000000" />
      <rect x="0" y="4" width="64" height="4" fill="#FFFFFF" />
      <rect x="0" y="8" width="64" height="4" fill="#007A3D" />
      <path d="M0 0 L14 6 L0 12 Z" fill="#CE1126" />
    </svg>
  );
}
