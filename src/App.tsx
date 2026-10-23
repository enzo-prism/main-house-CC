import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { RevealObserver } from '@/components/motion/reveal-observer'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { BookingSteps, Closing } from '@/sections/book'
import { Estate, OfferMarquee } from '@/sections/estate'
import { Hero } from '@/sections/hero'
import { Statement, WhatYouGet } from '@/sections/offer'
import { Rates } from '@/sections/rates'
import { ReturningGuests } from '@/sections/returning'

export default function App() {
  return (
    <>
      <a
        href="#main-content"
        className="focus-ring fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-medium text-sand-light transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <Statement />
        <WhatYouGet />
        <OfferMarquee />
        <Estate />
        <ReturningGuests />
        <Rates />
        <BookingSteps />
        <Closing />
      </main>
      <Footer />
      <RevealObserver />
      <SmoothScroll />
    </>
  )
}
