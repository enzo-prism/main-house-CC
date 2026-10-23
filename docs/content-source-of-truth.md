# Canary Cove Main House Content Source of Truth

This document exists to keep the microsite aligned with the currently approved Main House offer.

## Approved Positioning

- `Main House accommodations`
- `Reserved for returning groups who want the full 5-suite setup`
- `Repeat guests only`
- `Best for reunions and larger family groups that already know they want the whole estate flowing as one home base`
- a separate `$10,000 damage deposit` applies to every Main House stay

## Seasonal Nightly Pricing

### Low Season

Travel months:

- `Feb`
- `Mar`
- `Jun`
- `Jul`
- `Aug`
- `Sep`
- `Oct`

Nightly pricing:

- `5 Suites` — `$2,500`

### High Season

Travel months:

- `May`
- `Nov`

Nightly pricing:

- `5 Suites` — `$3,000`

### Peak Season

Travel months:

- `Dec`
- `Jan`
- `Apr`

Nightly pricing:

- `5 Suites` — `$3,600`

## Messaging Rules

Keep these points central in the page:

- this is the `5-suite` setup
- this is for `returning groups only`
- this is best for `reunions and larger family groups`
- the pricing is `seasonal`, not flat
- the `$10,000 damage deposit` is separate from nightly pricing

## Sharing and discovery

- Canonical share URL: `https://mainhouse.canarycove.com/`
- Repeat-guest short link: `https://www.canarycove.com/stay/main-house` (temporary redirect to this page)
- This page is public and indexable.
- The public Canary Cove site may summarize the offer on `/rates#main-house-accommodations`. `/stay` may include a designed Main House card that uses `/stay/main-house`. Do not use a stray underlined link.

## Claims To Avoid Unless Reconfirmed

Do not add or restore any of the following without explicit confirmation from Canary Cove:

- `3 king suites`
- `up to 10 guests`
- `best for three couples`
- chef service
- boats on site
- private docks
- pickup from San Pedro
- turnkey activity planning or similar service promises

Those ideas may have appeared in earlier drafts, but they are not the current approved source of truth for this microsite.

## Supporting copy on the page (2026-10-23 redesign)

The redesign keeps every approved line above verbatim. It adds short connective copy that restates those facts and makes no new claims:

- Hero glance facts: Suites 5 · From $2,500 a night · Deposit $10,000 · Open to Returning guests.
- "What you get" ledger: Five suites, The pool, The waterfront, The grounds. Their one-line captions are the earlier approved space captions.
- "Best for": Reunions, Larger family groups, Returning groups.
- "How to book" has three steps:
  1. Open the booking form with Main House and returning guest preselected.
  2. Include the nature of the inquiry.
  3. The Canary Cove team reviews the request and replies.
- Rate picker: each month maps to its season and nightly rate exactly as listed above. The readout always repeats the separate $10,000 deposit.

The page lists no amenities beyond pool, waterfront, grounds, and shared outdoor spaces. If Canary Cove confirms more, add them to this file first.

## Imagery

- The Main House is the two-storey house in Cloudinary `IMG_1579_ccfd1d`. It is the hero arch and the closing photo.
- All other photos are estate exteriors, pool, waterfront, and grounds, with neutral captions.
- No interior photo is presented as a Main House suite. None of the Cove's interiors are labelled Main House.
- No boat photos.

## Files That Should Stay Aligned

- [src/content.ts](../src/content.ts): every fact, rate, season, step, and photo
- [src/sections/](../src/sections): page sections
- [src/lib/nav.ts](../src/lib/nav.ts), [src/components/footer.tsx](../src/components/footer.tsx): Cove chrome
- [index.html](../index.html): title, description, Open Graph, and JSON-LD (`Accommodation`, 5 rooms)

If this offer changes, update those files together rather than patching only one layer.
