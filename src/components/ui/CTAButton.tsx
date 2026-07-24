import { PhoneIcon, CalendarIcon, ArrowIcon } from './Icons';

interface CTAButtonProps {
  label: string;
  href: string; // tel: | sms: | #anchor | external
  variant: 'primary' | 'ghost';
  icon?: 'phone' | 'calendar' | 'arrow';
  external?: boolean;
  className?: string;
}

const icons = {
  phone: PhoneIcon,
  calendar: CalendarIcon,
  arrow: ArrowIcon,
};

/**
 * Every conversion path on the site goes through this button.
 * Contract: 56px min touch target, physical press feel (hard shadow collapses),
 * focus-visible ring, works as tel:/sms:/anchor/external link.
 */
export function CTAButton({ label, href, variant, icon, external, className = '' }: CTAButtonProps) {
  const Icon = icon ? icons[icon] : null;

  const base =
    'inline-flex min-h-[56px] min-w-[56px] items-center justify-center gap-2.5 rounded-card px-7 py-3.5 font-display text-lg font-bold tracking-tight transition-all duration-200 ease-griddle focus-visible:ring-2 focus-visible:ring-pistachio-300';

  const variants = {
    primary:
      'bg-kunafa-500 text-griddle-950 shadow-griddle hover:bg-kunafa-400 active:translate-y-1 active:shadow-griddle-sm',
    ghost:
      'border-2 border-current text-inherit hover:bg-cream-50/10 active:translate-y-0.5',
  };

  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span>{label}</span>
    </a>
  );
}
