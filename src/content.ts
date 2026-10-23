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
// Cloudinary originals. Only exteriors, pool, waterfront and grounds are used:
// none of the Cove's interior photography is labelled as Main House, so the
// page never presents a room as a Main House suite. No boat photos (boats are
// not part of the approved offer).

export type Photo = {
  src: string
  alt: string
  /** Original pixel width; srcset never asks Cloudinary to upscale past it. */
  width: number
  focal?: { x: number; y: number }
}

export const PHOTOS = {
  // The two-storey Main House seen from the water.
  house: {
    src: 'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1775486550/IMG_1579_ccfd1d.webp',
    alt: 'The Canary Cove Main House across the lawn and pool, seen from the water',
    width: 2056,
    focal: { x: 50, y: 52 },
  },
  poolUmbrella: {
    src: 'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059670/canarycove-haydeelustudio-521-scaled_ohjnr1.webp',
    alt: 'Infinity pool with a yellow umbrella and the sea beyond the palms',
    width: 2560,
    focal: { x: 50, y: 30 },
  },
  poolPalapa: {
    src: 'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767202751/canarycove-haydeelustudio-56_ixnmn0.webp',
    alt: 'Pool and thatched palapa beside the water',
    width: 7200,
    focal: { x: 55, y: 55 },
  },
  poolCrocodile: {
    src: 'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1785546991/canarycove-album2021-008.png',
    alt: 'Carved wooden crocodile on the pool deck beside a yellow umbrella',
    width: 1496,
    focal: { x: 40, y: 60 },
  },
  shadeByTheWater: {
    src: 'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1785547016/canarycove-album2021-114.png',
    alt: 'Chairs under a yellow umbrella on the pool deck with the sea and a palapa beyond',
    width: 1496,
    focal: { x: 50, y: 55 },
  },
  hammock: {
    src: 'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059676/Facilities-Shot_dyshzq.webp',
    alt: 'Hammock strung between palms on the sand above the water',
    width: 1500,
    focal: { x: 50, y: 55 },
  },
  waterfrontChairs: {
    src: 'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059674/relax_drhybs.webp',
    alt: 'Two guests holding hands from yellow chairs facing the sea',
    width: 800,
    focal: { x: 50, y: 60 },
  },
} satisfies Record<string, Photo>

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
