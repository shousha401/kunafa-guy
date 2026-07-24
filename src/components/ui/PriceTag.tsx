import type { ItemStatus } from '@/content/site.config';
import { UnconfirmedBadge } from './UnconfirmedBadge';

interface PriceTagProps {
  price: number | null;
  label?: string;
  status: ItemStatus;
  size?: 'md' | 'hero'; // hero → text-deal scale (Deal block only)
  tone?: 'light' | 'dark';
}

export function PriceTag({ price, label, status, size = 'md', tone = 'light' }: PriceTagProps) {
  const showBadge = status === 'UNCONFIRMED';

  if (price === null && !label) {
    // No price known at all — badge only
    return showBadge ? <UnconfirmedBadge tone={tone} /> : null;
  }

  const display = label ?? `$${price}`;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span
        className={
          size === 'hero'
            ? 'font-display text-deal font-extrabold text-kunafa-500'
            : 'font-display text-xl font-bold text-kunafa-600'
        }
      >
        {display}
      </span>
      {showBadge && <UnconfirmedBadge tone={tone} />}
    </span>
  );
}
