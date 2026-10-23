import type { CSSProperties } from 'react'

import { CldImage } from '@/components/cld-image'
import { CtaLink } from '@/components/cta-link'
import { LocalTime } from '@/components/motion/local-time'
import { Magnetic } from '@/components/motion/magnetic'
import { Parallax } from '@/components/motion/parallax'
import { SplitText } from '@/components/motion/split-text'
import { SectionHeading } from '@/components/section-heading'
import { COVE_URL, PHOTOS, bookingSteps, bookingUrl, finalBody, finalHeading, inquiryPrompt } from '@/content'

/** How a returning group books: three numbered steps on hairlines. */
export function BookingSteps() {
  return (
    <section id="book" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-12 px-[var(--gutter)] sm:gap-16">
        <SectionHeading eyebrow="How to book" title="Three steps to *come back.*" align="split" lede={inquiryPrompt} />
        <ol data-reveal="stagger" className="grid gap-0 sm:grid-cols-3 sm:gap-8" style={{ '--stagger-step': '120ms' } as CSSProperties}>
          {bookingSteps.map((step, index) => (
            <li
              key={step.title}
              className="flow flow-md border-t border-ink/15 py-8 sm:py-10"
              style={{ '--stagger-index': index } as CSSProperties}
            >
              <span
                aria-hidden="true"
                className="font-display tabular text-[clamp(3rem,6vw,5.5rem)] leading-[0.8] text-foreground/20"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-title">{step.title}</h3>
              <p className="text-body max-w-xs">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Closing invitation (the Cove's StayClosingCta): big serif line, CTAs, wide photo that wipes up. */
export function Closing() {
  return (
    <section aria-labelledby="closing-heading" className="bg-surface py-24 sm:py-32 lg:py-40" data-testid="closing">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-14 px-[var(--gutter)] sm:gap-20">
        <div className="flex max-w-4xl flex-col items-center gap-7 text-center">
          <p className="eyebrow eyebrow-plain" data-reveal="fade">
            For returning groups
          </p>
          <SplitText as="h2" id="closing-heading" text={finalHeading} className="text-display max-w-[14ch] text-balance" />
          <p className="text-lede max-w-xl" data-reveal="up" style={{ '--reveal-delay': '160ms' } as CSSProperties}>
            {finalBody}
          </p>
          <div
            className="flex w-full flex-col items-stretch gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center"
            data-reveal="up"
            style={{ '--reveal-delay': '260ms' } as CSSProperties}
          >
            <Magnetic className="w-full sm:w-auto">
              <CtaLink href={bookingUrl} size="lg" arrow="diag" className="w-full justify-between sm:w-auto sm:justify-center" data-testid="closing-book">
                Check availability
              </CtaLink>
            </Magnetic>
            <CtaLink href={`${COVE_URL}/`} variant="outline" size="lg" arrow="none" className="w-full sm:w-auto">
              Visit Canary Cove
            </CtaLink>
          </div>
        </div>

        <div data-reveal="clip" className="media-frame relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <Parallax amount={8}>
            <CldImage photo={PHOTOS.house} sizes="(min-width: 1320px) 1240px, 100vw" style={{ objectPosition: "50% 58%" }} />
          </Parallax>
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-sand-light/90 px-4 py-2 text-[13px] text-ink backdrop-blur sm:bottom-6 sm:left-6">
            <span aria-hidden="true" className="block size-1.5 rounded-full bg-canary-deep" />
            Now on Ambergris Caye
            <LocalTime className="font-medium" />
          </span>
        </div>
      </div>
    </section>
  )
}
