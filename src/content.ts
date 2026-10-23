// Every fact on the page comes from this file. The approved offer lives in
// docs/content-source-of-truth.md — keep the two in step, and do not add
// claims (suite counts, guest caps, chef, docks, boats, transfers) that the
// source of truth does not list.

export const SITE_URL = 'https://mainhouse.canarycove.com'
export const COVE_URL = 'https://www.canarycove.com'

/** Canary Cove's booking form with Main House + returning guest preselected. */
export const bookingUrl = `${COVE_URL}/book?accommodation=main-house&returning=yes`
export const contactUrl = `${COVE_URL}/contact`

// ── Imagery ────────────────────────────────────────────────────────────────
// Main House photos only. The Cove's current library (www.canarycove.com) is
// almost entirely the pink single-storey Villa, its crocodile pool and its
// interiors, so none of it is used here except IMG_1579 (the two-storey house
// from the water). Every other photo was recovered from the old canarycove.com
// "Main Villa" gallery (the Main House's former name) and is self-hosted in
// public/photos/main-house at 480/800px. Provenance and how each was verified:
// docs/photo-provenance.md. No boat photos (boats are not part of the offer).

export type Photo = {
  /** Cloudinary original, or a self-hosted base path ("/photos/…/name") with -480/-800.webp files. */
  src: string
  alt: string
  /** Original pixel width; srcsets never ask for more than this. */
  width: number
  /** Original pixel height (self-hosted photos only; used for aspect hints). */
  height?: number
  focal?: { x: number; y: number }
}

const local = (name: string, alt: string, width: number, height: number, focal?: Photo['focal']): Photo => ({
  src: `/photos/main-house/${name}`,
  alt,
  width,
  height,
  focal,
})

export const PHOTOS = {
  // The two-storey Main House seen from the water (Cloudinary, 2056px).
  house: {
    src: 'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1775486550/IMG_1579_ccfd1d.webp',
    alt: 'The Canary Cove Main House across the lawn and pool, seen from the water',
    width: 2056,
    focal: { x: 50, y: 52 },
  },
  poolPalapaBar: local(
    'pool-palapa-bar',
    'The Main House infinity pool and its thatched palapa, with the two-storey house behind',
    800,
    517,
    { x: 50, y: 55 },
  ),
  poolDeckLoungers: local(
    'pool-deck-loungers',
    'Blue loungers and yellow umbrellas on the Main House pool deck, looking out to the sea',
    800,
    520,
  ),
  upperTerraceView: local(
    'upper-terrace-view',
    'The Main House pool deck, palapa and beach seen from the upper terrace',
    800,
    498,
  ),
  poolDeckHouse: local(
    'pool-deck-house',
    'Loungers under yellow umbrellas beside the Main House pool, with the house and its curved stair',
    800,
    522,
    { x: 45, y: 55 },
  ),
  beachPalapaHouse: local(
    'beach-palapa-house',
    'A thatched palapa on the sand in front of the two-storey Main House',
    800,
    520,
  ),
  houseFromBeach: local(
    'house-from-beach',
    'The full width of the Main House and its pool terrace, seen from the beach',
    800,
    311,
  ),
  greatRoom: local(
    'great-room',
    'The double-height great room with a curved blue sectional and a wall of glass doors to the pool',
    800,
    532,
  ),
  dining: local('dining', 'The dining table beneath the double-height windows, facing the sea', 800, 517),
  kitchen: local('kitchen', 'The kitchen island and round bar seating under the gallery', 800, 542),
  masterSuite: local('master-suite', 'The master suite with a four-poster bed and dark wood ceiling', 800, 512),
  suiteSitting: local(
    'suite-sitting-area',
    'A suite sitting area with sliding doors to a balcony over the sea',
    800,
    521,
  ),
  suiteTwoQueens: local(
    'suite-two-queens',
    'A suite with two beds and sliding doors onto the pool deck',
    800,
    478,
  ),
  suiteGardenView: local(
    'suite-garden-view',
    'A suite with two beds and a sitting area looking out to the palapa and the sea',
    800,
    493,
  ),
  staircase: local('staircase', 'The curved stone staircase with a wrought-iron rail', 800, 532),
  suiteBath: local('suite-bath', 'A suite bathroom with a soaking tub, glass-block window and double vanity', 800, 532),
} satisfies Record<string, Photo>

export type InteriorTile = { photo: Photo; label: string; feature?: boolean }

export const interiors: InteriorTile[] = [
  { photo: PHOTOS.greatRoom, label: 'The great room', feature: true },
  { photo: PHOTOS.dining, label: 'Dining' },
  { photo: PHOTOS.kitchen, label: 'The kitchen' },
  { photo: PHOTOS.masterSuite, label: 'The master suite' },
  { photo: PHOTOS.suiteSitting, label: 'Suite sitting area' },
  { photo: PHOTOS.suiteGardenView, label: 'A suite' },
  { photo: PHOTOS.suiteTwoQueens, label: 'A suite' },
  { photo: PHOTOS.staircase, label: 'The staircase' },
  { photo: PHOTOS.suiteBath, label: 'A suite bath' },
]

// ── Offer ──────────────────────────────────────────────────────────────────

export const heroEyebrow = 'Ambergris Caye, Belize'
export const heroTitle = 'Canary Cove\n*Main House*'
export const heroLede =
  'The Main House is the full Canary Cove experience, available exclusively to returning guests. If you’ve stayed with us before, this is how your group comes back bigger.'

export const heroFacts = [
  { label: 'Suites', value: '5' },
  { label: 'From', value: '$2,500', note: 'a night' },
  { label: 'Deposit', value: '$10,000' },
  { label: 'Open to', value: 'Returning guests' },
]

export const summaryHeadline =
  'Five suites. One estate. Reserved for guests who *already* feel like family.'

export const whatYouGet = [
  'The Main House is the entire estate operating as one home base for your group. Five suites, shared outdoor spaces, pool, waterfront, and grounds, all flowing together so nobody feels scattered across separate accommodations.',
  'This is designed for groups that want to be under one roof (or close to it) and move through the trip together naturally.',
]

export const estateParts = [
  { title: 'Five suites', body: 'Everyone has their own space, and one place to come back to.' },
  { title: 'The pool', body: 'Settle into a shared rhythm by the water with your whole group in one place.' },
  { title: 'The waterfront', body: 'Open and expansive, while keeping everyone connected.' },
  { title: 'The grounds', body: 'Outdoor gathering spaces that give the trip a calm, unhurried center.' },
]

export const marqueeWords = [
  'Five suites',
  'One estate',
  'Reunions',
  'Family groups',
  'Pool',
  'Waterfront',
  'Grounds',
  'Returning guests',
]

export const whyReturningGuestsOnly = [
  'We hold the Main House for people the Canary Cove team already knows and trusts. When you’ve stayed with us before, we understand how your group works, what you care about, and how to make the stay feel effortless.',
  'It also means every group booking the Main House has already experienced Canary Cove firsthand. No surprises on either side.',
]

export const bestFor = [
  { title: 'Reunions', body: 'Bring everyone back together in one place.' },
  { title: 'Larger family groups', body: 'Room for every branch of the family, with space to spread out.' },
  { title: 'Returning groups', body: 'You know Canary Cove. Now take the whole estate.' },
]

// ── Rates ──────────────────────────────────────────────────────────────────

export type SeasonId = 'low' | 'high' | 'peak'

export type Season = {
  id: SeasonId
  name: string
  rate: number
  months: string[]
}

export const pricingIntro =
  'Your travel dates determine the nightly rate for the full five-suite Main House.'

export const damageDeposit = 10_000
export const damageDepositNote = 'A separate $10,000 damage deposit applies to every Main House stay.'

export const seasons: Season[] = [
  { id: 'low', name: 'Low Season', rate: 2_500, months: ['Feb', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] },
  { id: 'high', name: 'High Season', rate: 3_000, months: ['May', 'Nov'] },
  { id: 'peak', name: 'Peak Season', rate: 3_600, months: ['Dec', 'Jan', 'Apr'] },
]

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export const seasonForMonth = (month: string) => seasons.find((season) => season.months.includes(month))!

export const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`

// ── Booking ────────────────────────────────────────────────────────────────

export const inquiryPrompt =
  'When you request availability, include the nature of your inquiry — dates, group size, reunion plans, or questions — and we’ll take it from there.'

export const bookingSteps = [
  {
    title: 'Request availability',
    body: 'Open the Canary Cove booking form. Main House and returning guest are already selected for you.',
  },
  {
    title: 'Tell us about your group',
    body: 'Include the nature of your inquiry: your dates, group size, reunion plans, or any questions.',
  },
  {
    title: 'We take it from there',
    body: 'The Canary Cove team reviews your request and comes back to you about your dates.',
  },
]

export const finalHeading = 'Ready to *come back?*'
export const finalBody =
  'If your group has stayed at Canary Cove and you’re planning a reunion, family trip, or larger gathering, the Main House is yours to book.'

// ── Contact (as published in the www.canarycove.com footer) ────────────────

export const phones = [
  { label: 'Call Gil', display: '011 501-610-5121', href: 'tel:+5016105121' },
  { label: 'Consi', display: '011 501-626-7534', href: 'tel:+5016267534' },
]
