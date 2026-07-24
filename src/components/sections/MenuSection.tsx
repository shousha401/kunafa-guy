import type { MenuItem } from '@/content/site.config';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PriceTag } from '@/components/ui/PriceTag';

interface MenuSectionProps {
  items: MenuItem[];
}

// Category order is enforced here, not by data order.
const CATEGORY_ORDER: MenuItem['category'][] = ['kunafa', 'burgers', 'shawarma'];
const CATEGORY_LABELS: Record<MenuItem['category'], string> = {
  kunafa: 'Kunafa',
  burgers: 'Smash Burgers',
  shawarma: 'Shawarma',
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
          return (
            <div key={cat}>
              <h3 className="mb-5 font-display text-2xl font-extrabold tracking-tight text-griddle-800">
                {CATEGORY_LABELS[cat]}
              </h3>
              <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {catItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
