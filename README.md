# Canary Cove Main House Microsite

A single-page React microsite for the Canary Cove Main House offer.

This site is intentionally positioned around the current approved offer:

- `5-suite Main House`
- `Reserved for returning groups`
- `Best for reunions and larger family groups`
- seasonal nightly pricing from `$2,500` to `$3,600`
- separate `$10,000 damage deposit`

The share URL is `https://mainhouse.canarycove.com`.

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

- [src/App.tsx](src/App.tsx): page composition and section rendering
- [src/content.ts](src/content.ts): content model, hero stats, pricing data, image references, and supporting copy
- [src/cove-chrome.tsx](src/cove-chrome.tsx): Canary Cove header/footer chrome, aligned with the current Stay / Rates / Explore nav
- [src/index.css](src/index.css): global styles, hero system, layout, responsive behavior
- [index.html](index.html): metadata, share cards, and document shell
- [public/favicon.svg](public/favicon.svg): favicon

## Content Model

The page is driven from [src/content.ts](src/content.ts).

That file contains:

- `heroTitle`, `heroLocation`, `heroImage`
- `summaryHeadline`, `summaryBody`, `atGlance`
- `whatYouGet`, `whyReturningGuestsOnly`
- `pricingSeasons`, `pricingIntro`, `damageDepositNote`
- `spaceMoments`
- `bookingUrl` (Canary Cove `/book` with Main House defaults)

For normal offer updates, start there before touching layout code.

## Source of Truth

The current factual source of truth is documented in [docs/content-source-of-truth.md](docs/content-source-of-truth.md).

Important constraint:

- Do not reintroduce outdated claims like `3 king suites`, `up to 10 guests`, chef service, docks, boats, or other unsupported experience claims unless Canary Cove explicitly confirms they are part of the current Main House offer.

## Design Notes

- The hero is full-bleed and image-led. The photograph should cover the poster (`object-fit: cover`); do not letterbox it with `contain`.
- The H1 sits under the photo and should wrap as “Canary Cove / Main House”, not mid-word. Keep the title max-width around `12ch`.
- Header chrome must match the current Canary Cove nav: Stay, Rates, Explore, Reviews, Getting Here, plus Book and Contact. Do not restore the older eight-item row (Home, Gallery, Experience, Dining, Adventures as first-class pills).
- `content-split-reverse` stacks copy above the image on small screens so the returning-guests section keeps the same text-first rhythm as “What you get”.
- The white sections below the hero are meant to feel product-clean rather than editorial or resort-brochure heavy.
- The pricing block appears early on purpose because this page is a qualification and conversion surface, not just a mood piece.

## Verification Checklist

Before shipping changes:

1. Run `pnpm lint`
2. Run `pnpm build`
3. Verify the hero at desktop and mobile sizes. The photograph should fill the rounded poster with no dark letterbox bars, and the H1 should read as two lines: Canary Cove / Main House.
4. Verify the header: five stacked pills (Stay, Rates, Explore, Reviews, Getting Here) plus Book/Contact. Open Explore and confirm Experiences, Dining, Adventures, and Gallery. Check the same IA in the mobile menu.
5. Verify the pricing section reads clearly on mobile.
6. Verify “Why returning guests only” shows copy above the photo on a 390px viewport.
7. Search for stale claims before publishing:

```bash
rg -n "3 king|three king|up to 10|three couples|chef|docks|boats|San Pedro" -S src index.html
```

## Repository

- GitHub: [enzo-prism/main-house-CC](https://github.com/enzo-prism/main-house-CC)
- Branch: `main`
