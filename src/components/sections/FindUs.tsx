import type { SiteConfig } from '@/content/site.config';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CTAButton } from '@/components/ui/CTAButton';
import { PinIcon, InstagramIcon } from '@/components/ui/Icons';

interface FindUsProps {
  location: SiteConfig['location'];
  hours: SiteConfig['hours'];
  contact: SiteConfig['contact'];
}

export function FindUs({ location, hours, contact }: FindUsProps) {
  return (
    <Section id="find-us" tone="light" labelledBy="find-us-heading">
      <SectionHeading id="find-us-heading" eyebrow="Fresno, CA" title="Find Us" tone="light" />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div>
            <p className="flex items-start gap-2 font-display text-xl font-bold text-griddle-900">
              <PinIcon className="mt-1 h-5 w-5 shrink-0 text-kunafa-600" />
              {location.addressLine}
            </p>
            <p className="mt-2 pl-7 text-griddle-700">{location.landmarkNote}</p>
          </div>

          <div className="text-griddle-900">
            <CTAButton
              label="Get Directions"
              href={location.mapsDirectionsUrl}
              variant="ghost"
              icon="arrow"
              external
            />
          </div>

          {/* The honest box — must be louder than the map */}
          <div className="rounded-card border-2 border-kunafa-500 bg-cream-100 p-6">
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-griddle-900">
              {hours.calloutTitle}
            </h3>
            <p className="mt-2 text-griddle-700">{hours.calloutBody}</p>
            <a
              href={hours.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-card bg-kunafa-500 px-7 py-3.5 font-display text-lg font-bold tracking-tight text-griddle-950 shadow-griddle transition-all duration-200 ease-griddle hover:bg-kunafa-400 focus-visible:ring-2 focus-visible:ring-pistachio-300 active:translate-y-1 active:shadow-griddle-sm"
            >
              <InstagramIcon className="h-5 w-5" />
              Check Instagram for Today's Hours
            </a>
          </div>

          <p className="text-sm text-griddle-700">
            Questions?{' '}
            <a href={contact.phoneHref} className="font-semibold text-kunafa-600 underline underline-offset-2">
              Call or text {contact.phoneDisplay}
            </a>
          </p>
        </div>

        <div className="overflow-hidden rounded-card shadow-lift">
          {location.mapsEmbedUrl ? (
            <iframe
              src={location.mapsEmbedUrl}
              title="Map to The Kunafah Guy"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border-0 lg:h-full lg:min-h-[420px]"
              allowFullScreen
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-cream-200 text-griddle-700">
              <p className="px-6 text-center">
                Map coming soon —{' '}
                <a
                  href={location.mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-kunafa-600 underline"
                >
                  open in Google Maps
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
