# The Kunafah Guy — Build Spec & Implementation Plan
**Single-page marketing site · Fresno, CA · v1.0 · 2026-07-24**

Prepared for handoff to implementer (Claude Code). This document contains specs, contracts, and tokens — **not** a finished codebase.

---

## 0. Design Thesis (read first)

The whole brand is one collision: **molten kunafa × smash burgers, one guy, one griddle.** Every layout, color, and motion decision should make that collision feel intentional and confident. If a section could belong to any generic Mediterranean restaurant template, it's wrong.

**Non-negotiables:**
- Mobile-first. 70%+ traffic arrives from an Instagram bio link on a phone. Design at 375px first, scale up.
- The $10 / $15 burger deal is the conversion engine. It appears twice (hero overlay + dedicated Deal block) and is never styled as a plain menu row.
- Phone-first CTAs. Every conversion path ends in `tel:` or `sms:` — no forms, no backend.
- Hours honestly vary. Never fabricate fixed hours; route to Instagram.
- Palestinian flag: thin accent stripes / small motifs only. Never a background, never wallpapered. It's identity, not decoration.
- Feel: hot, greasy, handmade. **Banned:** corporate gradients, glassmorphism, centered-sans-on-white minimalism, generic stock-food-template layouts.

---

## 1. File Tree

```
thekunafahguy/
├── index.html                      # Vite entry; meta/OG tags, font preloads
├── package.json
├── vite.config.ts                  # Vite + path alias "@/"; image plugin optional
├── tailwind.config.ts              # Full token spec — see §3
├── tsconfig.json
├── postcss.config.js
├── public/
│   ├── images/                     # Owner photos dropped here — see §6 Asset Manifest
│   │   └── .gitkeep                # Placeholder paths referenced until real assets land
│   ├── favicon.svg                 # Kunafa-pan mark (design per §3.6)
│   └── og-image.jpg                # 1200×630 social card — kunafa pull + deal text
├── src/
│   ├── main.tsx                    # React root mount
│   ├── App.tsx                     # Section composition in canonical order (§4)
│   ├── index.css                   # Tailwind directives + tiny global layer (fonts, selection color)
│   ├── content/
│   │   └── site.config.ts          # SINGLE SOURCE OF TRUTH — all text/data (§2)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Section.tsx         # Wrapper: id anchor, vertical rhythm, max-width
│   │   │   └── Container.tsx       # px/width constraints
│   │   ├── ui/
│   │   │   ├── CTAButton.tsx       # tel:/sms:/anchor variants, 56px min touch target
│   │   │   ├── SectionHeading.tsx  # Display face + optional Arabic accent word
│   │   │   ├── FlagStripe.tsx      # 4px Palestinian-flag accent rule (red/green/black/white)
│   │   │   ├── PriceTag.tsx        # Oversized price chip used in Deal + Menu
│   │   │   └── UnconfirmedBadge.tsx# Tiny "price TBC" pill, driven by item.status
│   │   └── sections/
│   │       ├── Hero.tsx            # §4.1
│   │       ├── DealBlock.tsx       # §4.2
│   │       ├── MenuSection.tsx     # §4.3
│   │       ├── KunafaProcess.tsx   # §4.4
│   │       ├── Catering.tsx        # §4.5
│   │       ├── FindUs.tsx          # §4.6
│   │       ├── SocialProof.tsx     # §4.7
│   │       └── Footer.tsx          # §4.8
│   ├── hooks/
│   │   ├── usePrefersReducedMotion.ts  # Motion gate for cheese-pull effects
│   │   └── useInView.ts                # IntersectionObserver for process steps
│   └── lib/
│       ├── sms.ts                  # buildSmsHref(): prefilled catering SMS deep link
│       └── motion.ts               # Framer-free CSS transition presets (or framer-motion if chosen)
└── README.md                       # How to update site.config.ts + drop in photos
```

**Notes for implementer:**
- Keep dependencies minimal: react, react-dom, tailwindcss, vite, typescript. Optional: `framer-motion` for the process section + cheese-pull (justify before adding). Everything else should be hand-rolled.
- No router, no state library. One page, top-down composition.
- `site.config.ts` is the **only** file the owner ever edits. Components must contain zero hardcoded business data.

---

## 2. `site.config.ts` — Full Schema

Every user-visible string, price, and link lives here. TypeScript enforces shape; `status: 'UNCONFIRMED'` renders a visible "price TBC" badge via `UnconfirmedBadge`.

```ts
// src/content/site.config.ts

export type ItemStatus = 'CONFIRMED' | 'UNCONFIRMED';

export interface MenuItem {
  id: string;
  name: string;
  arabicName?: string;            // e.g. 'كنافة' — rendered RTL
  description: string;
  price: number | null;           // null → price hidden, badge shown
  priceLabel?: string;            // override e.g. "2 for $10"
  unit?: string;                  // e.g. 'each', 'tray', 'per person'
  category: 'kunafa' | 'burgers' | 'shawarma';
  image: string;                  // path under /images/ — see Asset Manifest
  imageAlt: string;               # REQUIRED — real alt text, not filename
  status: ItemStatus;
  featured?: boolean;             // drives card emphasis
}

export interface BurgerDeal {
  id: string;
  label: string;                  // "2 Smash Burgers"
  price: number;
  status: ItemStatus;
  note?: string;
}

export interface SiteConfig {
  business: {
    name: string;
    nameArabic: string;           // graphic accent: 'كنافة'
    taglinePrimary: string;
    taglineSecondary: string;
    ownerName: string;
    heritageLine: string;         // one-liner re: Palestinian kunafa craft
  };
  contact: {
    phoneDisplay: string;
    phoneHref: string;            // tel:+12097126676
    smsHrefBase: string;          // sms:+12097126676
  };
  location: {
    addressLine: string;
    mapsEmbedUrl: string;         // Google Maps embed src — OPEN QUESTION: confirm pin
    mapsDirectionsUrl: string;
    landmarkNote: string;         // "shared food-court lot next to Lifestyle Furniture"
  };
  hours: {
    mode: 'variable';             // never fixed — honest by design
    calloutTitle: string;
    calloutBody: string;          // "Hours change daily — check Instagram"
    instagramUrl: string;
  };
  social: {
    instagram: { handle: string; url: string; followers: string };
    facebook:  { handle: string; url: string; followers: string };
  };
  reviews: {
    rating: number;               // 4.5
    count: number;                // 46
    source: string;               // 'Google' — confirm platform (OPEN QUESTION)
    sourceUrl: string | null;
  };
  claims: {
    votedBest: string;            // "Voted #1 Kunafa in all of California"
    votedBestVerified: boolean;   // false until source confirmed (OPEN QUESTION)
  };
  catering: {
    headline: string;
    serviceArea: string;          // "All of California"
    smsBodyTemplate: string;      // encoded by lib/sms.ts — see §4.5
    fields: string[];             // ['name','date','city','headcount']
  };
  deals: BurgerDeal[];
  menu: MenuItem[];
  flags: {
    halal: ItemStatus;            // show halal note in footer only if CONFIRMED
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
    mapsEmbedUrl: '',                                   // UNCONFIRMED — exact pin
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
      followers: '3.5K',                               // UNCONFIRMED snapshot — verify at launch
    },
    facebook: {
      handle: 'the_kunafa_guy',
      url: 'https://www.facebook.com/the_kunafa_guy', // UNCONFIRMED — exact URL slug
      followers: '570',                                // UNCONFIRMED snapshot
    },
  },
  reviews: {
    rating: 4.5,
    count: 46,
    source: 'Google',                                  // UNCONFIRMED — which platform?
    sourceUrl: null,
  },
  claims: {
    votedBest: 'Voted #1 Kunafa in all of California',
    votedBestVerified: false,                          // must be true before launch
  },
  catering: {
    headline: 'We roll to you — anywhere in California.',
    serviceArea: 'All of California',
    smsBodyTemplate:
      'Hi! Catering inquiry — Name: {name} | Date: {date} | City: {city} | Guests: {headcount}',
    fields: ['name', 'date', 'city', 'headcount'],
  },
  deals: [
    { id: 'deal-2-single', label: '2 Smash Burgers',        price: 10, status: 'UNCONFIRMED' },
    { id: 'deal-2-double', label: '2 Double Smash Burgers', price: 15, status: 'UNCONFIRMED' },
  ],
  menu: [
    {
      id: 'kunafa-classic',
      name: 'Fresh Kunafa',
      arabicName: 'كنافة',
      description: 'Shredded kataifi, molten cheese, syrup, crushed pistachio — made to order.',
      price: null,                                     // UNCONFIRMED
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
      price: null,                                     // UNCONFIRMED — deal price known, single price not
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
      description: '',                                 // UNCONFIRMED — get owner's words
      price: null,
      category: 'shawarma',
      image: '/images/menu-shawarma.jpg',
      imageAlt: 'Wrapped shawarma sandwich, cut to show the filling',
      status: 'UNCONFIRMED',
    },
    // Additional items appended here as owner confirms menu — components never change.
  ],
  flags: {
    halal: 'UNCONFIRMED',
  },
};
```

**Rules:**
- Any `UNCONFIRMED` item still renders (menu must look complete), but carries the badge and hides price if `price: null`.
- `claims.votedBestVerified === false` renders the claim styled as a *quote from the owner* ("— I'm the Kunafa Guy") rather than an objective fact badge. Flip to `true` once source is confirmed.
- Follower counts are display strings, not fetched live. Note in README that they're manual snapshots.

---

## 3. Tailwind Design Tokens

### 3.1 Color scale (derived from the food)

```ts
// tailwind.config.ts — theme.extend.colors
colors: {
  kunafa: {   // hero orange — kataifi + syrup caramelization
    50:  '#FDF3E7',
    100: '#FAE3C8',
    200: '#F4C48F',
    300: '#ECA258',
    400: '#E28A3C',
    500: '#D97A2B',   // brand primary — CTAs, deal price, accents
    600: '#B8631D',
    700: '#934E18',
    800: '#6E3A13',
    900: '#4A2710',
  },
  pistachio: { // crushed pistachio green
    50:  '#F4F6EC',
    100: '#E6EBD3',
    200: '#CBD6A6',
    300: '#AABD74',
    400: '#8CA353',
    500: '#6F8439',   // secondary accent — garnish, badges, success
    600: '#586A2D',
    700: '#455324',
    800: '#333D1B',
    900: '#222813',
  },
  syrup: {    // deep amber — heat, syrup drizzle
    400: '#DDAF45',
    500: '#C9922E',
    600: '#A97622',
  },
  griddle: {  // charcoal griddle black — text, dark sections
    700: '#37312B',
    800: '#26221E',
    900: '#1B1815',   // page dark bg
    950: '#12100E',
  },
  cream: {    // warm off-white — primary light bg (NOT pure white)
    50:  '#FBF6EC',
    100: '#F6EDDC',
    200: '#EDDFC4',
  },
  flag: {     // Palestinian flag — accent use ONLY, never fills
    red:   '#CE1126',
    green: '#007A3D',
    black: '#000000',
    white: '#FFFFFF',
  },
}
```

**Usage law:**
- Light sections: `bg-cream-50`, text `griddle-900`. Dark sections (Hero, Deal): `bg-griddle-900`, text `cream-50`.
- `kunafa-500` = primary CTA + price emphasis. `pistachio-500` = garnish/badge accent. `syrup` = hover states + drizzle graphics.
- `flag.*` only via `FlagStripe` component and tiny icon accents. **Contrast check:** on dark bg use flag-white stripe; on light, flag-black.
- All text/background pairs must pass 4.5:1 (verify: kunafa-500 on griddle-900 ✓ ≈ 5.2:1; griddle-900 on cream-50 ✓ ≈ 13:1; pistachio-300 on griddle-900 ✓; never kunafa-300 on cream-50 for body text).

### 3.2 Typography

```ts
fontFamily: {
  display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
  //    ^ weight 800, tight tracking. Diner-signage weight with geometric personality.
  body:    ['Inter', 'system-ui', 'sans-serif'],
  arabic:  ['"Aref Ruqaa"', '"Amiri"', 'serif'],
  //    ^ graphic accent only (كنافة), dir="rtl", lang="ar", NOT for paragraphs
},
fontSize: {
  'deal': ['clamp(3.5rem, 14vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
  //    ^ the $10/$15 number — biggest thing on the page after hero headline
},
```

- Load via Google Fonts with `font-display: swap`, preloaded in `index.html`. Subset Arabic font to the glyphs needed if possible.
- Scale: h1 `clamp(2.5rem, 9vw, 5rem)` display/800; section h2 `clamp(2rem, 6vw, 3.5rem)`; body 1rem/1.6; small 0.875rem.
- Alternate display-face candidates if Bricolage feels wrong in situ: `"Titan One"` (more diner), `"Zain"` (Arabic-designed Latin, stronger heritage tie). Pick one; do not ship two.

### 3.3 Spacing / radius / shadow tokens

```ts
spacing: {
  'section-y': 'clamp(4rem, 10vw, 7rem)',  // vertical rhythm between sections
  'gutter':    'clamp(1.25rem, 5vw, 3rem)',
},
borderRadius: {
  'card': '1rem',        // menu cards — soft, handmade
  'chip': '999px',
},
boxShadow: {
  'griddle': '0 8px 0 0 #12100E',                    // hard offset — signage feel, no blur
  'griddle-sm': '0 4px 0 0 #12100E',
  'lift': '0 12px 32px -8px rgba(27, 24, 21, 0.35)', // photos only
},
```

**Shadow law:** hard offset shadows (`shadow-griddle`) on CTAs, deal block, price chips — this is the diner-signage voice. Soft shadows only on food photography. Never both on one element.

### 3.4 Texture & graphic elements

- **Heat/grain:** subtle SVG noise overlay (opacity 0.04, `mix-blend-overlay`) on dark sections. One 128×128 tile, inline data-URI — zero network cost.
- **Drizzle divider:** hand-drawn syrup zigzag SVG between Hero → Deal and Menu → Process. `stroke: syrup-500`, `stroke-width: 6`, rounded caps.
- **FlagStripe:** 4 stacked 4px bars (black/white/green with red triangle or simple 4-band), used under section headings max-width 64px. Componentized so the accent rule is enforced in one place.
- **Arabic accent:** large outlined/ghost `كنافة` (`arabic` font, `text-transparent` + `[-webkit-text-stroke:1px_theme(colors.kunafa.500)]`, ~8% opacity fill option) as a background graphic in Hero and Process. Always `dir="rtl"`, decorative → `aria-hidden="true"`.

### 3.5 Motion tokens

```ts
transitionTimingFunction: {
  'griddle': 'cubic-bezier(0.22, 1, 0.36, 1)',  // snappy ease-out
},
// Duration law: 200ms UI, 400ms section reveals, 600ms cheese-pull max.
```

- **Cheese-pull motif (primary):** on the hero image and kunafa menu card, a `::after` "stretch" line/gradient that elongates on hover (desktop) or when scrolled into view (mobile) — CSS transform `scaleY`, `transform-origin: top`. Subtle. It should read as a pull, not a slime effect.
- **Process section:** steps reveal sequentially via `useInView` + stagger 120ms.
- **`prefers-reduced-motion`:** `usePrefersReducedMotion()` gate on ALL of the above. Reduced → instant opacity swaps only, zero transforms. Also a global CSS fallback: `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`.

### 3.6 Favicon / OG

- Favicon: top-down kunafa pan circle — `kunafa-500` disc, `pistachio-500` sprinkle dots, on `griddle-900`. Simple, readable at 16px.
- `og-image.jpg` (1200×630): left = cheese-pull photo; right = "$10 / 2 SMASH BURGERS" in display face on griddle-900 + FlagStripe. This is what Instagram/WhatsApp link previews show — it sells the deal before the click.

---

## 4. Component Contracts

Shared primitives first; every section component receives its data sliced from `site.config.ts` — no section imports the whole config except `App.tsx` which passes props down.

```tsx
// --- ui/CTAButton.tsx ---
interface CTAButtonProps {
  label: string;
  href: string;                       // tel: | sms: | #anchor | external
  variant: 'primary' | 'ghost';       // primary: kunafa-500 + shadow-griddle
  icon?: 'phone' | 'calendar' | 'arrow';
  external?: boolean;                 // adds rel="noopener" target="_blank"
  className?: string;
}
// Contract: min-h-[56px], min-w-[56px] touch target, focus-visible ring pistachio-300,
// active:translate-y + shadow-griddle-sm (physical press feel), aria-label when icon-only.

// --- ui/SectionHeading.tsx ---
interface SectionHeadingProps {
  eyebrow?: string;                   // small caps, pistachio-500 on dark
  title: string;                      // display face
  arabicAccent?: string;              // renders ghost word behind title
  align?: 'left' | 'center';          // default left — NOT center-by-default
  showFlagStripe?: boolean;           // default true
}

// --- ui/PriceTag.tsx ---
interface PriceTagProps {
  price: number | null;
  label?: string;
  status: ItemStatus;                 // UNCONFIRMED → renders UnconfirmedBadge sibling
  size?: 'md' | 'hero';               // hero → text-deal scale (Deal block only)
}

// --- ui/FlagStripe.tsx ---
interface FlagStripeProps { width?: number; className?: string }
// Pure presentational, aria-hidden, the ONLY component allowed to use flag.* colors.

// --- ui/UnconfirmedBadge.tsx ---
interface UnconfirmedBadgeProps { text?: string }  // default "price TBC"
// Tiny chip: pistachio-100 bg / pistachio-800 text on light; inverse on dark.

// --- layout/Section.tsx ---
interface SectionProps {
  id: string;                         // anchor target
  tone: 'light' | 'dark';             // cream-50 | griddle-900
  children: React.ReactNode;
  className?: string;
}
// Contract: renders <section aria-labelledby>, py-section-y, Container inside.
```

### Section components

```tsx
// §4.1 Hero.tsx
interface HeroProps {
  business: SiteConfig['business'];
  contact: SiteConfig['contact'];
  deals: BurgerDeal[];                // overlay shows cheapest: "2 Smash Burgers — $10"
  heroImage: { src: string; alt: string };   // from asset manifest slot H1
}

// §4.2 DealBlock.tsx
interface DealBlockProps {
  deals: BurgerDeal[];                // both, rendered as giant graphic pair
  contact: SiteConfig['contact'];
}

// §4.3 MenuSection.tsx
interface MenuSectionProps {
  items: MenuItem[];                  // component groups by category in fixed order:
}                                     // kunafa → burgers → shawarma

// §4.4 KunafaProcess.tsx
interface KunafaProcessProps {
  steps: ProcessStep[];               // exactly 4 — see build card 4.4
}
interface ProcessStep {
  n: 1 | 2 | 3 | 4;
  title: string;                      // 'Shred' | 'Sear' | 'Pull' | 'Drench'
  caption: string;
  image: { src: string; alt: string };
}

// §4.5 Catering.tsx
interface CateringProps {
  catering: SiteConfig['catering'];
  contact: SiteConfig['contact'];
}
// Internally: 4 lightweight inputs (name/date/city/headcount) → on submit builds
// sms: deep link via lib/sms.ts and navigates. No POST, no state beyond inputs.

// §4.6 FindUs.tsx
interface FindUsProps {
  location: SiteConfig['location'];
  hours: SiteConfig['hours'];
  contact: SiteConfig['contact'];
}

// §4.7 SocialProof.tsx
interface SocialProofProps {
  social: SiteConfig['social'];
  reviews: SiteConfig['reviews'];
  claims: SiteConfig['claims'];       // votedBestVerified gates badge vs quote styling
}

// §4.8 Footer.tsx
interface FooterProps {
  business: SiteConfig['business'];
  contact: SiteConfig['contact'];
  location: SiteConfig['location'];
  social: SiteConfig['social'];
  halalConfirmed: boolean;            // from flags.halal
}
```

---

## 5. Per-Section Build Cards

Each card is independently executable. Do them in order for visual momentum, but no card depends on another's internals.

### Card 4.1 — Hero
**Goal:** Full-bleed, thumb-stopping, converts in one glance.
- Full-viewport (`min-h-[100svh]` — use `svh`, not `vh`, for mobile Safari chrome) dark section.
- Background: hero kunafa cheese-pull photo (slot H1), `object-cover`, gradient scrim `griddle-950/70 → transparent` bottom-up for text contrast (4.5:1 verified).
- Content stack (left-aligned, bottom-third on mobile): ghost `كنافة` behind; h1 = `taglinePrimary` ("I'm the Kunafa Guy."); sub = `taglineSecondary`; deal strip chip: "2 Smash Burgers — **$10**" (PriceTag `hero`-adjacent sizing, kunafa-500).
- Two CTAs side-by-side on ≥480px, stacked full-width below: primary "Call / Text to Order" (`phoneHref`, phone icon), ghost "Book Us for Your Event" (anchor `#catering`).
- FlagStripe under h1. Scroll-cue chevron (respects reduced motion).
- **Acceptance:** readable at 375px with zero horizontal scroll; both CTAs reachable without scrolling past 100svh; h1 is a real `<h1>`; scrim guarantees 4.5:1 over any reasonable photo; `fetchpriority="high"` + `loading="eager"` on hero img; LCP element is the image.

### Card 4.2 — DealBlock
**Goal:** The conversion driver. A graphic monument to $10/$15, not a menu row.
- Dark section immediately after hero, separated by drizzle divider.
- Layout: two deal panels side-by-side (stacked on mobile), each = label in display face + price at `text-deal` scale + `kunafa-500` hard-shadow plate (`shadow-griddle`). UNCONFIRMED badge per config.
- Copy hook line above, e.g. "Two things that shouldn't share a griddle. Both are perfect." (final copy in config — OPEN QUESTION: owner voice approval).
- One CTA below both: "Call / Text to Order" → `phoneHref`.
- Optional: pistachio "most ordered" skewed chip on the $10 panel.
- **Acceptance:** prices are the largest text on the page outside the hero h1; panel tap anywhere = tel link on mobile; no prices hardcoded — from `site.deals`; badge renders iff `status==='UNCONFIRMED'`.

### Card 4.3 — MenuSection
**Goal:** Photo-forward, kunafa first, prices swappable from config.
- Light section (`cream-50`). SectionHeading "The Menu" + arabicAccent `كنافة`.
- Category order enforced by component, not data order: kunafa → burgers → shawarma. Small category subheads in display face.
- Cards: image top (aspect 4:3, `loading="lazy"`, `shadow-lift`, rounded-card), name + optional `arabicName` (rtl, arabic font, kunafa-600), description (body/sm, griddle-700), footer row = PriceTag + UnconfirmedBadge.
- Featured item (kunafa) spans 2 cols on ≥md.
- **Acceptance:** adding/removing an item in config requires zero component changes; `price:null` hides price gracefully; every image has real alt text; card grid is 1-col mobile / 2-col sm / 3-col lg.

### Card 4.4 — KunafaProcess
**Goal:** 4-step visual ritual. This section sells "made to order."
- Dark section. Steps (fixed copy, may live in config or component constants — copy is brand voice, candidate for config): **1 Shred** (kataifi into the pan) → **2 Sear** (griddle heat, ghee) → **3 Pull** (the cheese moment) → **4 Drench** (syrup + crushed pistachio).
- Mobile: vertical timeline, images aspect 1:1, reveal on `useInView` stagger 120ms. Desktop: horizontal 4-track with connecting drizzle line that draws via stroke-dashoffset as steps enter view (reduced-motion: fully drawn).
- Number badges in display face, kunafa-500; captions ≤12 words.
- **Acceptance:** exactly 4 steps from data; each step announces to screen readers as list items (`<ol>`); all images lazy; stagger disabled under reduced motion; section completes render with images missing (graceful placeholder bg griddle-800 + alt text visible pattern).

### Card 4.5 — Catering
**Goal:** 15-second inquiry → SMS handoff. Zero backend.
- Light section. Headline from `catering.headline` + "Serves all of California" chip (pistachio).
- Four labeled inputs: Name (text), Date (date), City (text), Headcount (number, min 1). All optional-but-encouraged — SMS builds with blanks as "—".
- Submit button "Text Us the Details" → `lib/sms.ts` builds `sms:+12097126676?&body=...` (iOS uses `?&body=`, Android `?body=` — use `?&body=` which works on both per current behavior; add code comment). `encodeURIComponent` the template with substitutions. `window.location.href = href`.
- Fallback link under button: "or just call (209) 712-6676".
- **Acceptance:** no network requests; works fully offline after load; inputs have real `<label>`s; body text correctly encoded with line breaks as `%0A`; button is `type="button"` (no form submit/page reload).

### Card 4.6 — FindUs
**Goal:** Get a hungry person to the lot today.
- Light section, two-col on desktop: left = address block; right = map embed (`loading="lazy"`, `title="Map to The Kunafah Guy"`, aspect 4:3 mobile / full-height desktop).
- Address block: addressLine (display/sm), landmarkNote ("next to Lifestyle Furniture" — genuinely useful), "Get Directions" ghost CTA → `mapsDirectionsUrl` (external).
- **Hours callout (the honest box):** bordered card, `border-2 border-kunafa-500`, display-face "Hours vary daily", body from config, big "Check Instagram" primary CTA → `instagramUrl` external. This callout must be visually louder than the map.
- **Acceptance:** no fake hours anywhere on page (grep for "Mon"/"9am" etc. returns nothing); map iframe lazy; callout passes contrast on cream bg.

### Card 4.7 — SocialProof
**Goal:** Borrowed credibility, honest sourcing.
- Dark section, 3-stat row (stack mobile): IG followers (3.5K) / rating (4.5★ over 46 reviews) / FB followers (570). Numbers in display face kunafa-400; labels body/sm; each links to its source URL.
- Claim treatment: if `votedBestVerified` → badge style ("#1 Kunafa in California" pistachio seal); else → styled as owner quote with attribution, per §2 rules.
- Star row: 4.5 rendered as 5 SVG stars with half-fill (inline SVG, pistachio-400 or syrup-400 fill).
- **Acceptance:** counts come from config strings (no live fetch, no fake "live" counter); claim rendering switches correctly on the boolean; links external + noopener.

### Card 4.8 — Footer
**Goal:** Close the loop; every contact path one more time.
- griddle-950 bg. Top row: name in display face + ghost كنافة; phone (tel link, large, kunafa-400), address, both socials with inline SVG icons (no icon library).
- FlagStripe centered above copyright line. Halal line rendered **only** if `flags.halal === 'CONFIRMED'`.
- Bottom: `© {year} The Kunafah Guy · Fresno, CA` — year via `new Date().getFullYear()`.
- **Acceptance:** semantic `<footer>`; all links keyboard-focusable with visible focus ring; no placeholder `#` links; halal note absent until confirmed.

---

## 6. Asset Manifest

Owner supplies photos; until then use colored placeholders at these exact paths so layout is testable. Naming is contractual — components reference these paths via config/manifest constants.

| Slot | Path (under `public/`) | Aspect | Min px | What the photo shows |
|---|---|---|---|---|
| H1 | `images/hero-kunafa-pull.jpg` | 3:4 (crop-safe center) | 1600×2133 | **The shot.** Kunafa lifted from pan, cheese stretching, syrup sheen, steam if possible. Vertical — it's a mobile hero. |
| D1 | `images/deal-burgers.jpg` (optional bg) | 16:9 | 1920×1080 | Two smash burgers on griddle, lacy edges visible, spatula pressing. Used only if it beats flat color in review. |
| M1 | `images/menu-kunafa-classic.jpg` | 4:3 | 1200×900 | Plated kunafa, pistachio crust glistening, 45° angle. |
| M2 | `images/menu-burger-smash.jpg` | 4:3 | 1200×900 | Single smash burger, crust edge macro-forward. |
| M3 | `images/menu-burger-double.jpg` | 4:3 | 1200×900 | Double stack, cheese melt mid-drip. |
| M4 | `images/menu-shawarma.jpg` | 4:3 | 1200×900 | Wrapped shawarma cut open showing filling. |
| P1 | `images/process-shred.jpg` | 1:1 | 900×900 | Kataifi shreds going into pan, hands in frame. |
| P2 | `images/process-sear.jpg` | 1:1 | 900×900 | Pan on griddle, ghee bubbling at edges. |
| P3 | `images/process-pull.jpg` | 1:1 | 900×900 | The cheese pull, close. (Can be alt crop of H1.) |
| P4 | `images/process-drench.jpg` | 1:1 | 900×900 | Syrup pour + pistachio sprinkle mid-air. |
| OG | `og-image.jpg` | 1200×630 fixed | exact | Composited: P3-crop left, deal text right (built in code or Canva — see §3.6). |

**Asset rules:**
- Format: JPG quality ~80 (or WebP/AVIF with JPG fallback if implementer adds `<picture>`). No PNG photos.
- Every below-fold image: `loading="lazy"` + explicit `width`/`height` (or aspect-ratio CSS) to kill CLS.
- Target weights: H1 ≤ 250KB, menu/process ≤ 120KB each. Total initial page payload (HTML+CSS+JS+fonts+hero) ≤ 500KB.
- Owner photo brief (send to him): shoot vertical for hero, natural light, hands and steam good, no filters that fake the orange.

---

## 7. OPEN QUESTIONS (blockers before launch)

**Menu & pricing (hard blockers):**
1. Full menu list — what else exists beyond kunafa / burgers / shawarma? (sizes? trays? drinks? fries?)
2. Confirm $10 / $15 deal pricing is current, and single-item prices for everything else.
3. Kunafa variations — cheese only, or cream/pistachio variants? Tray/catering sizes and pricing?
4. Shawarma description in the owner's own words + chicken/beef/both?

**Claims & compliance:**
5. "Voted #1 Kunafa in all of California" — voted by whom, when? Source link? (Determines badge vs. quote styling; shipping it as fact without a source is a liability.)
6. Halal — confirmed? Certified by anyone, or self-described? Exact wording he wants.
7. Review stats — 4.5/46 from which platform (Google? Yelp?) + profile URL for the link.
8. Allergen/dietary notes worth stating? (kunafa contains dairy/gluten — does he want this said?)

**Ops:**
9. Google Maps embed — exact pin: is the business listed, or embed the address/lot coordinates? Business name on Maps?
10. Catering logistics — minimum headcount? Travel radius limits within CA? Lead time? Deposit? (Currently the SMS asks only name/date/city/headcount — add fields only if he wants them.)
11. Follower counts — re-verify IG (~3.5K) / FB (~570) the week of launch; confirm FB page URL slug.
12. Ordering flow reality-check: is call/text really the only order channel? Any walk-up-only constraints, pre-order lead times for kunafa?

**Brand & assets:**
13. Photos — who shoots? Timeline? (Site ships with placeholders only after owner sees them.)
14. Logo — does one exist, or is the wordmark (display face) the logo for now?
15. Arabic copy — owner sign-off on كنافة usage and any other Arabic words added later.
16. Domain — what URL is this deploying to? (Needed for canonical + OG URLs.)
17. Flag accent — confirm he's happy with the thin-stripe treatment (show him a mock before build finalizes).

---

## 8. Definition of Done (whole site)

- [ ] All 8 sections render from `site.config.ts` with zero hardcoded business data in components
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] Every CTA is tel:/sms:/anchor/external — no dead ends, no backend calls
- [ ] `prefers-reduced-motion` verified in DevTools emulation: zero transforms remain
- [ ] 375px and 390px clean; no horizontal overflow at any width 320–1440
- [ ] All UNCONFIRMED items badge correctly; flipping config flags changes UI without code edits
- [ ] All 7 OPEN QUESTION categories either resolved or explicitly accepted-by-owner as placeholder
- [ ] `README.md` shows the owner exactly how to change a price, add a menu item, and swap a photo
