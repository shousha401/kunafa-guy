import type { SiteConfig, BurgerDeal } from '@/content/site.config';
import { CTAButton } from '@/components/ui/CTAButton';
import { FlagStripe } from '@/components/ui/FlagStripe';
import { UnconfirmedBadge } from '@/components/ui/UnconfirmedBadge';
import { ChevronDownIcon } from '@/components/ui/Icons';

interface HeroProps {
  business: SiteConfig['business'];
  contact: SiteConfig['contact'];
  deals: BurgerDeal[]; // overlay shows cheapest deal
  heroImage: { src: string; alt: string };
}

export function Hero({ business, contact, deals, heroImage }: HeroProps) {
  const topDeal = [...deals].sort((a, b) => a.price - b.price)[0];

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-griddle-950 text-cream-50"
    >
      {/* Hero photo — LCP element */}
      <img
        src={heroImage.src}
        alt={heroImage.alt}
        loading="eager"
        // React 18 needs the lowercase DOM attribute; camelCase lands in React 19
        {...({ fetchpriority: 'high' } as Record<string, string>)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Scrim — guarantees 4.5:1 text contrast over any photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-griddle-950 via-griddle-950/70 to-griddle-950/10"
      />

      <div className="relative mx-auto w-full max-w-6xl px-gutter pb-20 pt-32 sm:pb-24">
        {/* Ghost Arabic accent */}
        <span
          dir="rtl"
          lang="ar"
          aria-hidden="true"
          className="arabic-ghost pointer-events-none absolute -top-2 right-gutter select-none font-arabic text-8xl sm:text-9xl"
        >
          {business.nameArabic}
        </span>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-pistachio-300">
          Fresno, CA
        </p>

        <h1
          id="hero-heading"
          className="font-display text-[clamp(2.5rem,9vw,5rem)] font-extrabold leading-[0.95] tracking-tight"
        >
          {business.taglinePrimary}
        </h1>

        <FlagStripe className="mt-4" />

        <p className="mt-4 max-w-xl text-lg text-cream-100">{business.taglineSecondary}</p>

        {/* Deal strip chip */}
        {topDeal && (
          <p className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-card border-2 border-kunafa-500 bg-griddle-900/80 px-5 py-3">
            <span className="font-display text-xl font-bold sm:text-2xl">
              {topDeal.label} —{' '}
              <span className="text-kunafa-400">${topDeal.price}</span>
            </span>
            {topDeal.status === 'UNCONFIRMED' && <UnconfirmedBadge tone="dark" />}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4 min-[480px]:flex-row">
          <CTAButton
            label="Call / Text to Order"
            href={contact.phoneHref}
            variant="primary"
            icon="phone"
            className="w-full min-[480px]:w-auto"
          />
          <CTAButton
            label="Book Us for Your Event"
            href="#catering"
            variant="ghost"
            icon="calendar"
            className="w-full text-cream-50 min-[480px]:w-auto"
          />
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#deal"
        aria-label="Scroll to the burger deal"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-cream-100/70 transition-transform duration-200 ease-griddle hover:translate-y-1 hover:text-kunafa-400 sm:block motion-safe:animate-bounce"
      >
        <ChevronDownIcon />
      </a>
    </section>
  );
}
