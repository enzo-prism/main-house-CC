import { useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import {
  atGlance,
  bookingUrl,
  finalBody,
  finalHeading,
  heroImage,
  heroLocation,
  heroTitle,
  pricingIntro,
  pricingSeasons,
  returningGuestsImage,
  spaceMoments,
  summaryBody,
  summaryHeadline,
  whatYouGet,
  whatYouGetImage,
  whyReturningGuestsOnly,
} from './content'

const MOBILE_MEDIA_QUERY = '(max-width: 44rem)'

function subscribeToMobileViewport(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)
  const listener = () => callback()

  mediaQuery.addEventListener('change', listener)

  return () => mediaQuery.removeEventListener('change', listener)
}

function getMobileViewportSnapshot() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

type TextSectionProps = {
  body: string[]
  eyebrow?: string
  title: string
}

function TextSection({ body, eyebrow, title }: TextSectionProps) {
  return (
    <div className="copy-block">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title section-title-wide">{title}</h2>
      <div className="copy-stack">
        {body.map((paragraph) => (
          <p className="section-body" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

function App() {
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useSyncExternalStore(
    subscribeToMobileViewport,
    getMobileViewportSnapshot,
    () => false,
  )

  const sectionReveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: {
            opacity: 0,
            y: isMobile ? 20 : 30,
            scale: isMobile ? 0.995 : 0.985,
          },
          whileInView: {
            opacity: 1,
            y: 0,
            scale: 1,
          },
          viewport: {
            once: true,
            amount: isMobile ? 0.16 : 0.22,
            margin: isMobile ? '0px 0px -10% 0px' : '0px 0px -14% 0px',
          },
          transition: {
            delay,
            opacity: {
              duration: isMobile ? 0.34 : 0.42,
              ease: [0.32, 0.72, 0, 1] as const,
            },
            y: {
              type: 'spring' as const,
              stiffness: isMobile ? 180 : 150,
              damping: isMobile ? 28 : 24,
              mass: 0.82,
            },
            scale: {
              type: 'spring' as const,
              stiffness: isMobile ? 200 : 170,
              damping: isMobile ? 28 : 24,
              mass: 0.82,
            },
          },
        }

  const itemVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: {
          opacity: 0,
          y: isMobile ? 14 : 18,
          scale: 0.992,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            opacity: {
              duration: isMobile ? 0.28 : 0.34,
              ease: [0.32, 0.72, 0, 1] as const,
            },
            y: {
              type: 'spring' as const,
              stiffness: isMobile ? 210 : 180,
              damping: isMobile ? 30 : 26,
              mass: 0.8,
            },
            scale: {
              type: 'spring' as const,
              stiffness: isMobile ? 220 : 190,
              damping: isMobile ? 30 : 26,
              mass: 0.8,
            },
          },
        },
      }

  const staggerReveal = (delayChildren = 0, staggerChildren = isMobile ? 0.06 : 0.075) =>
    shouldReduceMotion
      ? {}
      : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: {
            once: true,
            amount: isMobile ? 0.14 : 0.18,
            margin: isMobile ? '0px 0px -8% 0px' : '0px 0px -10% 0px',
          },
          variants: {
            hidden: {},
            visible: {
              transition: {
                delayChildren,
                staggerChildren,
              },
            },
          },
        }

  const heroReveal = shouldReduceMotion
    ? {}
    : {
        initial: {
          opacity: 0,
          y: isMobile ? 10 : 16,
          scale: isMobile ? 0.996 : 0.988,
        },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: {
          opacity: {
            duration: isMobile ? 0.42 : 0.52,
            ease: [0.32, 0.72, 0, 1] as const,
          },
          y: {
            type: 'spring' as const,
            stiffness: isMobile ? 200 : 170,
            damping: isMobile ? 28 : 24,
            mass: 0.84,
          },
          scale: {
            type: 'spring' as const,
            stiffness: isMobile ? 210 : 180,
            damping: isMobile ? 28 : 24,
            mass: 0.84,
          },
        },
      }

  return (
    <div className="page-shell">
      <header className="hero" id="top">
        <nav className="topbar shell" aria-label="Main">
          <a className="brand-lockup" href="#top">
            <span className="brand-kicker">Canary Cove</span>
            <span className="brand-name">Main House</span>
          </a>

          <div className="topbar-links">
            <a href="#what-you-get">What you get</a>
            <a href="#pricing">Pricing</a>
            <a href="#ready">Ready</a>
          </div>
        </nav>

        <motion.div className="hero-stage" {...heroReveal}>
          <div className="hero-poster">
            <img
              alt="Canary Cove Main House on the Belize waterfront"
              className="hero-image"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              src={heroImage}
            />
            <div className="hero-overlay" />

            <div className="hero-title-wrap">
              <h1 className="hero-title">{heroTitle}</h1>
            </div>
          </div>
        </motion.div>
      </header>

      <main>
        <motion.section className="section summary-section shell" {...sectionReveal()}>
          <div className="summary-layout">
            <motion.div className="summary-copy" {...sectionReveal(0.04)}>
              <p className="eyebrow">{heroLocation}</p>
              <h2 className="summary-headline">{summaryHeadline}</h2>
              <p className="summary-lead">{summaryBody}</p>

              <div className="hero-actions summary-actions">
                <a className="button button-primary" href={bookingUrl}>
                  Check availability
                  <ArrowUpRight aria-hidden="true" size={18} />
                </a>
                <a className="button button-ghost-dark" href="#pricing">
                  See seasonal pricing
                </a>
              </div>
            </motion.div>

            <motion.div className="glance-section" {...staggerReveal(0.08)}>
              <p className="eyebrow">At a glance</p>
              <div className="glance-grid" aria-label="At a glance">
                {atGlance.map((item) => (
                  <motion.div className="glance-item" key={item} variants={itemVariants}>
                    <p>{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="section shell" id="what-you-get" {...sectionReveal()}>
          <div className="content-split">
            <motion.div {...sectionReveal(0.04)}>
              <TextSection body={whatYouGet} title="What you get" />
            </motion.div>

            <motion.figure className="editorial-figure" {...sectionReveal(0.1)}>
              <img alt="Pool and waterfront at Canary Cove Main House" src={whatYouGetImage} />
            </motion.figure>
          </div>
        </motion.section>

        <motion.section className="section section-soft" {...sectionReveal()}>
          <div className="shell content-split content-split-reverse">
            <motion.figure className="editorial-figure" {...sectionReveal(0.04)}>
              <img
                alt="Guests relaxing at the Canary Cove Main House"
                src={returningGuestsImage}
              />
            </motion.figure>

            <motion.div {...sectionReveal(0.1)}>
              <TextSection
                body={whyReturningGuestsOnly}
                title="Why returning guests only"
              />
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="section section-muted" id="pricing" {...sectionReveal()}>
          <div className="shell pricing-layout pricing-layout-single">
            <motion.div className="pricing-copy" {...sectionReveal(0.04)}>
              <TextSection body={[pricingIntro]} title="Seasonal pricing" />
            </motion.div>

            <motion.div className="pricing-panel" {...staggerReveal(0.08)}>
              {pricingSeasons.map(({ months, rate, season }) => (
                <motion.div className="pricing-row" key={season} variants={itemVariants}>
                  <div className="pricing-season-block">
                    <p className="pricing-season">{season}</p>
                    <p className="pricing-months">{months.join(', ')}</p>
                  </div>
                  <div className="pricing-rate-block">
                    <p className="pricing-rate">{rate}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="section shell" {...sectionReveal()}>
          <div className="space-intro">
            <p className="eyebrow">The space</p>
          </div>

          <motion.div className="gallery-grid" {...staggerReveal(0.05, isMobile ? 0.08 : 0.06)}>
            {spaceMoments.map((moment) => (
              <motion.figure
                className="gallery-card"
                data-layout={moment.layout}
                key={moment.title}
                variants={itemVariants}
              >
                <img alt={moment.alt} src={moment.image} />
                <figcaption className="space-card-copy">
                  <h3>{moment.title}</h3>
                  <p>{moment.body}</p>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className="section shell cta-section" id="ready" {...sectionReveal()}>
          <motion.div className="cta-panel" {...sectionReveal(0.04)}>
            <h2 className="section-title section-title-wide">{finalHeading}</h2>
            <p className="section-body cta-copy">{finalBody}</p>

            <div className="hero-actions">
              <a className="button button-primary" href={bookingUrl}>
                Check availability
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <a className="button button-ghost-dark" href="https://www.canarycove.com">
                View full Canary Cove
              </a>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  )
}

export default App
