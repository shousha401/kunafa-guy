import type { MenuItem } from '@/content/site.config';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PriceTag } from '@/components/ui/PriceTag';

interface MenuSectionProps {
  items: MenuItem[];
}

// Category order is enforced here, not by data order.
const CATEGORY_ORDER: MenuItem['category'][] = ['kunafah', 'burgers', 'chicken', 'sides'];
const CATEGORY_LABELS: Record<MenuItem['category'], string> = {
  kunafah: 'Kunafah',
  burgers: 'Smash Burgers',
  chicken: 'Chicken',
  sides: 'Sides',
};

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <li
      className={`flex flex-col overflow-hidden rounded-card bg-cream-100 shadow-lift ${
        item.featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`overflow-hidden ${item.featured ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-[4/3]'} bg-griddle-800`}>
        <img
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-griddle motion-safe:hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-display text-xl font-bold tracking-tight text-griddle-900">
            {item.name}
          </h4>
          {item.arabicName && (
            <span dir="rtl" lang="ar" className="font-arabic text-2xl leading-none text-kunafa-600">
              {item.arabicName}
            </span>
          )}
        </div>
        {item.description && <p className="text-sm leading-relaxed text-griddle-700">{item.description}</p>}
        <div className="mt-auto pt-2">
          <PriceTag price={item.price} label={item.priceLabel} status={item.status} tone="light" />
        </div>
      </div>
    </li>
  );
}

/**
 * Compact row for items we have no photo of yet. A whole category of
 * "photo coming soon" tiles reads as broken; a classic price list reads as
 * intentional — and still shows the real price.
 */
function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="flex items-baseline gap-3 border-b border-griddle-700/15 py-3 last:border-b-0">
      <span className="font-display text-lg font-bold tracking-tight text-griddle-900">
        {item.name}
      </span>
      <span aria-hidden="true" className="min-w-6 flex-1 border-b border-dotted border-griddle-700/30" />
      <PriceTag price={item.price} label={item.priceLabel} status={item.status} tone="light" />
    </li>
  );
}

export function MenuSection({ items }: MenuSectionProps) {
  return (
    <Section id="menu" tone="light" labelledBy="menu-heading">
      <SectionHeading
        id="menu-heading"
        eyebrow="Made to order"
        title="The Menu"
        arabicAccent="كنافة"
        tone="light"
      />

      <div className="flex flex-col gap-12">
        {CATEGORY_ORDER.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;
          // Photo cards when we have photography for the category; otherwise a
          // clean price list. Keeps the menu honest without looking unfinished.
          const hasPhotos = catItems.some((i) => i.image);
          return (
            <div key={cat}>
              <h3 className="mb-5 font-display text-2xl font-extrabold tracking-tight text-griddle-800">
                {CATEGORY_LABELS[cat]}
              </h3>
              {hasPhotos ? (
                <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {catItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </ul>
              ) : (
                <ul className="list-none rounded-card bg-cream-100 px-5 py-1 sm:max-w-xl">
                  {catItems.map((item) => (
                    <MenuRow key={item.id} item={item} />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
