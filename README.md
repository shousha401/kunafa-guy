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

Current placeholder images are auto-generated stand-ins; replace all of them before launch.

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
