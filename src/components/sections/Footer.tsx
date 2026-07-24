import type { SiteConfig } from '@/content/site.config';
import { FlagStripe } from '@/components/ui/FlagStripe';
import { PhoneIcon, PinIcon, InstagramIcon, FacebookIcon } from '@/components/ui/Icons';

interface FooterProps {
  business: SiteConfig['business'];
  contact: SiteConfig['contact'];
  location: SiteConfig['location'];
  social: SiteConfig['social'];
  halalConfirmed: boolean;
}

export function Footer({ business, contact, location, social, halalConfirmed }: FooterProps) {
  return (
    <footer className="texture-noise bg-griddle-950 py-14 text-cream-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-gutter text-center">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-tight">{business.name}</p>
          <p
            dir="rtl"
            lang="ar"
            aria-hidden="true"
            className="arabic-ghost mt-1 select-none font-arabic text-4xl"
          >
            {business.nameArabic}
          </p>
        </div>

        <a
          href={contact.phoneHref}
          className="inline-flex items-center gap-2.5 font-display text-2xl font-bold text-kunafa-400 underline-offset-4 hover:underline"
        >
          <PhoneIcon className="h-6 w-6" />
          {contact.phoneDisplay}
        </a>

        <p className="flex items-center justify-center gap-2 text-cream-100">
          <PinIcon className="h-5 w-5 shrink-0 text-kunafa-400" />
          {location.addressLine}
        </p>

        <div className="flex items-center gap-6">
          <a
            href={social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${social.instagram.handle}`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-chip text-cream-100 transition-colors hover:text-kunafa-400"
          >
            <InstagramIcon className="h-7 w-7" />
          </a>
          <a
            href={social.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Facebook ${social.facebook.handle}`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-chip text-cream-100 transition-colors hover:text-kunafa-400"
          >
            <FacebookIcon className="h-7 w-7" />
          </a>
        </div>

        {halalConfirmed && <p className="text-sm text-pistachio-300">Halal</p>}

        <FlagStripe className="mt-2" />

        <p className="text-sm text-cream-100/60">
          © {new Date().getFullYear()} {business.name} · Fresno, CA
        </p>
      </div>
    </footer>
  );
}
