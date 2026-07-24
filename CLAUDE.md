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

**Photos.** Only two real photos exist (both owner-supplied, in `~/Downloads`):
a kunafa tray shot (736×1103) and a "double smash" burger shot (236×314).
`scripts/process-photos.ps1` crops them into every slot. Consequences to remember:

- Both burger cards show the *same double-patty photo* — there is no single-patty shot.
- The four process steps are four different macro crops of the finished kunafa tray,
  not actual shred/sear/pull/drench stages.
- The burger source is a thumbnail, so it looks soft when enlarged.
- Shawarma has no photo: its config `image` is `''`, which makes `MenuSection` render a
  branded "photo coming soon" tile. Drop a file at `/images/menu-shawarma.jpg` and
  restore the path to fix.
- **Licensing risk:** the kunafa photo looks like professional stock/editorial work.
  Confirm a commercial licence or replace it with Arafat's own shot before launch.

## Launch blockers

Full list is §7 OPEN QUESTIONS in `kunafah-guy-build-spec.md`. The ones that actually
block going public:

1. Real menu and prices (everything is currently UNCONFIRMED, including the $10/$15 deal).
2. "Voted #1 Kunafa in all of California" — voted by whom? Until `claims.votedBestVerified`
   is `true` *with a source*, it renders as an owner quote, not a fact badge. Shipping it
   as fact without a source is a liability.
3. Halal — confirmed and certified, or self-described? Footer note is hidden until
   `flags.halal === 'CONFIRMED'`.
4. Review stats (4.5 / 46) — which platform, and the profile URL.
5. Photo licensing + real photography.
6. Domain, for canonical and OG URLs.

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
