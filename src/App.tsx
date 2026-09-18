import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { SiteFooter, SiteHeader } from './cove-chrome'
import {
  atGlance,
  bookingUrl,
  damageDepositNote,
  finalBody,
  finalHeading,
  heroImage,
  heroLocation,
  heroTitle,
  inquiryPrompt,
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

  const heroReveal = shouldReduceMotion
    ? {}
    : {
        initial: {
          opacity: 0,
          y: 16,
          scale: 0.988,
        },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: {
          opacity: {
            duration: 0.52,
            ease: [0.32, 0.72, 0, 1] as const,
          },
          y: {
            type: 'spring' as const,
            stiffness: 170,
            damping: 24,
            mass: 0.84,
          },
          scale: {
            type: 'spring' as const,
            stiffness: 180,
            damping: 24,
            mass: 0.84,
          },
        },
      }

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />

      <div className="hero" id="top">
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
          </div>
          <h1 className="hero-title">{heroTitle}</h1>
        </motion.div>
      </div>

      <main id="main-content">
        <section className="section summary-section shell">
          <div className="summary-layout">
            <div className="summary-copy">
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
              <p className="inquiry-prompt">{inquiryPrompt}</p>
            </div>

            <div className="glance-section">
              <p className="eyebrow">At a glance</p>
              <div className="glance-grid" aria-label="At a glance">
                {atGlance.map((item) => (
                  <div className="glance-item" key={item}>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section shell" id="what-you-get">
          <div className="content-split">
            <div>
              <TextSection body={whatYouGet} title="What you get" />
            </div>

            <figure className="editorial-figure">
              <img
                alt="Pool and waterfront at Canary Cove Main House"
                decoding="async"
                loading="lazy"
                src={whatYouGetImage}
              />
            </figure>
          </div>
        </section>

        <section className="section section-soft">
          <div className="shell content-split content-split-reverse">
            <figure className="editorial-figure">
              <img
                alt="Guests relaxing at the Canary Cove Main House"
                decoding="async"
                loading="lazy"
                src={returningGuestsImage}
              />
            </figure>

            <div>
              <TextSection
                body={whyReturningGuestsOnly}
                title="Why returning guests only"
              />
            </div>
          </div>
        </section>

        <section className="section section-muted" id="pricing">
          <div className="shell pricing-layout pricing-layout-single">
            <div className="pricing-copy">
              <TextSection body={[pricingIntro, damageDepositNote]} title="Seasonal pricing" />
            </div>

            <div className="pricing-panel">
              {pricingSeasons.map(({ months, rate, season }) => (
                <div className="pricing-row" key={season}>
                  <div className="pricing-season-block">
                    <p className="pricing-season">{season}</p>
                    <p className="pricing-months">{months.join(', ')}</p>
                  </div>
                  <div className="pricing-rate-block">
                    <p className="pricing-rate">{rate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell">
          <div className="space-intro">
            <p className="eyebrow">The space</p>
          </div>

          <div className="gallery-grid">
            {spaceMoments.map((moment) => (
              <figure
                className="gallery-card"
                data-layout={moment.layout}
                key={moment.title}
              >
                <img alt={moment.alt} decoding="async" loading="lazy" src={moment.image} />
                <figcaption className="space-card-copy">
                  <h3>{moment.title}</h3>
                  <p>{moment.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section shell cta-section" id="ready">
          <div className="cta-panel">
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
            <p className="inquiry-prompt">{inquiryPrompt}</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
