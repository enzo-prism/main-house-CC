import { useEffect, useId, useRef, useState } from 'react'
import {
  BedDouble,
  Calendar,
  ChevronDown,
  Compass,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Tag,
  X,
} from 'lucide-react'

const COVE_ORIGIN = 'https://www.canarycove.com'

type CoveLink = {
  caption?: string
  href: string
  label: string
}

type CoveCta = CoveLink & {
  variant: 'primary' | 'outline'
}

const navLinks: CoveLink[] = [
  { label: 'Stay', href: `${COVE_ORIGIN}/stay` },
  { label: 'Rates', href: `${COVE_ORIGIN}/rates` },
  { label: 'Reviews', href: `${COVE_ORIGIN}/about` },
  { label: 'Getting Here', href: `${COVE_ORIGIN}/getting-here` },
]

const exploreItems: CoveLink[] = [
  {
    caption: 'Water, land, and dock days',
    href: `${COVE_ORIGIN}/experiences`,
    label: 'Experiences',
  },
  {
    caption: 'Private chef service',
    href: `${COVE_ORIGIN}/dining`,
    label: 'Dining',
  },
  {
    caption: 'Reef, fishing, and day trips',
    href: `${COVE_ORIGIN}/adventures`,
    label: 'Adventures',
  },
  {
    caption: 'Every photograph of the estate',
    href: `${COVE_ORIGIN}/gallery`,
    label: 'Gallery',
  },
]

const navCtas: CoveCta[] = [
  { label: 'Book', href: `${COVE_ORIGIN}/book`, variant: 'primary' },
  { label: 'Contact', href: `${COVE_ORIGIN}/contact`, variant: 'outline' },
]

const footerLinks: CoveLink[] = [
  { label: 'Stay', href: `${COVE_ORIGIN}/stay` },
  { label: 'Rates', href: `${COVE_ORIGIN}/rates#main-house-accommodations` },
  { label: 'Experiences', href: `${COVE_ORIGIN}/experiences` },
  { label: 'Dining', href: `${COVE_ORIGIN}/dining` },
  { label: 'Adventures', href: `${COVE_ORIGIN}/adventures` },
  { label: 'Reviews', href: `${COVE_ORIGIN}/about` },
  { label: 'Getting Here', href: `${COVE_ORIGIN}/getting-here` },
  { label: 'Book', href: `${COVE_ORIGIN}/book` },
  { label: 'Contact', href: `${COVE_ORIGIN}/contact` },
]

const navIcons = {
  Stay: BedDouble,
  Rates: Tag,
  Explore: Compass,
  Reviews: MessageSquare,
  'Getting Here': MapPin,
  Book: Calendar,
  Contact: Mail,
} as const

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a
      aria-label="Canary Cove home"
      className={compact ? 'brand-mark brand-mark-compact' : 'brand-mark'}
      href={`${COVE_ORIGIN}/`}
    >
      <span aria-hidden="true" className="brand-dot" />
      <span className="brand-text">
        <span className="brand-name">Canary Cove</span>
        <span className="brand-location">Ambergris Caye, Belize</span>
      </span>
    </a>
  )
}

function NavIcon({ label }: { label: string }) {
  const Icon = navIcons[label as keyof typeof navIcons]

  if (!Icon) {
    return null
  }

  return <Icon aria-hidden="true" className="nav-icon" size={14} />
}

function CtaLink({
  item,
  onClick,
}: {
  item: CoveCta
  onClick?: () => void
}) {
  return (
    <a
      className={item.variant === 'primary' ? 'nav-cta nav-cta-primary' : 'nav-cta nav-cta-outline'}
      href={item.href}
      onClick={onClick}
    >
      <NavIcon label={item.label} />
      <span>{item.label}</span>
    </a>
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const menuId = useId()
  const exploreMenuId = useId()
  const exploreRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!exploreOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExploreOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [exploreOpen])

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <BrandMark compact />

        <nav aria-label="Primary navigation" className="desktop-nav">
          <ul className="desktop-nav-pills">
            {navLinks.slice(0, 2).map((item) => (
              <li key={item.label}>
                <a className="desktop-nav-link" href={item.href}>
                  <span className="nav-icon-wrap">
                    <NavIcon label={item.label} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            ))}

            <li className="explore-item" ref={exploreRef}>
              <button
                aria-controls={exploreMenuId}
                aria-expanded={exploreOpen}
                className="desktop-nav-link explore-trigger"
                onClick={() => setExploreOpen((open) => !open)}
                type="button"
              >
                <span className="nav-icon-wrap">
                  <NavIcon label="Explore" />
                </span>
                <span className="nav-label">
                  Explore
                  <ChevronDown aria-hidden="true" className="explore-chevron" size={12} />
                </span>
              </button>

              {exploreOpen ? (
                <div className="explore-menu" id={exploreMenuId} role="menu">
                  {exploreItems.map((item) => (
                    <a href={item.href} key={item.label} role="menuitem">
                      <span className="explore-menu-label">{item.label}</span>
                      {item.caption ? <span className="explore-menu-caption">{item.caption}</span> : null}
                    </a>
                  ))}
                </div>
              ) : null}
            </li>

            {navLinks.slice(2).map((item) => (
              <li key={item.label}>
                <a className="desktop-nav-link" href={item.href}>
                  <span className="nav-icon-wrap">
                    <NavIcon label={item.label} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="desktop-nav-ctas">
            {navCtas.map((item) => (
              <CtaLink item={item} key={item.label} />
            ))}
          </div>
        </nav>

        <button
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="mobile-nav-panel" id={menuId}>
          <nav aria-label="Primary navigation">
            <ul className="mobile-nav-links">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={() => setMenuOpen(false)}>
                    <NavIcon label={item.label} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
              {exploreItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={() => setMenuOpen(false)}>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mobile-nav-ctas">
              {navCtas.map((item) => (
                <CtaLink item={item} key={item.label} onClick={() => setMenuOpen(false)} />
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-copy">
            <p className="site-footer-eyebrow">Canary Cove</p>
            <h2 className="site-footer-heading">Private Belize estate.</h2>
            <p>Fully staffed beachfront stay on Ambergris Caye. One booking at a time.</p>
            <p>17&apos; 59.914 NORTH - 87&apos; 54.901 WEST</p>
            <p>Call Gil: 011 501-610-5121 - Consi: 011 501-626-7534</p>
          </div>

          <div className="site-footer-links">
            {footerLinks.map((item) => (
              <a href={item.href} key={item.label}>
                {item.label}
              </a>
            ))}
            <a
              href="https://www.facebook.com/CanaryCove/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Facebook
            </a>
          </div>
        </div>

        <div className="site-footer-legal">
          <p>&copy; {new Date().getFullYear()} Canary Cove. All rights reserved.</p>
          <div className="site-footer-legal-links">
            <a href={`${COVE_ORIGIN}/privacy`}>Privacy</a>
            <a href={`${COVE_ORIGIN}/terms`}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
