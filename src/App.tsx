import { useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import {
  bookingUrl,
  finalNotes,
  galleryMoments,
  heroImage,
  heroLocation,
  heroQualifier,
  heroStats,
  heroSummary,
  heroTitle,
  layoutDetails,
  overviewImage,
  pricingImage,
  pricingSeasons,
  timeline,
} from './content'

type SectionIntroProps = {
  eyebrow: string
  title: string
  body: string
}

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

function SectionIntro({ eyebrow, title, body }: SectionIntroProps) {
  return (
    <div className="section-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <p className="section-body">{body}</p>
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
            <a href="#overview">Overview</a>
            <a href="#pricing">Pricing</a>
            <a href="#fit">Fit</a>
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
              <p className="summary-tag">{heroQualifier}</p>
              <p className="summary-lead">{heroSummary}</p>

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

            <motion.dl
              className="summary-stats"
              aria-label="Main house summary facts"
              {...staggerReveal(0.08)}
            >
              {heroStats.map((item) => (
                <motion.div className="summary-stat" key={item.label} variants={itemVariants}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </motion.section>

        <motion.section className="section shell" id="overview" {...sectionReveal()}>
          <SectionIntro
            eyebrow="The setup"
            title="The full configuration for groups already returning together."
            body="Once the trip is already a yes, the main house becomes the larger shared base rather than the first place to explain the whole offer."
          />

          <div className="overview-grid">
            <motion.div className="overview-copy" {...sectionReveal(0.04)}>
              <p className="statement">
                This is the bigger configuration for guests already committed to
                coming back together.
              </p>

              <motion.ul
                className="feature-list"
                aria-label="Main house setup details"
                {...staggerReveal(0.06)}
              >
                {layoutDetails.map(({ body, icon: Icon, title }) => (
                  <motion.li className="feature-item" key={title} variants={itemVariants}>
                    <span className="feature-icon">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.figure className="editorial-figure" {...sectionReveal(0.1)}>
              <img alt="Path leading toward the Canary Cove Main House" src={overviewImage} />
              <figcaption>
                The larger main-house setup is positioned as one familiar base for
                the whole group, not a smaller exploratory stay.
              </figcaption>
            </motion.figure>
          </div>
        </motion.section>

        <motion.section className="section section-muted" id="pricing" {...sectionReveal()}>
          <div className="shell pricing-layout">
            <motion.div className="pricing-copy" {...sectionReveal(0.04)}>
              <SectionIntro
                eyebrow="Seasonal nightly pricing"
                title="The travel month sets the nightly rate."
                body="Once the group knows its timing, the pricing structure is straightforward. Low, high, and peak months each have their own nightly rate for the full 5-suite main house."
              />

              <p className="pricing-note">
                Repeat guests only. Best for reunions and larger family groups that
                already know they want the estate as one home base.
              </p>

              <a className="inline-link" href={bookingUrl}>
                Start with your dates
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            </motion.div>

            <div className="pricing-content">
              <motion.div
                className="pricing-panel"
                aria-label="Main house seasonal pricing"
                {...staggerReveal(0.06)}
              >
                {pricingSeasons.map(({ months, rate, season }) => (
                  <motion.div className="pricing-row" key={season} variants={itemVariants}>
                    <div className="pricing-season-block">
                      <p className="pricing-season">{season}</p>
                      <p className="pricing-months">{months.join(' · ')}</p>
                    </div>
                    <div className="pricing-rate-block">
                      <p className="pricing-rate-label">5 Suites</p>
                      <p className="pricing-rate">{rate}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.figure className="editorial-figure pricing-figure" {...sectionReveal(0.12)}>
                <img alt="Guests relaxing at Canary Cove" src={pricingImage} />
                <figcaption>
                  This offer is for groups already returning with enough clarity to
                  book the full main-house setup.
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </motion.section>

        <motion.section className="section shell" {...sectionReveal()}>
          <SectionIntro
            eyebrow="How the estate supports the group"
            title="One home base, enough room for the full return trip."
            body="The visual appeal still matters, but the main story now is clarity: a larger-group setup, a familiar place to come back to, and a cleaner way to anchor the whole stay."
          />

          <motion.div className="gallery-grid" {...staggerReveal(0.05, isMobile ? 0.08 : 0.06)}>
            {galleryMoments.map((moment) => (
              <motion.figure
                className="gallery-card"
                data-layout={moment.layout}
                key={moment.title}
                variants={itemVariants}
              >
                <img alt={moment.alt} src={moment.image} />
                <figcaption>
                  <span>{moment.label}</span>
                  <strong>{moment.title}</strong>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className="section section-soft" {...sectionReveal()}>
          <div className="shell">
            <SectionIntro
              eyebrow="How the offer is framed"
              title="Specific by design, not generic by default."
              body="This page should read like a repeat-guest accommodations path. The 5-suite setup, the seasonal rates, and the reunion-family fit all work together."
            />

            <motion.ol
              className="timeline"
              aria-label="How the offer is structured"
              {...staggerReveal(0.06)}
            >
              {timeline.map((step) => (
                <motion.li className="timeline-step" key={step.title} variants={itemVariants}>
                  <span className="timeline-number">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </motion.section>

        <motion.section className="section shell nuance-section" id="fit" {...sectionReveal()}>
          <motion.div className="nuance-copy" {...sectionReveal(0.04)}>
            <p className="eyebrow">Worth knowing</p>
            <h2 className="section-title">
              Five suites, returning groups, and a larger-group fit are the point.
            </h2>
            <p className="section-body">
              The narrower positioning makes the offer clearer. This is not meant to
              read like a broad first-time booking page, but like the right option
              for a group already coming back together.
            </p>
          </motion.div>

          <motion.div className="nuance-notes" {...staggerReveal(0.08)}>
            {finalNotes.map((note) => (
              <motion.div className="nuance-note" key={note.title} variants={itemVariants}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className="section shell cta-section" {...sectionReveal()}>
          <motion.div className="cta-panel" {...sectionReveal(0.04)}>
            <p className="eyebrow">Plan the stay</p>
            <h2 className="section-title">
              If your group is coming back for the full 5-suite setup, start here.
            </h2>
            <p className="section-body">
              Use the season table as the first pricing reference, then bring your
              dates to Canary Cove for availability on the main house.
            </p>

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
