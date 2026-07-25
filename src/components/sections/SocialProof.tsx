import type { SiteConfig } from '@/content/site.config';
import { Section } from '@/components/layout/Section';
import { StarRow, InstagramIcon, FacebookIcon } from '@/components/ui/Icons';

interface SocialProofProps {
  social: SiteConfig['social'];
  reviews: SiteConfig['reviews'];
  claims: SiteConfig['claims'];
}

export function SocialProof({ social, reviews, claims }: SocialProofProps) {
  const stats = [
    {
      key: 'ig',
      value: social.instagram.followers,
      label: `followers on Instagram`,
      sub: social.instagram.handle,
      url: social.instagram.url,
      icon: <InstagramIcon className="h-5 w-5" />,
    },
    {
      key: 'reviews',
      value: `${reviews.rating}★`,
      label: `over ${reviews.count} ${reviews.source} reviews`,
      sub: null,
      url: reviews.sourceUrl,
      icon: null,
    },
    {
      key: 'fb',
      value: social.facebook.followers,
      label: `followers on Facebook`,
      sub: social.facebook.handle,
      url: social.facebook.url,
      icon: <FacebookIcon className="h-5 w-5" />,
    },
  ];

  return (
    <Section id="social-proof" tone="dark" labelledBy="social-proof-heading">
      <h2 id="social-proof-heading" className="sr-only">
        Reviews and social proof
      </h2>

      <div className="grid gap-8 text-center sm:grid-cols-3">
        {stats.map((stat) => {
          const inner = (
            <>
              <span className="font-display text-5xl font-extrabold tracking-tight text-kunafa-400">
                {stat.value}
              </span>
              {stat.key === 'reviews' && (
                <span className="mt-2 flex justify-center text-syrup-400">
                  <StarRow rating={reviews.rating} />
                </span>
              )}
              <span className="mt-2 flex items-center justify-center gap-1.5 text-sm text-cream-100">
                {stat.icon}
                {stat.label}
              </span>
              {stat.sub && <span className="text-sm text-cream-100/60">{stat.sub}</span>}
            </>
          );
          return stat.url ? (
            <a
              key={stat.key}
              href={stat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center rounded-card p-6 transition-colors duration-200 hover:bg-griddle-800"
            >
              {inner}
            </a>
          ) : (
            <div key={stat.key} className="flex flex-col items-center p-6">
              {inner}
            </div>
          );
        })}
      </div>

      {/* Claim: badge if verified, owner quote if not */}
      <div className="mt-12 flex justify-center">
        {claims.votedBestVerified ? (
          <span className="inline-flex items-center gap-3 rounded-chip bg-pistachio-500 px-6 py-3 font-display text-xl font-bold text-cream-50">
            🏆 {claims.votedBest}
          </span>
        ) : (
          <blockquote className="max-w-xl text-center">
            <p className="font-display text-2xl font-bold italic leading-snug text-cream-100 sm:text-3xl">
              “{claims.votedBest}”
            </p>
            <footer className="mt-3 text-sm uppercase tracking-[0.2em] text-pistachio-300">
              — I'm the Kunafah Guy
            </footer>
          </blockquote>
        )}
      </div>
    </Section>
  );
}
