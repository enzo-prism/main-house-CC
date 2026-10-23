import type { CSSProperties } from 'react'

import { COVE_URL, SITE_URL, bookingUrl, contactUrl, phones } from '@/content'
import { BrandMark } from './brand'
import { LocalTime } from './motion/local-time'

const FOOTER_GROUPS = [
  {
    title: 'Stay',
    links: [
      { href: `${COVE_URL}/stay`, label: 'The Villa' },
      { href: `${SITE_URL}/`, label: 'Main House', current: true },
      { href: `${COVE_URL}/rates`, label: 'Rates' },
      { href: bookingUrl, label: 'Book' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { href: `${COVE_URL}/experiences`, label: 'Experiences' },
      { href: `${COVE_URL}/dining`, label: 'Dining' },
      { href: `${COVE_URL}/adventures`, label: 'Adventures' },
      { href: `${COVE_URL}/gallery`, label: 'Gallery' },
    ],
  },
  {
    title: 'Plan',
    links: [
      { href: `${COVE_URL}/reviews`, label: 'Reviews' },
      { href: `${COVE_URL}/getting-here`, label: 'Getting Here' },
      { href: contactUrl, label: 'Contact' },
      { href: 'https://www.facebook.com/CanaryCove/', label: 'Facebook' },
    ],
  },
] as const

const linkClass =
  'link-underline inline-flex min-h-11 items-center text-[15px] text-reef-foreground/75 transition-colors duration-300 hover:text-reef-foreground pointer-fine:min-h-0'

/** The Canary Cove reef footer (canary-cove-alpha components/footer.tsx). */
export function Footer() {
  return (
    <footer className="surface-reef relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-20 sm:pt-24 lg:pt-28">
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,0.7fr)] lg:gap-10">
          <div className="flow flow-md text-[15px] text-reef-foreground/75">
            <BrandMark tone="light" height={120} className="h-[104px] self-start sm:h-[120px]" />
            <p className="max-w-sm leading-relaxed">
              The Main House at Canary Cove: five suites on Ambergris Caye, Belize, reserved for returning groups.
            </p>
            <p className="tabular text-[13px] uppercase tracking-[0.16em] text-reef-foreground/60">
              17° 59.914′ N · 87° 54.901′ W
            </p>
            <ul className="flow flow-xs">
              {phones.map((phone) => (
                <li key={phone.href}>
                  {phone.label}:{' '}
                  <a href={phone.href} className={linkClass}>
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-reef-foreground/60">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-canary" />
              Local time <LocalTime className="text-white" />
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={`${group.title} links`} className="flow flow-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-reef-foreground/55">{group.title}</p>
              <ul className="flow gap-0 sm:gap-3.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={'current' in link && link.current ? 'page' : undefined}
                      className={linkClass}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* The canary from the official logo, as a faint silhouette perched on
          the footer's lower edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 right-[-4vw] w-[min(560px,62vw)] select-none sm:-bottom-10">
        <div data-reveal="up" style={{ '--reveal-delay': '200ms' } as CSSProperties}>
          <img src="/brand/canary-cove-bird-silhouette-light.svg" alt="" className="w-full opacity-[0.06]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-3 px-[var(--gutter)] pb-10 pt-6 text-xs text-reef-foreground/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Canary Cove. All rights reserved.</p>
        <div className="flex gap-5">
          <a href={`${COVE_URL}/privacy`} className="link-underline inline-flex min-h-11 items-center hover:text-white pointer-fine:min-h-0">
            Privacy
          </a>
          <a href={`${COVE_URL}/terms`} className="link-underline inline-flex min-h-11 items-center hover:text-white pointer-fine:min-h-0">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
