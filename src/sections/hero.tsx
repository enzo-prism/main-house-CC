import type { CSSProperties } from 'react'

import { BrandBird } from '@/components/brand'
import { CldImage } from '@/components/cld-image'
import { CtaLink } from '@/components/cta-link'
import { Parallax } from '@/components/motion/parallax'
import { SplitText } from '@/components/motion/split-text'
import { PHOTOS, bookingUrl, heroEyebrow, heroFacts, heroLede, heroTitle } from '@/content'

const delay = (ms: number) => ({ '--enter-delay': `${ms}ms` }) as CSSProperties

const PAGE_ANCHORS = [
  { label: 'The house', href: '#what-you-get' },
  { label: 'Outside', href: '#the-estate' },
  { label: 'Inside', href: '#inside' },
  { label: 'Returning guests', href: '#returning-guests' },
  { label: 'Rates', href: '#pricing' },
  { label: 'Book', href: '#book' },
] as const

/**
 * Split hero in the shape of the Cove's /stay opener (PageHero variant
 * "split"): copy and glance facts left, arched photograph of the Main House
 * right with a scroll-turned badge. Every entrance is a CSS keyframe, so it
 * plays from the prerendered HTML before hydration.
 */
export function Hero() {
  return (
    <section className="relative pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-28 lg:pt-20">
      <div className="mx-auto w-full max-w-[1320px] px-[var(--gutter)]">
        {/* Phones read title → photograph → details; from lg the copy sits
            left of the arch, vertically centred against it. */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-[1fr_auto] lg:gap-x-20 lg:gap-y-0">
          <div className="flow flow-lg max-w-xl lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="eyebrow enter-fade" style={delay(80)}>
              {heroEyebrow}
            </p>
            <SplitText as="h1" mode="enter" delay={140} text={heroTitle} className="text-hero lg:text-[clamp(4rem,7.4vw,8rem)]" />
          </div>

          <div className="relative mx-auto w-full max-w-[34rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center">
            <div className="media-frame arch enter-clip relative aspect-[4/5] w-full" style={delay(260)} data-testid="hero-image">
              <Parallax amount={7}>
                <CldImage photo={PHOTOS.house} priority sizes="(min-width: 1024px) 45vw, (min-width: 640px) 34rem, 100vw" />
              </Parallax>
            </div>
            <div
              aria-hidden="true"
              className="enter-fade absolute -left-3 bottom-8 h-24 w-24 rounded-full bg-sand p-1.5 shadow-[var(--shadow-subtle)] sm:-left-8 sm:h-32 sm:w-32 lg:-left-12"
              style={delay(900)}
            >
              <svg viewBox="0 0 100 100" className="spin-scroll h-full w-full">
                <defs>
                  <path id="hero-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-ink text-[8.6px] font-semibold uppercase tracking-[0.3em]">
                  <textPath href="#hero-ring">Five suites · Returning guests ·</textPath>
                </text>
              </svg>
              <BrandBird height={26} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flow flow-xl lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-8">
            <div className="flow flow-lg max-w-xl">
              <p className="text-lede enter-up max-w-[34rem]" style={delay(420)}>
                {heroLede}
              </p>
              <div className="enter-up flex flex-wrap items-center gap-x-5 gap-y-3" style={delay(500)}>
                <CtaLink href={bookingUrl} size="lg" arrow="diag" data-testid="hero-book">
                  Check availability
                </CtaLink>
                <CtaLink href="#pricing" variant="text">
                  Seasonal rates
                </CtaLink>
              </div>
              <nav aria-label="On this page" className="enter-up -mx-[var(--gutter)] sm:mx-0 sm:-ml-2" style={delay(560)}>
                <ul className="no-scrollbar flex w-0 min-w-full gap-2 overflow-x-auto px-[var(--gutter)] py-1 text-sm sm:w-auto sm:flex-wrap sm:gap-0 sm:overflow-visible sm:px-0 sm:py-0">
                  {PAGE_ANCHORS.map((anchor, index) => (
                    <li key={anchor.href} className="shrink-0">
                      <a
                        href={anchor.href}
                        className="focus-ring inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/15 px-4 text-foreground/80 transition-colors hover:border-ink/40 hover:text-foreground sm:border-transparent sm:px-2 sm:hover:border-transparent"
                      >
                        <span aria-hidden="true" className="tabular text-[10px] text-muted-foreground">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="link-underline">{anchor.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <dl
              className="enter-up grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border/80 pt-6 sm:grid-cols-4"
              style={delay(620)}
              data-testid="hero-facts"
            >
              {heroFacts.map((fact) => (
                <div key={fact.label} className="flow flow-xs">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{fact.label}</dt>
                  <dd className="font-display text-2xl leading-none text-foreground">
                    {fact.value}
                    {fact.note ? <span className="ml-1.5 font-sans text-xs text-muted-foreground">{fact.note}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

        </div>
      </div>
    </section>
  )
}
