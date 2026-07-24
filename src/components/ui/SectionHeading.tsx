import { FlagStripe } from './FlagStripe';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  arabicAccent?: string; // ghost word rendered behind the title
  align?: 'left' | 'center'; // default left — NOT center-by-default
  showFlagStripe?: boolean;
  id?: string; // heading id for aria-labelledby wiring
  tone?: 'light' | 'dark';
}

export function SectionHeading({
  eyebrow,
  title,
  arabicAccent,
  align = 'left',
  showFlagStripe = true,
  id,
  tone = 'light',
}: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const eyebrowColor = tone === 'dark' ? 'text-pistachio-300' : 'text-pistachio-600';

  return (
    <div className={`relative mb-10 flex flex-col gap-3 ${alignCls}`}>
      {arabicAccent && (
        <span
          dir="rtl"
          lang="ar"
          aria-hidden="true"
          className="arabic-ghost pointer-events-none absolute -top-10 right-0 select-none font-arabic text-7xl sm:text-8xl"
        >
          {arabicAccent}
        </span>
      )}
      {eyebrow && (
        <span className={`text-sm font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}>
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className="relative font-display text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight"
      >
        {title}
      </h2>
      {showFlagStripe && <FlagStripe />}
    </div>
  );
}
