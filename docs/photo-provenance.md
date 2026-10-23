# Main House photo provenance

Every photo on mainhouse.canarycove.com shows the **Main House**. The Main House is the two-storey, pale-yellow house with a tile roof. It has its own long infinity pool with a large thatched palapa standing in the water, blue loungers, and yellow umbrellas.

The **Villa** is a different building: the pink (formerly cream) single-storey house with curved lawn steps, a pool with a carved crocodile, and a small palapa bar. Its photos must never appear here.

## Why the Cove photo library is not used

On 2026-10-23 we reviewed all 196 non-food photos in `canary-cove-alpha/lib/gallery-photos.ts`. With one exception, they show the Villa:

- its pink exterior,
- its crocodile pool and palapa bar,
- its interiors, where the pink walls are visible through the windows,
- or cream-era shots of the same house with the same curved steps.

The exception is `IMG_1579`, the two-storey house seen from the water. That is the only Main House photo in the Cove library.

## Where the Main House photos came from

The photos come from the old canarycove.com WordPress site, recovered through the Wayback Machine. That site called the Main House the **"Main Villa"**. Its 2017 page described a "10,000 sqft private villa … open 2 story floor plan … personal infinity pool and hot tub with swim up bar". The Villa was called the **"Guest Villa"**: 2,200 sq ft, next to the Main Villa. Its archived gallery shows the cream single-storey house with the crocodile pool, which confirms the split.

The old site only published these photos at 800px. They are self-hosted in `public/photos/main-house/` as `-480.webp` and `-800.webp`. The 800px sources are archived on PortableSSD under `canary-cove-main-house-photos/verified-main-house-800px/`.

| File | Archived source (canarycove.com) | How it was verified |
| --- | --- | --- |
| `pool-palapa-bar` | `wp-content/gallery/main-villa-popup/115.jpg` | Main Villa gallery; the two-storey house is visible behind the palapa in the pool |
| `pool-deck-loungers` | `wp-content/gallery/main-villa-popup/100.jpg` | Main Villa gallery; the blue loungers match IMG_1579 |
| `upper-terrace-view` | `wp-content/gallery/main-villa/107.jpg` | Main Villa gallery; taken from the house's upper terrace |
| `pool-deck-house` | `wp-content/uploads/2017/09/80.jpg` | The house and its curved stair stand beside the pool; the old 2020 Main House page used this photo |
| `beach-palapa-house` | `wp-content/gallery/compound/6.jpg` | The two-storey house stands behind a beach palapa |
| `house-from-beach` | `wp-content/gallery/compound/copy_0_Panorama2.jpg` | The full two-storey house and pool terrace |
| `great-room`, `dining`, `kitchen`, `staircase` | `wp-content/gallery/main-villa/24.jpg`, `2.jpg`, `28.jpg`, `58.jpg` | Main Villa gallery; these are the double-height rooms |
| `master-suite`, `suite-sitting-area`, `suite-two-queens`, `suite-garden-view`, `suite-bath` | `wp-content/gallery/main-villa-popup/005-copy1.jpg`, `008-copy.jpg`, `4.jpg`, `5.jpg`, `7.jpg` | Main Villa gallery; the windows look onto the Main House deck (yellow umbrellas, palapa) |

`IMG_1579` (hero and closing) is still served from Cloudinary at 2056px.

## Left out on purpose

Several Main House photos were not used:

- **Gym and billiards close-ups.** The page should not imply amenities that the approved offer does not list.
- **Dock and boat shots.**
- **The aerial.** It shows both houses.
- **The poolside grill bar, IMG_1227, IMG_2148, and other phone shots.** We could not tell which pool these show.

The interiors date from about 2017. Ask Canary Cove to confirm that the furnishings are still current, and replace these photos with new high-resolution Main House photography when it exists. Upload new photos to Cloudinary and switch the entries in `src/content.ts` to Cloudinary URLs.
