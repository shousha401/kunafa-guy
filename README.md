# The Kunafah Guy — Website

Single-page marketing site. React + Vite + TypeScript + Tailwind. Static — no backend.

## Run it

```bash
npm install
npm run dev      # local dev at http://localhost:5173
npm run build    # production build → dist/
```

Deploy `dist/` to Netlify/Vercel/any static host.

## Updating the site (owner guide)

**Everything editable lives in one file: `src/content/site.config.ts`.** Never touch components.

### Change a price
Find the item in `menu` (or `deals`) and set `price`. When a price is confirmed, also flip
`status: 'UNCONFIRMED'` → `'CONFIRMED'` to remove the "price TBC" badge.

```ts
{ id: 'kunafa-classic', ..., price: 12, status: 'CONFIRMED' }
```

### Add a menu item
Copy any item block in `menu`, give it a new `id`, set `category` to
`'kunafa' | 'burgers' | 'shawarma'`, point `image` at a photo in `public/images/`,
and write real `imageAlt` text. The menu section renders it automatically.

### Swap a photo
Drop the new photo into `public/images/` using the exact filename from the asset
manifest (e.g. `menu-kunafa-classic.jpg`, 4:3, ~1200×900, JPG ≤120KB). Done — no code changes.

If an item has no photo yet, set its `image` to an empty string (`image: ''`) and the
card renders a branded "photo coming soon" tile instead of a broken image.

Photos usually need cropping and compressing first. `scripts/process-photos.ps1` does
both — it crops to the slot's aspect ratio and steps quality down until the file meets
its weight budget:

```bash
powershell -File scripts/process-photos.ps1 -Source "C:\path\to\photo.jpg" -Slot menu-shawarma
```

Run it with no arguments to rebuild every slot from the currently mapped source photos.

### Photo status (as of this build)

| Slot | Source | Still needed |
|---|---|---|
| Hero, menu kunafa, all 4 process steps | crops of one supplied kunafa photo (736×1103) | Arafat's own kunafa shots; the process steps currently show the finished tray, not the actual shred/sear/pull/drench stages |
| Both burger cards | one supplied "double smash" photo (236×314) | a higher-resolution original — this one is a thumbnail and looks soft when enlarged; also a genuine single-patty shot for the Smash Burger card |
| Shawarma | none | any shawarma photo |

**Licensing:** the supplied kunafa photo looks like professional stock/editorial
photography. Confirm it's licensed for commercial use — or replace it with Arafat's
own shot — before this site goes public.

### Hours
Hours are intentionally NOT listed — they vary daily. The site sends people to Instagram.
Edit the callout text under `hours` in the config.

### Follower counts / reviews
These are manual snapshots (strings) in `social` and `reviews` — not fetched live.
Re-check them the week of launch.

### Halal note
Footer shows "Halal" only when `flags.halal === 'CONFIRMED'`.

### "Voted #1" claim
Rendered as an owner quote while `claims.votedBestVerified` is `false`.
Flip to `true` (only with a real source) to switch to badge styling.

## Before launch
See §7 OPEN QUESTIONS in `kunafah-guy-build-spec.md` — menu/prices, halal wording,
review-platform link, Maps pin, photos, and domain all need owner confirmation.
