import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface FlagStripeProps {
  width?: number;
  className?: string;
}

// Palestinian flag drawn once as an SVG tile (correct 1:2 ratio, no stretching).
// The ONLY place flag colors appear on the site.
const FLAG_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60">' +
    '<rect width="120" height="20" y="0" fill="#000000"/>' +
    '<rect width="120" height="20" y="20" fill="#FFFFFF"/>' +
    '<rect width="120" height="20" y="40" fill="#007A3D"/>' +
    '<path d="M0 0 L45 30 L0 60 Z" fill="#CE1126"/>' +
    '</svg>',
);
const FLAG_URL = `url("data:image/svg+xml,${FLAG_SVG}")`;

const SLICES = 12;
const OVERLAP = 1.2; // px — hides seams between slices mid-ripple

/**
 * 3D waving Palestinian flag accent. The flag is cut into vertical slices;
 * each slice ripples with a staggered phase (traveling wave) while the whole
 * flag slowly sways in perspective — cloth in wind, not a stretched stripe.
 * Decorative only; renders flat and still under prefers-reduced-motion.
 */
export function FlagStripe({ width = 72, className = '' }: FlagStripeProps) {
  const reduced = usePrefersReducedMotion();
  const height = width / 2;
  const sliceW = width / SLICES;

  if (reduced) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block ${className}`}
        style={{
          width,
          height,
          backgroundImage: FLAG_URL,
          backgroundSize: `${width}px ${height}px`,
          backgroundRepeat: 'no-repeat',
          borderRadius: 2,
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-block ${className}`}
      style={{ perspective: '300px' }}
    >
      <span className="flag-wave" style={{ width, height }}>
        {Array.from({ length: SLICES }, (_, i) => (
          <span
            key={i}
            className="flag-slice"
            style={{
              width: sliceW + OVERLAP,
              height,
              backgroundImage: FLAG_URL,
              backgroundSize: `${width}px ${height}px`,
              backgroundRepeat: 'no-repeat',
              // overlapped slices start OVERLAP px further left, so the
              // texture offset must shift with them to stay aligned
              backgroundPosition: `${-(i * sliceW) + (i === 0 ? 0 : OVERLAP)}px 0`,
              marginLeft: i === 0 ? 0 : -OVERLAP,
              animationDelay: `${-i * 0.12}s`,
            }}
          />
        ))}
      </span>
    </span>
  );
}
