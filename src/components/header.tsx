import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { BOOK_HREF, NAV_ITEMS } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { BrandMark } from './brand'
import { DesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'
import { LocalTime } from './motion/local-time'
import { ScrollProgress } from './motion/scroll-progress'

/**
 * The Canary Cove site header (canary-cove-alpha components/header.tsx):
 * sticky sand bar that shrinks on scroll, Stay/Explore mega dropdowns, Book
 * pill with a canary arrow chip, full-screen menu below 1024px. Book goes to
 * the Cove booking form with Main House preselected.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    // Hysteresis: shrink past 32px, expand again below 8px.
    const onScroll = () => setScrolled((prev) => (prev ? window.scrollY > 8 : window.scrollY > 32))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Anchor targets and anything pinned below the header read the live height.
  useEffect(() => {
    const element = headerRef.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const publish = () =>
      document.documentElement.style.setProperty('--site-header-height', `${Math.round(element.getBoundingClientRect().height)}px`)
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.dataset.mobileNavOpen = 'true'
    else delete document.body.dataset.mobileNavOpen
    return () => {
      delete document.body.dataset.mobileNavOpen
    }
  }, [mobileOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeAtDesktop = () => {
      if (desktop.matches) setMobileOpen(false)
    }
    desktop.addEventListener('change', closeAtDesktop)
    return () => desktop.removeEventListener('change', closeAtDesktop)
  }, [])

  return (
    <header
      ref={headerRef}
      // The bar shrinks after scrolling and gains a matching bottom margin on
      // the same curve, so its layout footprint never changes (no scroll
      // anchoring fight near the top of the page).
      className={cn(
        'sticky top-0 z-50 border-b border-border/70 bg-sand-light/95 backdrop-blur-xl backdrop-saturate-150 transition-[margin] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none',
        scrolled ? 'mb-3 lg:mb-4' : 'mb-0',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1440px] items-center gap-3 px-4 transition-[min-height] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none sm:px-6 lg:gap-6 lg:px-10',
          scrolled ? 'min-h-[60px] lg:min-h-[64px]' : 'min-h-[72px] lg:min-h-[80px]',
        )}
      >
        <div
          data-testid="site-brand"
          className={cn(
            'shrink-0 transition-[height] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none',
            scrolled ? 'h-[46px] lg:h-[50px]' : 'h-[54px] lg:h-[62px]',
          )}
        >
          <BrandMark height={62} className="h-full" />
        </div>
        <DesktopNav items={NAV_ITEMS} />

        <div className="ml-auto flex items-center gap-2">
          <p className="mr-2 hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground 2xl:flex">
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
            </span>
            Ambergris Caye <LocalTime className="text-foreground" />
          </p>
          <a
            href={BOOK_HREF}
            className="group focus-ring hidden h-10 items-center gap-2 rounded-full bg-ink pl-5 pr-1.5 text-sm font-medium text-sand-light transition-colors duration-500 hover:bg-lagoon motion-safe:active:scale-[0.97] lg:inline-flex"
          >
            <span className="roll">
              <span>Book</span>
              <span aria-hidden="true">Book</span>
            </span>
            <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-canary text-ink">
              <svg viewBox="0 0 16 16" className="arrow-nudge h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
          <a
            href={BOOK_HREF}
            className="focus-ring inline-flex h-11 items-center rounded-full border border-ink/15 px-4 text-sm font-medium text-ink transition-colors hover:border-ink sm:px-5 lg:hidden"
          >
            Book
          </a>
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open navigation menu"
                className="group focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sand-light transition-colors hover:bg-lagoon lg:hidden"
              >
                <span aria-hidden="true" className="flex w-[18px] flex-col items-end gap-[5px]">
                  <span className="h-[1.5px] w-full rounded-full bg-current" />
                  <span className="h-[1.5px] w-3/5 rounded-full bg-current transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-full" />
                </span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content
                aria-describedby={undefined}
                onOpenAutoFocus={(event) => {
                  event.preventDefault()
                  closeRef.current?.focus()
                }}
                className="nav-sheet fixed inset-0 z-[80] flex flex-col bg-sand px-5 outline-none sm:px-8"
              >
                <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
                <div className="flex h-[72px] shrink-0 items-center justify-between gap-3">
                  <BrandMark height={50} className="h-[50px]" />
                  <Dialog.Close asChild>
                    <button
                      ref={closeRef}
                      type="button"
                      aria-label="Close navigation menu"
                      className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border bg-sand-light text-foreground transition-colors hover:bg-ink hover:text-sand-light"
                    >
                      <X className="h-5 w-5 transition-transform duration-500 ease-[var(--ease-out-expo)] motion-safe:hover:rotate-90" />
                    </button>
                  </Dialog.Close>
                </div>
                <MobileNav items={NAV_ITEMS} onNavigate={() => setMobileOpen(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <ScrollProgress className="absolute inset-x-0 -bottom-px" />
    </header>
  )
}
