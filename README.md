# Canary Cove Main House Microsite

A single-page React microsite for the Canary Cove Main House offer.

This site is intentionally positioned around the current approved offer:

- `5-suite Main House`
- `Reserved for returning groups`
- `Best for reunions and larger family groups`
- seasonal nightly pricing from `$2,500` to `$3,600`

The design direction is clean, white, minimal, and image-led, with a stronger contrast hero and a product-style information hierarchy.

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `Framer Motion`
- `lucide-react`

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Run linting:

```bash
pnpm lint
```

Preview the production build locally:

```bash
pnpm preview
```

## Project Structure

- [src/App.tsx](/Users/enzo/canary-cove-main-house/src/App.tsx): page composition and section rendering
- [src/content.ts](/Users/enzo/canary-cove-main-house/src/content.ts): content model, hero stats, pricing data, image references, and supporting copy
- [src/index.css](/Users/enzo/canary-cove-main-house/src/index.css): global styles, hero system, layout, responsive behavior
- [index.html](/Users/enzo/canary-cove-main-house/index.html): metadata, share cards, and document shell
- [public/favicon.svg](/Users/enzo/canary-cove-main-house/public/favicon.svg): favicon

## Content Model

The page is driven from [src/content.ts](/Users/enzo/canary-cove-main-house/src/content.ts).

That file contains:

- `heroStats`
- `layoutDetails`
- `pricingSeasons`
- `galleryMoments`
- `timeline`
- `finalNotes`
- primary image selections and Cloudinary transforms

For normal offer updates, start there before touching layout code.

## Source of Truth

The current factual source of truth is documented in [docs/content-source-of-truth.md](/Users/enzo/canary-cove-main-house/docs/content-source-of-truth.md).

Important constraint:

- Do not reintroduce outdated claims like `3 king suites`, `up to 10 guests`, chef service, docks, boats, or other unsupported experience claims unless Canary Cove explicitly confirms they are part of the current Main House offer.

## Design Notes

- The hero is full-bleed and intentionally carries the main message.
- The white sections below the hero are meant to feel product-clean rather than editorial or resort-brochure heavy.
- The pricing block appears early on purpose because this page is a qualification and conversion surface, not just a mood piece.

## Verification Checklist

Before shipping changes:

1. Run `pnpm lint`
2. Run `pnpm build`
3. Verify the hero at desktop and mobile sizes
4. Verify the pricing section reads clearly on mobile
5. Search for stale claims before publishing:

```bash
rg -n "3 king|three king|up to 10|three couples|chef|docks|boats|San Pedro" -S src index.html
```

## Repository

- GitHub: [enzo-prism/main-house-CC](https://github.com/enzo-prism/main-house-CC)
- Branch: `main`
