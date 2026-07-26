# The Kunafah Guy — project context

Single-page marketing site for a **real Fresno, CA food business**. Owner/chef is
Arafat Halloum; he sells fresh kunafa *and* smash burgers off one griddle, and the
whole design leans into that collision rather than apologising for it.

Because it's a real business, two things matter more than usual: **never invent
business facts** (prices, hours, awards, halal status), and **never ship a claim
without a source**. The site is deliberately built to show "price TBC" badges and
an honest "hours vary" callout instead of plausible-looking placeholders.

Stack: React 18 + Vite + TypeScript + Tailwind. Fully static, no backend, no router,
no state library. Deploys to any static host.

## Commands

```bash
npm run dev      # http://localhost:5173
npm run build    # tsc --noEmit && vite build -> dist/
npm run preview
```

Repo: https://github.com/shousha401/kunafa-guy (branch `main`)

## The one architectural rule

**All business data lives in `src/content/site.config.ts`.** Components contain zero
hardcoded prices, phone numbers, addresses or copy — `App.tsx` reads the config and
passes slices down as props. The owner should be able to change a price, add a menu
item or swap a photo without touching a component. If you find yourself typing a
price into JSX, stop.

Every menu item and deal carries `status: 'CONFIRMED' | 'UNCONFIRMED'`. Anything
UNCONFIRMED still renders (the menu must look complete) but shows a "price TBC" pill
and hides the price when `price: null`.

## Layout

```
src/
  content/site.config.ts     SINGLE SOURCE OF TRUTH — the only file the owner edits
  App.tsx                    section composition, top-down
  components/
    layout/                  Section (tone light|dark, anchor, rhythm), Container
    ui/                      CTAButton, SectionHeading, PriceTag, UnconfirmedBadge,
                             FlagStripe, DrizzleDivider, Icons (hand-rolled SVG)
    sections/                Hero, DealBlock, MenuSection, KunafaProcess,
                             Catering, FindUs, SocialProof, Footer
  hooks/                     usePrefersReducedMotion, useInView
  lib/                       sms.ts (sms: deep link builder), motion.ts (reveal preset)
scripts/process-photos.ps1   crops + compresses source photos into every image slot
kunafah-guy-build-spec.md    original build spec — asset manifest + OPEN QUESTIONS
```

## Conventions that are load-bearing

- **Phone-first.** Every conversion path ends in `tel:` or `sms:`. No forms that POST,
  no backend. The catering "form" builds a prefilled SMS deep link via `lib/sms.ts`
  and navigates to it (`?&body=` works on both iOS and Android).
- **No fake hours, ever.** His hours genuinely change daily. `FindUs` routes people to
  Instagram; that callout is intentionally louder than the map. Don't add a hours table.
- **Palestinian flag = heritage, not decoration.** `FlagStripe` is the only component
  allowed to use `flag.*` colours. Thin accent only — never a background or fill.
- **Mobile-first.** Assume 70%+ of traffic is a phone arriving from the Instagram bio
  link. Design at 375px, scale up.
- **Motion is gated.** All JS-driven motion checks `usePrefersReducedMotion()`, plus a
  global CSS reduced-motion fallback in `index.css`.
- **Accessibility is not optional here:** real landmarks, alt text on every food photo,
  4.5:1 contrast minimum, 56px touch targets on CTAs.

## Current status

Built and working: all 8 sections, config-driven, builds clean, no horizontal overflow
at 320–1440px, one `<h1>`, alt text on every image.

**Menu is real.** On 2026-07-25 the owner sent photos of his own truck. The menu
board in them is legible, so every price in `site.config.ts` is now transcribed
from it and marked `CONFIRMED` — no "price TBC" badges render any more:

| | |
|---|---|
| Kunafah $7 · Trays S $25 / M $45 / L $65 | Smash Burger $8 · Double Burger $10 |
| Chicken Sandwich $7 · Wings $8 · Wings w/ Fries $11 | Large Fries $5 · Add Fries and Drink $5 |

Deals confirmed off his pull-up banners: 2 for $10 (single), 2 for $15 (double).
Halal is `CONFIRMED` — his banner reads "100% BEEF HALAL", so it's *self-described
by the owner*, not third-party certified. Word it that way.

**Photos.** `photos-source/` holds the owner's four originals (kept in-repo so the
pipeline is reproducible); `scripts/process-photos.ps1` crops them into every slot.
This replaced the earlier stock-looking kunafa shot, so **the licensing risk is gone.**
Consequences to remember:

- `kunafah-tray-pull.jpg` carries most slots — it's much sharper than `kunafah-macro.jpg`,
  which is a soft, oversaturated video grab. Prefer the tray one.
- The four process steps are still four macro crops of one finished tray, not actual
  shred/sear/pull/drench stages. Alt text says what each crop really shows.
- Burgers still use the old 236×314 thumbnail — **the one real gap.** Both burger cards
  show the same double-patty photo; there is no single-patty shot.
- Chicken and Sides have no photos, so `MenuSection` renders those categories as a
  clean price list instead of a wall of placeholder tiles (see `hasPhotos` there).
  Add a photo to any item in a category and it switches to photo cards.

## Launch blockers

Full list is §7 OPEN QUESTIONS in `kunafah-guy-build-spec.md`. His 2026-07-25 photos
resolved menu/prices, halal, photo licensing and the deal pricing. What's left:

1. **"Voted #1 Kunafah in all of California"** — voted by whom? Until
   `claims.votedBestVerified` is `true` *with a source*, it renders as an owner quote,
   not a fact badge. Shipping it as fact without a source is a liability.
2. **Review stats (4.5 / 46)** — which platform, and the profile URL.
3. **Domain**, for canonical and OG URLs (currently relative, which works on any host).
4. **A real burger photo** — see Photos above.
5. **Facebook handle** — config has `the_kunafa_guy` (no h). Unverified; don't "fix"
   the spelling, it's a real account slug and changing it would break the link.

Two open questions from the truck photos, **not resolved — ask the owner, don't guess**:

- **Shawarma is gone from his board.** It listed Chicken Sandwich instead, so the config
  now matches the board. Confirm he really dropped shawarma.
- **The truck carries a sign reading "LOCATED AT 208 LORAIN ROAD, NORTH OLMSTED"** —
  that's Ohio. The photo is plainly at the Fresno lot (LifeStyle Furniture is in frame)
  and his banner says 21 E Shaw Ave, so it's probably a leftover from the trailer's
  previous life. **The address was left untouched.**

## Environment gotchas already hit

Windows 11, PowerShell 5.1. These cost time once; don't rediscover them.

- **React 18 needs lowercase `fetchpriority`.** The camelCase `fetchPriority` prop warns
  in the console. `Hero.tsx` spreads it as a lowercase attribute; React 19 would accept
  the camelCase form.
- **`FlagStripe` slices need `backgroundRepeat: 'no-repeat'`.** Without it the flag SVG
  tiles inside each animated slice and the red triangle bleeds in on the right edge.
- **The in-app Browser pane doesn't composite when hidden.** Screenshots time out, and
  lazily-loaded images report `naturalWidth === 0` as if broken. Neither is a real bug.
  To verify images, either force `loading='eager'` via JS or `fetch()` them directly.
- **Vite's dev server returns 200 for missing static files** (SPA fallback serves
  index.html). A `HEAD` request succeeding does *not* prove a file exists — check disk.
- **PowerShell here-strings break inside `if { }` blocks.** Multi-line git commit
  messages fail with "pathspec ... did not match". Write the message to a file and use
  `git commit -F <file>`.
- **Don't upscale small photos and then crush JPEG quality to hit a weight budget.**
  Kataifi texture is JPEG-hostile; a smaller high-quality image beats a large mushy one.
  `scripts/process-photos.ps1` documents the sizes that worked.
