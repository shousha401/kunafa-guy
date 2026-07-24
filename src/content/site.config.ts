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
  category: 'kunafa' | 'burgers' | 'shawarma';
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
    taglinePrimary: "I'm the Kunafa Guy.",
    taglineSecondary: 'Fresh kunafa + smash burgers. One griddle. Fresno.',
    ownerName: 'Arafat Halloum',
    heritageLine: 'Palestinian kunafa, made to order the way it should be.',
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
    votedBest: 'Voted #1 Kunafa in all of California',
    votedBestVerified: false, // must be true (with source) before badge styling ships
  },
  catering: {
    headline: 'We roll to you — anywhere in California.',
    serviceArea: 'All of California',
    smsBodyTemplate:
      'Hi! Catering inquiry — Name: {name} | Date: {date} | City: {city} | Guests: {headcount}',
    fields: ['name', 'date', 'city', 'headcount'],
  },
  deals: [
    { id: 'deal-2-single', label: '2 Smash Burgers', price: 10, status: 'UNCONFIRMED' },
    { id: 'deal-2-double', label: '2 Double Smash Burgers', price: 15, status: 'UNCONFIRMED' },
  ],
  menu: [
    {
      id: 'kunafa-classic',
      name: 'Fresh Kunafa',
      arabicName: 'كنافة',
      description:
        'Shredded kataifi, molten cheese, syrup, crushed pistachio — made to order.',
      price: null, // UNCONFIRMED
      category: 'kunafa',
      image: '/images/menu-kunafa-classic.jpg',
      imageAlt: 'Fresh kunafa being lifted from the pan with a long cheese pull',
      status: 'UNCONFIRMED',
      featured: true,
    },
    {
      id: 'burger-smash',
      name: 'Smash Burger',
      description: 'Crispy lacy edges, hard griddle sear.',
      price: null, // UNCONFIRMED — deal price known, single price not
      category: 'burgers',
      image: '/images/menu-burger-smash.jpg',
      imageAlt: 'Smash burger with crispy caramelized edges on a griddle',
      status: 'UNCONFIRMED',
    },
    {
      id: 'burger-double',
      name: 'Double Smash Burger',
      description: 'Two patties, double the crust.',
      price: null,
      category: 'burgers',
      image: '/images/menu-burger-double.jpg',
      imageAlt: 'Double smash burger stacked with melted cheese',
      status: 'UNCONFIRMED',
    },
    {
      id: 'shawarma-sandwich',
      name: 'Shawarma Sandwich',
      description: 'Marinated, stacked, shaved hot off the spit.', // UNCONFIRMED — get owner's words
      price: null,
      category: 'shawarma',
      // No photo yet — empty string renders the branded "photo coming soon" tile.
      // Drop a shot at /images/menu-shawarma.jpg and put the path back here.
      image: '',
      imageAlt: 'Wrapped shawarma sandwich, cut to show the filling',
      status: 'UNCONFIRMED',
    },
    // Add new items here as the owner confirms the menu — components never change.
  ],
  process: [
    {
      n: 1,
      title: 'Shred',
      caption: 'Kataifi shreds hit the buttered pan.',
      image: { src: '/images/process-shred.jpg', alt: 'Kataifi shreds going into the pan' },
    },
    {
      n: 2,
      title: 'Sear',
      caption: 'Griddle heat toasts it deep orange.',
      image: { src: '/images/process-sear.jpg', alt: 'Kunafa pan searing on the griddle, ghee bubbling' },
    },
    {
      n: 3,
      title: 'Pull',
      caption: 'Molten cheese. The moment.',
      image: { src: '/images/process-pull.jpg', alt: 'Close-up of the kunafa cheese pull' },
    },
    {
      n: 4,
      title: 'Drench',
      caption: 'Syrup poured, pistachio crushed on top.',
      image: { src: '/images/process-drench.jpg', alt: 'Syrup pouring over kunafa with pistachio sprinkle' },
    },
  ],
  flags: {
    halal: 'UNCONFIRMED',
  },
};
