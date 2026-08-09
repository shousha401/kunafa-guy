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

**Menu is real, and it changed on 2026-08-08.** The owner sent photos of a *new*
board in the truck's service window. It replaces the 2026-07-25 board entirely —
most prices moved, so **never merge the two boards**; the 08-08 one wins. Every
price below is transcribed from it and marked `CONFIRMED`:

| | |
|---|---|
| Fresh Kunafah Slice $8 | Smash Burger $7 · Double $10 · Triple $12 |
| Chicken Sandwich $6 · Wings BBQ $8 · Wings Buffalo $8 | Fries S $3 / L $5 · Loaded Burger Fries $12 |
| Mozzarella Sticks $6 · Zucchini Sticks $6 | Soda $2 · Water (price obscured on board) |

What moved vs. the July board: kunafah 7→8, smash burger 8→7, chicken sandwich
7→6. Wings split into BBQ and Buffalo. Gone from the board entirely: kunafah tray
pricing, Wings w/ Fries $11, Add Fries and Drink $5 — the last two were dropped
from the config, trays were kept but downgraded (see blocker 7).

Two `price TBC` badges render again as a result: **Kunafah Tray** and **Water**.

Deals confirmed off his pull-up banners: 2 for $10 (single), 2 for $15 (double).
The 2026-08-08 photos re-confirm the double deal — a hand-lettered sign on the
truck reads "2 Double Smash Burgers Only $15. 100% Beef Halal". The single-burger
2-for-$10 sign is not in that set, but nothing contradicts it either.
Halal is `CONFIRMED` — his banner reads "100% BEEF HALAL", so it's *self-described
by the owner*, not third-party certified. Word it that way.

**Photos.** `photos-source/` holds the owner's own originals (kept in-repo so the
pipeline is reproducible) — the five 2026-07-25 photos the image slots are built from,
plus the four 2026-08-08 `WhatsApp Image …` files, which are *documentation of the new
menu board*, not image sources: nothing is cropped from them.
`scripts/process-photos.ps1` crops the July set into every slot.
This replaced the earlier stock-looking kunafa shot, so **the licensing risk is gone
for the hero, menu, Find Us and deal-banner slots.**

- `kunafah-tray-pull.jpg` carries most slots — it's much sharper than `kunafah-macro.jpg`,
  which is a soft, oversaturated video grab. Prefer the tray one.
- **The four "How the Kunafah Happens" process photos are the exception.** On 2026-08-01
  the owner asked to swap them back to the pre-truck-photo set (restored from git history,
  commit `bb37d65`), because he didn't like the truck-photo crops for that section. This
  **reopens the unresolved licensing question** on that photo — it predates the owner's
  confirmed photos and its source was never verified. `scripts/process-photos.ps1` has the
  four `process-*` lines commented out so a routine re-run won't silently overwrite them.
  Still four macro crops of one baked tray, not actual shred/sear/pull/drench stages —
  alt text says what each crop really shows. Get the licensing question resolved (or a
  real replacement photo) before treating this as launch-ready.
- Burgers still use the old 236×314 thumbnail — **the one real gap.** All *three*
  burger cards now show the same double-patty photo; there is no single-patty shot
  and no triple shot. Alt text on the Triple honestly describes the double.
- Chicken, Sides and Drinks have no photos, so `MenuSection` renders those categories
  as a clean price list instead of a wall of placeholder tiles (see `hasPhotos` there).
  **Adding a photo to any *one* item in a category switches the whole category to photo
  cards — and every sibling with `image: ''` then renders a broken tile.** Photograph a
  whole category or none of it.
- The 2026-08-08 set includes a usable-ish **Loaded Burger Fries** shot, but it's a photo
  *of a laminated poster behind glass*, with sun glare and the photographer's reflection
  across it. Left out deliberately — see the whole-category rule above.

## Launch blockers

Full list is §7 OPEN QUESTIONS in `kunafah-guy-build-spec.md`. His photos resolved
menu/prices (2026-07-25, re-transcribed 2026-08-08), halal, and the deal pricing;
photo licensing is resolved for every slot except the process section (see below).
What's left:

1. **"Voted #1 Kunafah in all of California"** — voted by whom? Until
   `claims.votedBestVerified` is `true` *with a source*, it renders as an owner quote,
   not a fact badge. Shipping it as fact without a source is a liability.
2. **Review stats (4.5 / 46)** — which platform, and the profile URL.
3. **Domain**, for canonical and OG URLs (currently relative, which works on any host).
4. **A real burger photo** — see Photos above.
5. **Facebook handle** — config has `the_kunafa_guy` (no h). Unverified; don't "fix"
   the spelling, it's a real account slug and changing it would break the link.
6. **Process section photo licensing (reopened 2026-08-01)** — the four "How the
   Kunafah Happens" images are back to the pre-truck-photo set at the owner's request;
   see Photos above. Source/license unverified.
7. **Kunafah tray pricing (reopened 2026-08-08)** — the new board doesn't list trays at
   all. The old S $25 / M $45 / L $65 came off a board that has since been replaced, and
   every price on it moved, so those numbers are no longer sourced. The item renders
   `price TBC` with a "call or text" line. Ask whether he still sells trays and at what
   price, then restore `priceLabel` in `site.config.ts` and flip it to `CONFIRMED`.
8. **Water price** — priced on the board, but the card-acceptance sticker covers the
   digit in every photo. One clear photo of that corner closes it.

Open questions from the truck photos, **not resolved — ask the owner, don't guess**:

- **Wings w/ Fries ($11) and Add Fries and Drink ($5) are gone from the 08-08 board.**
  Both were removed from the config to match it. Confirm they were actually dropped and
  not just left off when he re-lettered the board.
- **Shawarma is gone from his board.** It listed Chicken Sandwich instead, so the config
  now matches the board. Confirm he really dropped shawarma. (Still absent on 08-08.)
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
