import type { LucideIcon } from 'lucide-react'
import { BedDouble, CalendarRange, House, Users } from 'lucide-react'

const withTransform = (src: string, transform: string) =>
  src.replace('/upload/', `/upload/${transform}/`)

type Detail = {
  title: string
  body: string
  icon: LucideIcon
}

type GalleryMoment = {
  alt: string
  image: string
  label: string
  layout: 'featured' | 'tall' | 'wide'
  title: string
}

type PricingSeason = {
  season: string
  months: string[]
  rate: string
}

export const bookingUrl = 'https://www.canarycove.com/book'

export const heroImage = withTransform(
  'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1775486550/IMG_1579_ccfd1d.webp',
  'f_auto,q_auto,w_2200,c_fill,g_auto',
)

export const overviewImage = withTransform(
  'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059672/31_villa_sign_beach_path_entry_lwypad.webp',
  'f_auto,q_auto,w_1200,c_fill,g_auto',
)

export const pricingImage = withTransform(
  'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059674/relax_drhybs.webp',
  'f_auto,q_auto,w_1400,c_fill,g_auto',
)

export const heroStats = [
  { label: 'Setup', value: '5 suites' },
  { label: 'Access', value: 'Returning groups only' },
  { label: 'Best for', value: 'Reunions + larger families' },
  { label: 'Rates', value: '$2,500–$3,600 nightly' },
]

export const layoutDetails: Detail[] = [
  {
    title: 'Full 5-suite setup',
    body: 'This main house option is the larger configuration for groups that want the estate moving as one shared base.',
    icon: BedDouble,
  },
  {
    title: 'Reserved for returning groups',
    body: 'It is intentionally held for guests who already know they want Canary Cove for the whole trip.',
    icon: Users,
  },
  {
    title: 'One home base for the group',
    body: 'The positioning is about returning together and using the property as a single, larger-group center of gravity.',
    icon: House,
  },
  {
    title: 'Season-based nightly pricing',
    body: 'Low, high, and peak months each have their own nightly rate instead of one flat year-round price.',
    icon: CalendarRange,
  },
]

export const pricingSeasons: PricingSeason[] = [
  {
    season: 'Low Season',
    months: ['Feb', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    rate: '$2,500',
  },
  {
    season: 'High Season',
    months: ['May', 'Nov'],
    rate: '$3,000',
  },
  {
    season: 'Peak Season',
    months: ['Dec', 'Jan', 'Apr'],
    rate: '$3,600',
  },
]

export const galleryMoments: GalleryMoment[] = [
  {
    alt: 'Poolside drinks beside the water at Canary Cove',
    image: withTransform(
      'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059675/82_drinks_poolside-400x284_mhumdf.webp',
      'f_auto,q_auto,w_1200,c_fill,g_auto',
    ),
    label: 'Poolside',
    layout: 'featured',
    title: 'The larger main-house setup works best when the group wants enough room to settle into one shared rhythm.',
  },
  {
    alt: 'Guests relaxing along the waterfront at Canary Cove',
    image: withTransform(
      'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059674/relax_drhybs.webp',
      'f_auto,q_auto,w_1000,c_fill,g_auto',
    ),
    label: 'Home Base',
    layout: 'tall',
    title: 'Returning together means the estate can function as the familiar place everyone moves through naturally.',
  },
  {
    alt: 'Outdoor grounds and gathering spaces at Canary Cove',
    image: withTransform(
      'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059652/IMG_2062_tm7q8a.webp',
      'f_auto,q_auto,w_1200,c_fill,g_auto',
    ),
    label: 'Grounds',
    layout: 'wide',
    title: 'Reunions and larger family trips benefit most when the whole stay keeps returning to one calm, shared center.',
  },
  {
    alt: 'The main pool and waterfront setting at Canary Cove',
    image: withTransform(
      'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059648/BigPool2-400x284_dhswxv.webp',
      'f_auto,q_auto,w_1200,c_fill,g_auto',
    ),
    label: 'Waterfront',
    layout: 'wide',
    title: 'The setting still feels expansive, but the story here is the five-suite setup and the returning-group fit.',
  },
]

export const timeline = [
  {
    step: '01',
    title: 'Repeat guests only',
    body: 'This accommodation path is reserved for groups who already know Canary Cove is where they want to come back together.',
  },
  {
    step: '02',
    title: 'Main House, full 5 suites',
    body: 'It is the larger setup for groups that want the whole main house functioning as one shared home base.',
  },
  {
    step: '03',
    title: 'Nightly rate depends on season',
    body: 'Low, high, and peak travel months each have a distinct nightly price tied to when the group travels.',
  },
  {
    step: '04',
    title: 'Best for reunions and larger families',
    body: 'The fit is a group returning together, not a small first-time stay trying to test the property.',
  },
]

export const finalNotes = [
  {
    title: 'This is the returner version of the main house',
    body: 'The repeat-guest requirement is part of the positioning, not a detail to discover late in the process.',
  },
  {
    title: 'The offer is the full setup',
    body: 'What matters here is access to the 5-suite main house as one coordinated base rather than a smaller accommodation mix.',
  },
  {
    title: 'The right fit is a group that already knows the answer',
    body: 'Reunions and larger family groups tend to get the most value when they already know they want Canary Cove for the trip.',
  },
]
