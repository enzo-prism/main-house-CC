const withTransform = (src: string, transform: string) =>
  src.replace('/upload/', `/upload/${transform}/`)

type PricingSeason = {
  season: string
  months: string[]
  rate: string
}

type SpaceMoment = {
  alt: string
  body: string
  image: string
  layout: 'featured' | 'tall' | 'wide'
  title: string
}

export const bookingUrl = 'https://www.canarycove.com/book'

export const heroTitle = 'Canary Cove Main House'
export const heroLocation = 'Ambergris Caye, Belize'

export const summaryHeadline =
  'Five suites. One estate. Reserved for guests who already feel like family.'

export const summaryBody =
  'The Main House is the full Canary Cove experience, available exclusively to returning guests. If you’ve stayed with us before, this is how your group comes back bigger.'

export const atGlance = [
  '5 private suites',
  'Returning guests only',
  'Reunions and larger families',
  '$2,500 to $3,600 per night',
]

export const whatYouGet = [
  'The Main House is the entire estate operating as one home base for your group. Five suites, shared outdoor spaces, pool, waterfront, and grounds, all flowing together so nobody feels scattered across separate accommodations.',
  'This is designed for groups that want to be under one roof (or close to it) and move through the trip together naturally.',
]

export const whyReturningGuestsOnly = [
  'We hold the Main House for people the Canary Cove team already knows and trusts. When you’ve stayed with us before, we understand how your group works, what you care about, and how to make the stay feel effortless.',
  'It also means every group booking the Main House has already experienced Canary Cove firsthand. No surprises on either side.',
]

export const pricingIntro =
  'Your travel dates determine the nightly rate for the full five suite Main House.'

export const pricingSeasons: PricingSeason[] = [
  {
    season: 'Low Season',
    months: ['Feb', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    rate: '$2,500 per night',
  },
  {
    season: 'High Season',
    months: ['May', 'Nov'],
    rate: '$3,000 per night',
  },
  {
    season: 'Peak Season',
    months: ['Dec', 'Jan', 'Apr'],
    rate: '$3,600 per night',
  },
]

export const finalHeading = 'Ready to come back?'
export const finalBody =
  'If your group has stayed at Canary Cove and you’re planning a reunion, family trip, or larger gathering, the Main House is yours to book. Start with your dates, check availability, and we’ll take it from there.'

export const heroImage = withTransform(
  'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1775486550/IMG_1579_ccfd1d.webp',
  'f_auto,q_auto,w_2200',
)

export const whatYouGetImage = withTransform(
  'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059648/BigPool2-400x284_dhswxv.webp',
  'f_auto,q_auto,w_1400,c_fill,g_auto',
)

export const returningGuestsImage = withTransform(
  'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059674/relax_drhybs.webp',
  'f_auto,q_auto,w_1400,c_fill,g_auto',
)

export const spaceMoments: SpaceMoment[] = [
  {
    alt: 'Poolside gathering space at Canary Cove',
    body: 'Settle into a shared rhythm by the water with your whole group in one place.',
    image: withTransform(
      'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059675/82_drinks_poolside-400x284_mhumdf.webp',
      'f_auto,q_auto,w_1200,c_fill,g_auto',
    ),
    layout: 'featured',
    title: 'Poolside',
  },
  {
    alt: 'Waterfront at Canary Cove Main House',
    body: 'The setting feels open and expansive while keeping everyone connected.',
    image: withTransform(
      'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059634/water_urwl5j.webp',
      'f_auto,q_auto,w_1000,c_fill,g_auto',
    ),
    layout: 'tall',
    title: 'Waterfront',
  },
  {
    alt: 'Outdoor grounds and shared spaces at Canary Cove',
    body: 'Outdoor gathering spaces that give the trip a calm, unhurried center.',
    image: withTransform(
      'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059652/IMG_2062_tm7q8a.webp',
      'f_auto,q_auto,w_1200,c_fill,g_auto',
    ),
    layout: 'wide',
    title: 'Grounds',
  },
  {
    alt: 'Main House pool and suites at Canary Cove',
    body: 'Five suites means everyone has their own space and one place to come back to.',
    image: withTransform(
      'https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059659/20170707_091152_lgqxsb.webp',
      'f_auto,q_auto,w_1200,c_fill,g_auto',
    ),
    layout: 'wide',
    title: 'Home Base',
  },
]
