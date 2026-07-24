// Hand-rolled inline SVG icons — no icon library, per spec.
interface IconProps {
  className?: string;
}

export function PhoneIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

export function CalendarIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm14 8H3v10h18V10Z" />
    </svg>
  );
}

export function ArrowIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PinIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

export function InstagramIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.46a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.24.64.41 1.37.46 2.43.05 1.06.06 1.4.06 4.13s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.46 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.24-1.37.41-2.43.46-1.06.05-1.4.06-4.12.06s-3.07-.01-4.13-.06c-1.06-.05-1.79-.22-2.43-.46a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.24-.64-.41-1.37-.46-2.43C2.01 15.06 2 14.72 2 12s.01-3.07.06-4.13c.05-1.06.22-1.79.46-2.43A4.9 4.9 0 0 1 3.67 3.67a4.9 4.9 0 0 1 1.77-1.15c.64-.24 1.37-.41 2.43-.46C8.93 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.98.04-1.5.2-1.86.34-.46.18-.8.4-1.15.75-.35.35-.57.69-.75 1.15-.14.35-.3.88-.34 1.86-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.98.2 1.5.34 1.86.18.46.4.8.75 1.15.35.35.69.57 1.15.75.35.14.88.3 1.86.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.98-.04 1.5-.2 1.86-.34.46-.18.8-.4 1.15-.75.35-.35.57-.69.75-1.15.14-.35.3-.88.34-1.86.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.98-.2-1.5-.34-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.35-.14-.88-.3-1.86-.34-1.05-.05-1.37-.06-4.04-.06Zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28Zm0 8.48a3.34 3.34 0 1 0 0-6.68 3.34 3.34 0 0 0 0 6.68Zm6.54-8.69a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </svg>
  );
}

export function FacebookIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

/** 5-star row with fractional fill (e.g. 4.5) via SVG gradient masks. */
export function StarRow({ rating, className = 'h-5 w-5' }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        const gradId = `star-fill-${i}-${Math.round(fill * 100)}`;
        return (
          <svg key={i} className={className} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gradId})`}
              d="M12 2.5 14.94 8.6l6.56.86-4.82 4.6 1.23 6.54L12 17.42 6.09 20.6l1.23-6.54-4.82-4.6 6.56-.86L12 2.5Z"
            />
          </svg>
        );
      })}
    </span>
  );
}
