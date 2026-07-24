import type { SiteConfig, BurgerDeal } from '@/content/site.config';
import { Section } from '@/components/layout/Section';
import { CTAButton } from '@/components/ui/CTAButton';
import { UnconfirmedBadge } from '@/components/ui/UnconfirmedBadge';

interface DealBlockProps {
  deals: BurgerDeal[];
  contact: SiteConfig['contact'];
}

/**
 * The conversion driver: a graphic monument to $10/$15, never a menu row.
 * Each panel is a tel: link — tap anywhere to call.
 */
export function DealBlock({ deals, contact }: DealBlockProps) {
  return (
    <Section id="deal" tone="dark">
      <h2 id="deal-heading" className="sr-only">
        The Smash Burger Deal
      </h2>

      <p className="mb-10 max-w-2xl font-display text-2xl font-bold leading-snug text-cream-100 sm:text-3xl">
        Two things that shouldn't share a griddle.{' '}
        <span className="text-kunafa-400">Both are perfect.</span>
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {deals.map((deal, i) => (
          <a
            key={deal.id}
            href={contact.phoneHref}
            className="group relative block rounded-card bg-kunafa-500 p-8 text-griddle-950 shadow-griddle transition-transform duration-200 ease-griddle hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-pistachio-300 active:translate-y-1 active:shadow-griddle-sm sm:p-10"
          >
            {i === 0 && (
              <span className="absolute -top-3 right-6 -rotate-3 rounded-chip bg-pistachio-500 px-3 py-1 text-sm font-bold uppercase tracking-wide text-cream-50">
                Most ordered
              </span>
            )}
            <span className="block font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {deal.label}
            </span>
            <span className="mt-2 block font-display text-deal font-extrabold">
              ${deal.price}
            </span>
            {deal.status === 'UNCONFIRMED' && (
              <span className="mt-3 inline-block">
                <UnconfirmedBadge tone="light" />
              </span>
            )}
            <span className="mt-4 block text-sm font-semibold uppercase tracking-wide opacity-70 transition-opacity group-hover:opacity-100">
              Tap to call &amp; order →
            </span>
          </a>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <CTAButton
          label="Call / Text to Order"
          href={contact.phoneHref}
          variant="primary"
          icon="phone"
        />
      </div>
    </Section>
  );
}
