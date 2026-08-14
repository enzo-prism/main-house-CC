import { useEffect, useId, useState } from 'react'
import {
  BedDouble,
  Calendar,
  Compass,
  Home,
  Images,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Utensils,
  Waves,
  X,
} from 'lucide-react'

const COVE_ORIGIN = 'https://www.canarycove.com'

type CoveLink = {
  href: string
  label: string
}

type CoveCta = CoveLink & {
  variant: 'primary' | 'outline'
}

const navLinks: CoveLink[] = [
  { label: 'Home', href: `${COVE_ORIGIN}/` },
  { label: 'Stay', href: `${COVE_ORIGIN}/stay` },
  { label: 'Gallery', href: `${COVE_ORIGIN}/gallery` },
  { label: 'Experience', href: `${COVE_ORIGIN}/experiences` },
  { label: 'Dining', href: `${COVE_ORIGIN}/dining` },
  { label: 'Adventures', href: `${COVE_ORIGIN}/adventures` },
  { label: 'Reviews', href: `${COVE_ORIGIN}/about` },
  { label: 'Getting Here', href: `${COVE_ORIGIN}/getting-here` },
]

const navCtas: CoveCta[] = [
  { label: 'Book', href: `${COVE_ORIGIN}/book`, variant: 'primary' },
  { label: 'Contact', href: `${COVE_ORIGIN}/contact`, variant: 'outline' },
]

const footerLinks: CoveLink[] = [
  { label: 'Stay', href: `${COVE_ORIGIN}/stay` },
  { label: 'Experiences', href: `${COVE_ORIGIN}/experiences` },
  { label: 'Dining', href: `${COVE_ORIGIN}/dining` },
  { label: 'Adventures', href: `${COVE_ORIGIN}/adventures` },
  { label: 'Reviews', href: `${COVE_ORIGIN}/about` },
  { label: 'Book', href: `${COVE_ORIGIN}/book` },
  { label: 'Contact', href: `${COVE_ORIGIN}/contact` },
]

const navIcons = {
  Home,
  Stay: BedDouble,
  Gallery: Images,
  Experience: Compass,
  Dining: Utensils,
  Adventures: Waves,
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

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

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

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <BrandMark compact />

        <nav aria-label="Primary navigation" className="desktop-nav">
          <ul className="desktop-nav-pills">
            {navLinks.map((item) => (
              <li key={item.label}>
                <a className="desktop-nav-link" href={item.href}>
                  <NavIcon label={item.label} />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="desktop-nav-ctas">
            {navCtas.map((item) => (
              <a
                className={
                  item.variant === 'primary' ? 'nav-cta nav-cta-primary' : 'nav-cta nav-cta-outline'
                }
                href={item.href}
                key={item.label}
              >
                <NavIcon label={item.label} />
                <span>{item.label}</span>
              </a>
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
            </ul>

            <div className="mobile-nav-ctas">
              {navCtas.map((item) => (
                <a
                  className={
                    item.variant === 'primary' ? 'nav-cta nav-cta-primary' : 'nav-cta nav-cta-outline'
                  }
                  href={item.href}
                  key={item.label}
                  onClick={() => setMenuOpen(false)}
                >
                  <NavIcon label={item.label} />
                  <span>{item.label}</span>
                </a>
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
