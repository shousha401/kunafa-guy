// ============================================================
// THE KUNAFAH GUY — SITE CONFIG
// This is the ONLY file you need to edit to update the site.
// Prices, text, links, hours note, socials — all live here.
// Items marked status: 'UNCONFIRMED' show a "price TBC" badge.
// ============================================================

export type ItemStatus = 'CONFIRMED' | 'UNCONFIRMED';

export interface MenuItem {
  id: string;
  name: string;
  arabicName?: string; // e.g. 'كنافة' — rendered RTL
  description: string;
  price: number | null; // null → price hidden, badge shown
  priceLabel?: string; // override e.g. "2 for $10"
  unit?: string; // e.g. 'each', 'tray', 'per person'
  category: 'kunafah' | 'burgers' | 'chicken' | 'sides' | 'drinks';
  image: string; // path under /images/ — see asset manifest in build spec
  imageAlt: string; // REQUIRED — real alt text, not filename
  status: ItemStatus;
  featured?: boolean; // drives card emphasis
}

export interface BurgerDeal {
  id: string;
  label: string; // "2 Smash Burgers"
  price: number;
  status: ItemStatus;
  note?: string;
}

export interface ProcessStep {
  n: 1 | 2 | 3 | 4;
  title: string;
  caption: string;
  image: { src: string; alt: string };
}

export interface SiteConfig {
  business: {
    name: string;
    nameArabic: string; // graphic accent: 'كنافة'
    taglinePrimary: string;
    taglineSecondary: string;
    ownerName: string;
    heritageLine: string;
  };
  contact: {
    phoneDisplay: string;
    phoneHref: string; // tel:+12097126676
    smsHrefBase: string; // sms:+12097126676
  };
  location: {
    addressLine: string;
    mapsEmbedUrl: string; // Google Maps embed src — UNCONFIRMED: confirm exact pin
    mapsDirectionsUrl: string;
    landmarkNote: string;
  };
  hours: {
    mode: 'variable'; // never fixed — honest by design
    calloutTitle: string;
    calloutBody: string;
    instagramUrl: string;
  };
  social: {
    instagram: { handle: string; url: string; followers: string };
    facebook: { handle: string; url: string; followers: string };
  };
  reviews: {
    rating: number;
    count: number;
    source: string; // UNCONFIRMED — which platform?
    sourceUrl: string | null;
  };
  claims: {
    votedBest: string;
    votedBestVerified: boolean; // false until source confirmed
  };
  catering: {
    headline: string;
    serviceArea: string;
    smsBodyTemplate: string; // encoded by lib/sms.ts
    fields: string[];
  };
  deals: BurgerDeal[];
  menu: MenuItem[];
  process: ProcessStep[];
  flags: {
    halal: ItemStatus; // show halal note in footer only if CONFIRMED
  };
}

export const site: SiteConfig = {
  business: {
    name: 'The Kunafah Guy',
    nameArabic: 'كنافة',
    taglinePrimary: "I'm the Kunafah Guy.",
    taglineSecondary: 'Fresh kunafah + smash burgers. One griddle.',
    ownerName: 'Arafat Halloum',
    heritageLine: 'Palestinian kunafah, made to order the way it should be.',
  },
  contact: {
    phoneDisplay: '(209) 712-6676',
    phoneHref: 'tel:+12097126676',
    smsHrefBase: 'sms:+12097126676',
  },
  location: {
    addressLine: '21 E Shaw Ave, Fresno, CA 93726',
    // UNCONFIRMED — address-based embed for now; confirm exact pin / Maps listing
    mapsEmbedUrl:
      'https://www.google.com/maps?q=21+E+Shaw+Ave,+Fresno,+CA+93726&output=embed',
    mapsDirectionsUrl:
      'https://www.google.com/maps/search/?api=1&query=21+E+Shaw+Ave+Fresno+CA+93726',
    landmarkNote: 'Food-court lot next to Lifestyle Furniture',
  },
  hours: {
    mode: 'variable',
    calloutTitle: 'Hours vary daily',
    calloutBody: "Check today's post on Instagram before you roll up.",
    instagramUrl: 'https://www.instagram.com/thekunafahguy/',
  },
  social: {
    instagram: {
      handle: '@thekunafahguy',
      url: 'https://www.instagram.com/thekunafahguy/',
      followers: '3.5K', // UNCONFIRMED snapshot — verify at launch
    },
    facebook: {
      handle: 'the_kunafa_guy',
      url: 'https://www.facebook.com/the_kunafa_guy', // UNCONFIRMED — exact URL slug
      followers: '570', // UNCONFIRMED snapshot
    },
  },
  reviews: {
    rating: 4.5,
    count: 46,
    source: 'Google', // UNCONFIRMED — which platform?
    sourceUrl: null,
  },
  claims: {
    votedBest: 'Voted #1 Kunafah in all of California',
    votedBestVerified: false, // must be true (with source) before badge styling ships
  },
  catering: {
    headline: 'We roll to you — anywhere in California.',
    serviceArea: 'All of California',
    smsBodyTemplate:
      'Hi! Catering inquiry — Name: {name} | Date: {date} | City: {city} | Guests: {headcount}',
    fields: ['name', 'date', 'city', 'headcount'],
  },
  // Confirmed from the owner's own pull-up banners (photos sent 2026-07-25):
  // "2 FOR $10 SINGLE" and "2 FOR $15 DOUBLE".
  deals: [
    { id: 'deal-2-single', label: '2 Smash Burgers', price: 10, status: 'CONFIRMED' },
    { id: 'deal-2-double', label: '2 Double Smash Burgers', price: 15, status: 'CONFIRMED' },
  ],
  // Every price below is transcribed from the menu board in the truck's service
  // window (owner's photos, 2026-08-08). That board REPLACED the one photographed
  // 2026-07-25, and most prices moved — kunafah 7→8, smash burger 8→7, chicken
  // sandwich 7→6 — so do not merge the two boards. Items with no photo yet use
  // image: '' — see MenuSection for how those render.
  menu: [
    {
      id: 'kunafah-classic',
      name: 'Fresh Kunafah Slice', // board wording, verbatim
      arabicName: 'كنافة',
      description:
        'Shredded kataifi, molten cheese, syrup, crushed pistachio — made to order.',
      price: 8,
      category: 'kunafah',
      image: '/images/menu-kunafa-classic.jpg',
      imageAlt: 'Golden kunafah tray topped with crushed pistachio, cheese pull strands draped over the rim',
      status: 'CONFIRMED',
      featured: true,
    },
    {
      id: 'kunafah-tray',
      name: 'Kunafah Tray',
      arabicName: 'كنافة',
      // Trays are NOT on the 2026-08-08 board. The old board listed S $25 / M $45
      // / L $65, but that board is gone and every price on it moved, so those
      // numbers are no longer sourced. Downgraded to UNCONFIRMED (renders "price
      // TBC") rather than shipping a stale number. Restore priceLabel and flip to
      // CONFIRMED the moment the owner confirms current tray pricing.
      description: 'Whole tray, made to order. Call or text for sizes and pricing.',
      price: null,
      category: 'kunafah',
      image: '/images/menu-kunafah-tray.jpg',
      imageAlt: 'Full tray of kunafah topped with crushed pistachio',
      status: 'UNCONFIRMED',
    },
    {
      id: 'burger-smash',
      name: 'Smash Burger',
      description: 'Crispy lacy edges, hard griddle sear. 100% halal beef.',
      price: 7,
      category: 'burgers',
      image: '/images/menu-burger-smash.jpg',
      imageAlt: 'Smash burger with crispy caramelized edges on a griddle',
      status: 'CONFIRMED',
    },
    {
      id: 'burger-double',
      name: 'Smash Burger Double',
      description: 'Two patties, double the crust. 100% halal beef.',
      price: 10,
      category: 'burgers',
      image: '/images/menu-burger-double.jpg',
      imageAlt: 'Double smash burger stacked with melted cheese',
      status: 'CONFIRMED',
    },
    {
      id: 'burger-triple',
      name: 'Smash Burger Triple',
      description: 'Three patties. 100% halal beef.',
      // Reuses the double-burger photo — we still only have the one 236x314
      // burger thumbnail (see CLAUDE.md "Photos"). Alt text describes the photo
      // that is actually there, not the item name.
      price: 12,
      category: 'burgers',
      image: '/images/menu-burger-double.jpg',
      imageAlt: 'Double smash burger stacked with melted cheese',
      status: 'CONFIRMED',
    },
    {
      id: 'chicken-sandwich',
      name: 'Chicken Sandwich',
      description: '',
      price: 6,
      category: 'chicken',
      image: '', // no photo yet
      imageAlt: 'Chicken sandwich',
      status: 'CONFIRMED',
    },
    {
      id: 'chicken-wings-bbq',
      name: 'Chicken Wings BBQ',
      description: '',
      price: 8,
      category: 'chicken',
      image: '',
      imageAlt: 'BBQ chicken wings',
      status: 'CONFIRMED',
    },
    {
      id: 'chicken-wings-buffalo',
      name: 'Chicken Wings Buffalo',
      description: '',
      price: 8,
      category: 'chicken',
      image: '',
      imageAlt: 'Buffalo chicken wings',
      status: 'CONFIRMED',
    },
    {
      id: 'fries',
      name: 'Fries',
      description: '',
      price: null,
      priceLabel: 'Small $3 · Large $5',
      category: 'sides',
      image: '',
      imageAlt: 'Portion of fries',
      status: 'CONFIRMED',
    },
    {
      id: 'loaded-burger-fries',
      name: 'Loaded Burger Fries',
      description: '',
      price: 12,
      category: 'sides',
      image: '', // he has a poster shot of this — see CLAUDE.md before adding it
      imageAlt: 'Fries loaded with smash burger patty, lettuce, tomato, pickles and sauce',
      status: 'CONFIRMED',
    },
    {
      id: 'mozzarella-sticks',
      name: 'Mozzarella Sticks',
      description: '',
      price: 6,
      category: 'sides',
      image: '',
      imageAlt: 'Fried mozzarella sticks',
      status: 'CONFIRMED',
    },
    {
      id: 'zucchini-sticks',
      name: 'Zucchini Sticks',
      description: '',
      price: 6,
      category: 'sides',
      image: '',
      imageAlt: 'Fried zucchini sticks',
      status: 'CONFIRMED',
    },
    {
      id: 'soda',
      name: 'Soda',
      description: '',
      price: 2,
      category: 'drinks',
      image: '',
      imageAlt: 'Canned soda',
      status: 'CONFIRMED',
    },
    {
      id: 'water',
      name: 'Water',
      // The board prices water, but the card-acceptance sticker covers the digit
      // in every photo — only the "$" is visible. Not guessing it.
      description: '',
      price: null,
      category: 'drinks',
      image: '',
      imageAlt: 'Bottled water',
      status: 'UNCONFIRMED',
    },
    // Add new items here as the owner confirms them — components never change.
  ],
  // NOTE: these four images are different macro crops of one baked tray —
  // we don't have photos of the actual shred/sear/pull/drench stages yet, so
  // the alt text describes what each crop really shows.
  process: [
    {
      n: 1,
      title: 'Shred',
      caption: 'Kataifi shreds hit the buttered pan.',
      image: { src: '/images/process-shred.jpg', alt: 'Corner of a baked kunafah tray showing plain golden kataifi against the pan edge' },
    },
    {
      n: 2,
      title: 'Sear',
      caption: 'Griddle heat toasts it deep orange.',
      image: { src: '/images/process-sear.jpg', alt: 'Golden toasted kataifi crust with crushed pistachio scattered at the edge' },
    },
    {
      n: 3,
      title: 'Pull',
      caption: 'Molten cheese. The moment.',
      image: { src: '/images/process-pull.jpg', alt: 'Cut triangle of kunafah heavily topped with crushed pistachio' },
    },
    {
      n: 4,
      title: 'Drench',
      caption: 'Syrup poured, pistachio crushed on top.',
      image: { src: '/images/process-drench.jpg', alt: 'Close-up of crushed pistachio blanketing syrup-glossed kunafah' },
    },
  ],
  flags: {
    // His banner reads "SMASH BURGERS 100% BEEF HALAL" and the truck banner
    // reads "HALAL" — self-described by the owner, not third-party certified.
    halal: 'CONFIRMED',
  },
};
