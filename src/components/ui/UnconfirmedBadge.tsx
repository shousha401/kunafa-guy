interface UnconfirmedBadgeProps {
  text?: string;
  tone?: 'light' | 'dark'; // section background it sits on
}

/** Tiny "price TBC" pill — rendered wherever config says status: 'UNCONFIRMED'. */
export function UnconfirmedBadge({ text = 'price TBC', tone = 'light' }: UnconfirmedBadgeProps) {
  const styles =
    tone === 'light'
      ? 'bg-pistachio-100 text-pistachio-800'
      : 'bg-pistachio-800 text-pistachio-100';
  return (
    <span
      className={`inline-flex items-center rounded-chip px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles}`}
    >
      {text}
    </span>
  );
}
