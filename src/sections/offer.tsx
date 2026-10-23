import type { CSSProperties } from 'react'

import { CldImage } from '@/components/cld-image'
import { Parallax } from '@/components/motion/parallax'
import { ScrollWordReveal } from '@/components/motion/scroll-word-reveal'
import { SectionHeading } from '@/components/section-heading'
import { PHOTOS, estateParts, summaryHeadline, whatYouGet } from '@/content'

/** The approved one-line offer, lit word by word as it scrolls through. */
export function Statement() {
  return (
    <section aria-labelledby="offer-heading" className="pb-20 sm:pb-28 lg:pb-36">
      <div className="mx-auto grid w-full max-w-[1320px] gap-6 px-[var(--gutter)] lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        <h2 id="offer-heading" className="eyebrow lg:pt-4" data-reveal="fade">
          The offer
        </h2>
        <ScrollWordReveal
          text={summaryHeadline}
          className="font-display max-w-[22ch] text-[clamp(2rem,4.1vw,3.6rem)] leading-[1.04] tracking-[-0.015em] text-foreground lg:justify-self-end"
        />
      </div>
    </section>
  )
}

/**
 * What you get: the whole estate as one home base. A tall photograph that
 * wipes up beside the approved copy and a numbered ledger of what the group
 * shares.
 */
export function WhatYouGet() {
  return (
    <section id="what-you-get" className="bg-surface py-20 sm:py-28 lg:py-36">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-14 px-[var(--gutter)] sm:gap-20">
        <SectionHeading
          eyebrow="What you get"
          title="The whole estate, *one home base.*"
          align="split"
          lede={whatYouGet[0]}
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="relative lg:col-span-7">
            {/* The Main House pool photos are 800px originals: keep frames close
                to their 3:2 shape and the parallax overscale small. */}
            <div data-reveal="clip" className="media-frame relative aspect-[3/2] w-full">
              <Parallax amount={4} scale={1.08}>
                <CldImage photo={PHOTOS.poolPalapaBar} sizes="(min-width: 1024px) 56vw, 100vw" />
              </Parallax>
            </div>
            <div
              data-reveal="clip"
              style={{ '--reveal-delay': '250ms' } as CSSProperties}
              className="media-frame absolute -bottom-8 right-4 hidden aspect-square w-[38%] border-[6px] border-surface shadow-[var(--shadow-lift)] sm:block lg:-right-10"
            >
              <Parallax amount={6} scale={1.08}>
                <CldImage photo={PHOTOS.poolDeckLoungers} sizes="(min-width: 1024px) 20vw, 38vw" />
              </Parallax>
            </div>
          </div>

          <div className="flow flow-xl lg:col-span-5 lg:pb-4">
            <p className="text-body max-w-md" data-reveal="up">
              {whatYouGet[1]}
            </p>
            <ol data-reveal="stagger" className="border-t border-ink/15" aria-label="What your group shares">
              {estateParts.map((part, index) => (
                <li
                  key={part.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-1 border-b border-ink/15 py-5 sm:py-6"
                  style={{ '--stagger-index': index } as CSSProperties}
                >
                  <span aria-hidden="true" className="tabular pt-1.5 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[1.75rem] leading-none text-foreground">{part.title}</span>
                  <span className="col-start-2 text-[15px] leading-relaxed text-muted-foreground">{part.body}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
