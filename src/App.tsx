import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import {
  bookingUrl,
  finalNotes,
  galleryMoments,
  heroImage,
  heroStats,
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
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.24], [1, 1.03])
  const heroY = useTransform(scrollYProgress, [0, 0.24], [0, 44])

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: {
            duration: 0.56,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-media">
          <motion.img
            alt="Canary Cove Main House on the Belize waterfront"
            className="hero-image"
            decoding="async"
            fetchPriority="high"
            loading="eager"
            src={heroImage}
            style={shouldReduceMotion ? undefined : { scale: heroScale, y: heroY }}
          />
          <div className="hero-overlay" />
        </div>

        <div className="hero-inner">
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

            <a className="button button-secondary topbar-cta" href={bookingUrl}>
              Check availability
            </a>
          </nav>

          <div className="hero-content shell" id="top">
            <motion.p className="eyebrow hero-eyebrow" {...reveal()}>
              Ambergris Caye, Belize
            </motion.p>

            <motion.p className="hero-tag" {...reveal(0.04)}>
              Repeat guests only
            </motion.p>

            <motion.h1 className="hero-title" {...reveal(0.08)}>
              The 5-suite Main House for returning groups.
            </motion.h1>

            <motion.p className="hero-copy" {...reveal(0.16)}>
              Reserved for reunions and larger family groups that already know they
              want the full Canary Cove estate flowing as one home base.
            </motion.p>

            <motion.div className="hero-actions" {...reveal(0.24)}>
              <a className="button button-primary" href={bookingUrl}>
                Check availability
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <a className="button button-ghost" href="#pricing">
                See seasonal pricing
              </a>
            </motion.div>

            <motion.dl className="hero-stats" {...reveal(0.32)}>
              {heroStats.map((item) => (
                <div className="hero-stat" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </header>

      <main>
        <motion.section className="section shell" id="overview" {...reveal()}>
          <SectionIntro
            eyebrow="The full main house option"
            title="Reserved for groups coming back for the whole 5-suite setup."
            body="This is the larger Canary Cove configuration for returning guests who want the estate functioning as one shared home base for a reunion or larger family stay."
          />

          <div className="overview-grid">
            <div className="overview-copy">
              <p className="statement">
                Not the first-time stay path. The main house arrangement for groups
                already sure they want Canary Cove together.
              </p>

              <ul className="feature-list" aria-label="Main house setup details">
                {layoutDetails.map(({ body, icon: Icon, title }) => (
                  <li className="feature-item" key={title}>
                    <span className="feature-icon">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="editorial-figure">
              <img alt="Path leading toward the Canary Cove Main House" src={overviewImage} />
              <figcaption>
                The larger main-house setup is positioned as one familiar base for
                the whole group, not a smaller exploratory stay.
              </figcaption>
            </figure>
          </div>
        </motion.section>

        <motion.section className="section section-muted" id="pricing" {...reveal()}>
          <div className="shell pricing-layout">
            <div className="pricing-copy">
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
            </div>

            <div className="pricing-content">
              <div className="pricing-panel" aria-label="Main house seasonal pricing">
                {pricingSeasons.map(({ months, rate, season }) => (
                  <div className="pricing-row" key={season}>
                    <div className="pricing-season-block">
                      <p className="pricing-season">{season}</p>
                      <p className="pricing-months">{months.join(' · ')}</p>
                    </div>
                    <div className="pricing-rate-block">
                      <p className="pricing-rate-label">5 Suites</p>
                      <p className="pricing-rate">{rate}</p>
                    </div>
                  </div>
                ))}
              </div>

              <figure className="editorial-figure pricing-figure">
                <img alt="Guests relaxing at Canary Cove" src={pricingImage} />
                <figcaption>
                  This offer is for groups already returning with enough clarity to
                  book the full main-house setup.
                </figcaption>
              </figure>
            </div>
          </div>
        </motion.section>

        <motion.section className="section shell" {...reveal()}>
          <SectionIntro
            eyebrow="How the estate supports the group"
            title="One home base, enough room for the full return trip."
            body="The visual appeal still matters, but the main story now is clarity: a larger-group setup, a familiar place to come back to, and a cleaner way to anchor the whole stay."
          />

          <div className="gallery-grid">
            {galleryMoments.map((moment, index) => (
              <motion.figure
                className="gallery-card"
                data-layout={moment.layout}
                key={moment.title}
                {...reveal(index * 0.06)}
              >
                <img alt={moment.alt} src={moment.image} />
                <figcaption>
                  <span>{moment.label}</span>
                  <strong>{moment.title}</strong>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>

        <motion.section className="section section-soft" {...reveal()}>
          <div className="shell">
            <SectionIntro
              eyebrow="How the offer is framed"
              title="Specific by design, not generic by default."
              body="This page should read like a repeat-guest accommodations path. The 5-suite setup, the seasonal rates, and the reunion-family fit all work together."
            />

            <ol className="timeline" aria-label="How the offer is structured">
              {timeline.map((step) => (
                <li className="timeline-step" key={step.title}>
                  <span className="timeline-number">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </motion.section>

        <motion.section className="section shell nuance-section" id="fit" {...reveal()}>
          <div className="nuance-copy">
            <p className="eyebrow">Worth knowing</p>
            <h2 className="section-title">
              Five suites, returning groups, and a larger-group fit are the point.
            </h2>
            <p className="section-body">
              The narrower positioning makes the offer clearer. This is not meant to
              read like a broad first-time booking page, but like the right option
              for a group already coming back together.
            </p>
          </div>

          <div className="nuance-notes">
            {finalNotes.map((note) => (
              <div className="nuance-note" key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className="section shell cta-section" {...reveal()}>
          <div className="cta-panel">
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
          </div>
        </motion.section>
      </main>
    </div>
  )
}

export default App
