# Canary Cove Main House

The returning-guest microsite for the Canary Cove Main House: five suites, the whole estate as one home base, seasonal nightly rates, and a separate damage deposit.

- Production: <https://mainhouse.canarycove.com> (Vercel project `canary-cove-main-house`)
- Parent site: <https://www.canarycove.com> (repo `enzo-prism/canary-cove-alpha`). Its `/stay/main-house` path 307-redirects here.
- Facts on the page come only from [docs/content-source-of-truth.md](docs/content-source-of-truth.md).

## Design

The page is a chapter of www.canarycove.com and uses the Cove's **"Sand, reef, and canary"** design system. That system is documented in `canary-cove-alpha/docs/design-system.md`. It was ported here rather than reinvented:

- **Tokens and motion CSS.** [src/styles.css](src/styles.css) is the Cove's `app/globals.css`, trimmed of form and video rules and extended with a short "Main House additions" block. Keep the two files in step.
- **Type.** Instrument Serif headlines and SF Pro UI, self-hosted in `public/fonts/` and preloaded in `index.html`.
- **Brand.** The official logo SVGs live in `public/brand/` and are copied from the Cove. Never recolor or re-set them.
- **Chrome.** [src/components/header.tsx](src/components/header.tsx), [desktop-nav.tsx](src/components/desktop-nav.tsx), [mobile-nav.tsx](src/components/mobile-nav.tsx) and [footer.tsx](src/components/footer.tsx) mirror the Cove header and footer:
  - The Stay dropdown holds The Villa, **Main House** (current), and Rates.
  - The Explore dropdown holds Experiences, Dining, Adventures, and Gallery.
  - Reviews, Getting Here, and Contact are plain links, and **Book** is the CTA.
  - Nav data lives in [src/lib/nav.ts](src/lib/nav.ts). It mirrors `canary-cove-alpha/lib/nav-items.ts`.
- **Motion.** The primitives in [src/components/motion/](src/components/motion) are the Cove's: `data-reveal` scroll reveals, `SplitText`, `Parallax`, `ScrollWordReveal`, `CountUp`, `Marquee`, `Magnetic`, `LocalTime`, `ScrollProgress`, and Lenis `SmoothScroll`. Every motion respects `prefers-reduced-motion`.
  - `SplitText` gains one feature over the Cove's version: a `\n` in `text` starts a new line. The hero H1 uses it.
- **`cn()`.** [src/lib/utils.ts](src/lib/utils.ts) is the Cove's `tailwind-merge` config, which treats `text-hero` / `text-display` / `text-section` / `text-title` / `text-lede` / `text-body` as type roles. Without it, a heading that also has a color class (for example `text-foreground`) silently loses its size.

### Page order ([src/App.tsx](src/App.tsx))

| Section | File | Anchor |
| --- | --- | --- |
| Hero. The H1 is "Canary Cove / *Main House*". The arch photo of the house has a scroll-turned badge. The section also holds the glance facts and the on-page index. | `sections/hero.tsx` | |
| The offer: the approved summary line, lit word by word | `sections/offer.tsx` | |
| What you get. The whole estate as one home base, with a numbered ledger. | `sections/offer.tsx` | `#what-you-get` |
| Highlights marquee | `sections/estate.tsx` | |
| Outside: the house from the beach, on the sand, the pool deck, and the view from the upper terrace | `sections/estate.tsx` | `#the-estate` |
| Inside the house: the great room and eight rooms, with a lightbox (arrow keys, and focus returns to the last photo shown) | `sections/interiors.tsx` | `#inside` |
| Why returning guests only (the one reef band), plus Best for | `sections/returning.tsx` | `#returning-guests` |
| Seasonal rates. A month picker drives a live rate readout. Below it sit the season ledger and the damage deposit. | `sections/rates.tsx` | `#pricing` |
| How to book (three steps) | `sections/book.tsx` | `#book` |
| Closing CTA, with a wide photo of the house | `sections/book.tsx` | |

`#pricing` is kept from the previous site so old links still land on rates.

### Imagery rules

**Use only photos of the Main House.** That is the two-storey pale-yellow house with its own long infinity pool and a thatched palapa standing in the water. The Villa is the pink single-storey house with the crocodile pool, and its photos must never appear here.

How each photo was identified is in [docs/photo-provenance.md](docs/photo-provenance.md). The `PHOTOS` registry is in [src/content.ts](src/content.ts).

- **Hero and closing photo:** `IMG_1579`, the house seen from the water. It comes from Cloudinary at 2056px.
- **The other 15 photos** were recovered from the old canarycove.com "Main Villa" gallery (the Main House's former name). They are self-hosted in `public/photos/main-house/` as `-480.webp` and `-800.webp`.
- These photos are only 800px wide. Keep their frames close to 3:2, keep parallax overscale at or below 1.08, and keep tiles around 400 CSS px wide.
- [src/components/cld-image.tsx](src/components/cld-image.tsx) serves both kinds of image. A path that starts with `/` is a self-hosted base path.
- **Do not reuse the www.canarycove.com photo library.** Apart from `IMG_1579`, it is entirely the Villa.
- No boat photos, and no gym or billiards close-ups.

## Stack

React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), `motion`, Lenis, Radix Popover and Dialog, and `lucide-react`.

The page is **prerendered**:

1. `pnpm build` builds the client.
2. It then builds `src/entry-server.tsx` for SSR.
3. Finally, `scripts/prerender.mjs` writes the rendered markup into `dist/index.html`.

`src/main.tsx` then hydrates that markup. Crawlers, link previews, and first paint get the full page.

Keep render output deterministic so hydration matches:

- Time-dependent UI renders a stable value first and updates after mount. Examples are `LocalTime`, and the rate picker that prerenders December and then moves to the current Belize month.
- `CountUp` prerenders its final value.

## Commands

```bash
pnpm install
pnpm dev       # Vite dev server (client render, no prerender)
pnpm lint
pnpm build     # tsc + client build + SSR build + prerender
pnpm preview   # serve dist/ (the prerendered page)
```

## Deploy

The Vercel project is **not** Git-connected. Pushing `main` does not deploy. After pushing:

```bash
vercel link --yes --project canary-cove-main-house --scope enzo-design-prisms-projects   # once per checkout
vercel deploy --prod --scope enzo-design-prisms-projects
```

`vercel.json` sets `buildCommand: pnpm build` and `outputDirectory: dist`, and keeps the `mainhouse.canarycove.com` alias. After deploying, run `curl -s https://mainhouse.canarycove.com | grep -c 'Canary Cove'`. A prerendered page returns the full markup; an empty `<div id="root"></div>` means the prerender step did not run.

## Verification checklist

1. `pnpm lint` and `pnpm build` both pass. The build log ends with `prerender: wrote … KB of markup`.
2. Check the hero at 1440px and 390px:
   - Desktop shows copy left and the arch photo right.
   - Phones show the eyebrow and H1, then the arch photo, then the lede, CTAs, and facts.
   - The H1 reads as two lines: Canary Cove / *Main House*.
3. Check the header:
   - Hovering or clicking the Stay chevron opens the panel, with Main House marked `aria-current="page"`.
   - Explore lists Experiences, Dining, Adventures, and Gallery.
   - The mobile menu opens full-screen and focuses its close button, and Escape closes it.
4. Check the rates. Clicking a month updates the readout (for example, May shows High Season at $3,000). The ledger shows all three seasons, and the $10,000 deposit appears.
5. No console errors or hydration warnings, and no horizontal overflow at 390px.
6. axe (wcag2a/aa and best-practice) reports 0 violations.
7. Search for stale claims before publishing:

```bash
rg -n "3 king|three king|up to 10|three couples|chef|docks?\b|boats?\b|San Pedro|pickup" -S src index.html
```

Expected hits:

- The nav captions in `src/lib/nav.ts` ("Private chef service", "Water, land, and dock days"). They describe Cove pages, not the Main House offer.
- The comments in `src/content.ts` that list claims to avoid.
