/**
 * Hand-drawn syrup zigzag divider — sits between dark/light section pairs.
 * Decorative only.
 */
export function DrizzleDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 48"
        className="block h-8 w-full sm:h-12"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M-20 24 C 60 4, 120 44, 200 24 S 340 4, 420 24 S 560 44, 640 24 S 780 4, 860 24 S 1000 44, 1080 24 S 1220 4, 1300 24 S 1420 44, 1460 24"
          stroke="#C9922E"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
