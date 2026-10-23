import { COVE_URL, PHOTOS, SITE_URL, bookingUrl, contactUrl } from '@/content'
import { cld } from '@/lib/cloudinary'

// Mirrors NAV_ITEMS in canary-cove-alpha/lib/nav-items.ts so the Main House
// header is the Cove header. Cove pages are absolute links; the Main House row
// is this site and is marked current.

export type DropdownItem = {
  label: string
  href: string
  caption: string
  image: string
  current?: boolean
}

export type NavItem =
  | { type: 'link'; label: string; href: string }
  | { type: 'dropdown'; label: string; href: string; items: DropdownItem[] }

const coveImage = (src: string) => cld(src, 480)

export const NAV_ITEMS: NavItem[] = [
  {
    type: 'dropdown',
    label: 'Stay',
    href: `${COVE_URL}/stay`,
    items: [
      {
        label: 'The Villa',
        href: `${COVE_URL}/stay`,
        caption: 'Three suites, pool, and grounds',
        image: coveImage('https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767202762/canarycove-haydeelustudio-59_x8gmzo.webp'),
      },
      {
        label: 'Main House',
        href: `${SITE_URL}/`,
        caption: 'Returning guests',
        image: coveImage(PHOTOS.house.src),
        current: true,
      },
      {
        label: 'Rates',
        href: `${COVE_URL}/rates`,
        caption: 'Seasons, suites, and inclusions',
        image: coveImage('https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059677/outside_sq8dvn.webp'),
      },
    ],
  },
  {
    type: 'dropdown',
    label: 'Explore',
    href: `${COVE_URL}/experiences`,
    items: [
      {
        label: 'Experiences',
        href: `${COVE_URL}/experiences`,
        caption: 'Water, land, and dock days',
        image: coveImage('https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059673/IMG_2080_stdy3b.webp'),
      },
      {
        label: 'Dining',
        href: `${COVE_URL}/dining`,
        caption: 'Private chef service',
        image: coveImage('https://res.cloudinary.com/dhqpqfw6w/image/upload/v1785546987/canarycove-gil2026-cfb8d7ac.jpg'),
      },
      {
        label: 'Adventures',
        href: `${COVE_URL}/adventures`,
        caption: 'Reef, fishing, and day trips',
        image: coveImage('https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059665/Don-LIstwin-Turtles-Fish_800x532-768x511_zwoetm.webp'),
      },
      {
        label: 'Gallery',
        href: `${COVE_URL}/gallery`,
        caption: 'Every photograph of the estate',
        image: coveImage('https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059675/canarycove-haydeelustudio-32-scaled_forayc.webp'),
      },
    ],
  },
  { type: 'link', label: 'Reviews', href: `${COVE_URL}/reviews` },
  { type: 'link', label: 'Getting Here', href: `${COVE_URL}/getting-here` },
  { type: 'link', label: 'Contact', href: contactUrl },
]

export const BOOK_HREF = bookingUrl
