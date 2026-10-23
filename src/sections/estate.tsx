import type { CSSProperties } from 'react'

import { CldImage } from '@/components/cld-image'
import { Marquee } from '@/components/motion/marquee'
import { Parallax } from '@/components/motion/parallax'
import { SectionHeading } from '@/components/section-heading'
import { PHOTOS, marqueeWords, type Photo } from '@/content'
import { cn } from '@/lib/utils'

export function OfferMarquee() {
  return (
    <div className="border-y border-border/70 bg-surface py-6 sm:py-8">
      <Marquee
        contentHidden
        label="Main House highlights"
        duration={52}
        items={marqueeWords.map((word) => (
          <span key={word} className="font-display px-6 text-[clamp(1.85rem,3.4vw,3.25rem)] leading-none text-foreground sm:px-10">
            {word}
          </span>
        ))}
        separator={
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-canary-deep sm:h-6 sm:w-6">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        }
      />
    </div>
  )
}

type Plate = {
  photo: Photo
  title: string
  body: string
  /** Frame aspect; kept near each 800px original's own shape. */
  frame: string
  sizes: string
  cell: string
}

// Every plate is the Main House itself (see docs/photo-provenance.md).
const PLATES: Plate[] = [
  {
    photo: PHOTOS.houseFromBeach,
    title: 'The Main House',
    body: 'Two storeys on the beach, with the pool terrace running the width of the house.',
    frame: 'aspect-[800/311]',
    sizes: '(min-width: 1024px) 58vw, 100vw',
    cell: 'sm:col-span-2 lg:col-span-7',
  },
  {
    photo: PHOTOS.beachPalapaHouse,
    title: 'On the sand',
    body: 'Palapa shade on the beach, a few steps from the house.',
    frame: 'aspect-[3/2]',
    sizes: '(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw',
    cell: 'lg:col-span-5',
  },
  {
    photo: PHOTOS.poolDeckHouse,
    title: 'The pool deck',
    body: 'Settle into a shared rhythm by the water with your whole group in one place.',
    frame: 'aspect-[3/2]',
    sizes: '(min-width: 1024px) 48vw, (min-width: 640px) 50vw, 100vw',
    cell: 'lg:col-span-6',
  },
  {
    photo: PHOTOS.upperTerraceView,
    title: 'From the upper terrace',
    body: 'Open and expansive, while keeping everyone connected.',
    frame: 'aspect-[3/2]',
    sizes: '(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 100vw',
    cell: 'lg:col-span-5 lg:col-start-8 lg:mt-24',
  },
]

/**
 * Outside the Main House: the house from the beach, the sand, the pool deck
 * and the view from upstairs, as the Cove's numbered, captioned plates.
 */
export function Estate() {
  return (
    <section id="the-estate" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-12 px-[var(--gutter)] sm:gap-16">
        <SectionHeading
          eyebrow="Outside"
          title="Room for everyone. *One place* to come back to."
          align="split"
          lede="Pool, waterfront, and grounds, all flowing together around your group, so the trip has one calm, unhurried center."
        />

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-y-16">
          {PLATES.map((plate, index) => (
            <figure key={plate.title} className={cn('flow flow-md', plate.cell)}>
              <div
                data-reveal="clip"
                style={{ '--reveal-delay': `${(index % 2) * 120}ms` } as CSSProperties}
                className={cn('media-frame relative w-full', plate.frame)}
              >
                <Parallax amount={3} scale={1.06}>
                  <CldImage photo={plate.photo} sizes={plate.sizes} />
                </Parallax>
              </div>
              <figcaption
                className="grid grid-cols-[2rem_1fr] gap-x-2 gap-y-2"
                data-reveal="up"
                style={{ '--reveal-delay': `${(index % 2) * 120 + 120}ms` } as CSSProperties}
              >
                <span aria-hidden="true" className="tabular pt-2 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[clamp(1.6rem,2.3vw,2.25rem)] leading-[1.05] text-foreground">{plate.title}</span>
                <span className="col-start-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">{plate.body}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
