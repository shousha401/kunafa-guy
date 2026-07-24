import { site } from '@/content/site.config';
import { Hero } from '@/components/sections/Hero';
import { DealBlock } from '@/components/sections/DealBlock';
import { MenuSection } from '@/components/sections/MenuSection';
import { KunafaProcess } from '@/components/sections/KunafaProcess';
import { Catering } from '@/components/sections/Catering';
import { FindUs } from '@/components/sections/FindUs';
import { SocialProof } from '@/components/sections/SocialProof';
import { Footer } from '@/components/sections/Footer';
import { DrizzleDivider } from '@/components/ui/DrizzleDivider';

export default function App() {
  return (
    <>
      <main>
        <Hero
          business={site.business}
          contact={site.contact}
          deals={site.deals}
          heroImage={{
            src: '/images/hero-kunafa-pull.jpg',
            alt: 'Fresh kunafa lifted from the pan with a long molten cheese pull',
          }}
        />
        <div className="bg-griddle-900">
          <DrizzleDivider />
        </div>
        <DealBlock deals={site.deals} contact={site.contact} />
        <MenuSection items={site.menu} />
        <div className="bg-cream-50">
          <DrizzleDivider />
        </div>
        <KunafaProcess steps={site.process} />
        <Catering catering={site.catering} contact={site.contact} />
        <FindUs location={site.location} hours={site.hours} contact={site.contact} />
        <SocialProof social={site.social} reviews={site.reviews} claims={site.claims} />
      </main>
      <Footer
        business={site.business}
        contact={site.contact}
        location={site.location}
        social={site.social}
        halalConfirmed={site.flags.halal === 'CONFIRMED'}
      />
    </>
  );
}
