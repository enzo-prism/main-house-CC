import { useCallback, useRef, useState, type CSSProperties } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'

import { CldImage } from '@/components/cld-image'
import { SectionHeading } from '@/components/section-heading'
import { interiors } from '@/content'
import { cn } from '@/lib/utils'

/**
 * Inside the Main House: the great room as a feature tile plus eight rooms,
 * each opening a full-size view. The originals are 800px, so tiles stay
 * around 400 CSS px (sharp at 2x) and the lightbox never scales past 800px.
 */
export function Interiors() {
  const [open, setOpen] = useState<number | null>(null)
  // Focus returns to the tile of the photo last shown, not the one first opened.
  const tiles = useRef<(HTMLButtonElement | null)[]>([])
  const lastShown = useRef(0)
  const count = interiors.length
  const step = useCallback((delta: number) => setOpen((index) => (index === null ? index : (index + delta + count) % count)), [count])
  const current = open === null ? null : interiors[open]

  return (
    <section id="inside" className="bg-surface py-20 sm:py-28 lg:py-36">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-12 px-[var(--gutter)] sm:gap-16">
        <SectionHeading
          eyebrow="Inside the house"
          title="Under one roof, *with room to spread out.*"
          align="split"
          lede="Five suites and shared living spaces on two floors, so the group can gather together or find a quiet corner."
        />

        <ul
          data-reveal="stagger"
          className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3"
          style={{ '--stagger-step': '70ms' } as CSSProperties}
          aria-label="Rooms in the Main House"
        >
          {interiors.map((tile, index) => (
            <li
              key={tile.photo.src}
              className={cn(tile.feature && 'col-span-2 lg:row-span-2')}
              style={{ '--stagger-index': index } as CSSProperties}
            >
              <button
                ref={(node) => {
                  tiles.current[index] = node
                }}
                type="button"
                onClick={() => setOpen(index)}
                aria-label={`View larger: ${tile.label}`}
                className="group focus-ring relative block h-full w-full overflow-hidden rounded-[var(--radius-media)] bg-sand-deep text-left"
              >
                <span className={cn('zoom-media relative block w-full', tile.feature ? 'aspect-[3/2] lg:aspect-auto lg:h-full' : 'aspect-[3/2]')}>
                  <CldImage
                    photo={tile.photo}
                    sizes={tile.feature ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, 50vw'}
                  />
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/65 via-ink/15 to-transparent p-3 pt-10 sm:p-4 sm:pt-14">
                  <span className={cn('font-display leading-none text-white', tile.feature ? 'text-[clamp(1.5rem,2.6vw,2.25rem)]' : 'text-[clamp(1rem,1.7vw,1.5rem)]')}>
                    {tile.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-sand-light/90 text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex"
                  >
                    <Expand className="size-4" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog.Root
        open={open !== null}
        onOpenChange={(next) => {
          if (next) return
          lastShown.current = open ?? 0
          setOpen(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="nav-sheet fixed inset-0 z-[90] bg-reef-deep/92 backdrop-blur-sm" />
          <Dialog.Content
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              tiles.current[lastShown.current]?.focus({ preventScroll: true })
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') step(1)
              if (event.key === 'ArrowLeft') step(-1)
            }}
            className="nav-sheet fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 p-4 outline-none sm:p-8"
          >
            {current ? (
              <>
                <Dialog.Title className="sr-only">{current.label}</Dialog.Title>
                <figure className="flex w-full max-w-[800px] flex-col gap-3">
                  <div className="relative w-full overflow-hidden rounded-[var(--radius-media)] bg-ink" style={{ aspectRatio: `${current.photo.width} / ${current.photo.height ?? 533}` }}>
                    <CldImage photo={current.photo} sizes="(min-width: 840px) 800px, 92vw" />
                  </div>
                  <figcaption className="flex items-baseline justify-between gap-4 text-white">
                    <span className="flex flex-col gap-1">
                      <span className="font-display text-2xl leading-none">{current.label}</span>
                      <span className="text-sm text-white/70">{current.photo.alt}</span>
                    </span>
                    <span className="tabular shrink-0 text-xs font-semibold tracking-[0.2em] text-white/60">
                      {String((open ?? 0) + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                    </span>
                  </figcaption>
                </figure>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="focus-ring flex size-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-ink"
                  >
                    <ArrowLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className="focus-ring flex size-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-ink"
                  >
                    <ArrowRight className="size-5" />
                  </button>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close photo"
                    className="focus-ring absolute right-4 top-4 flex size-12 items-center justify-center rounded-full bg-sand-light text-ink transition-colors hover:bg-canary sm:right-8 sm:top-8"
                  >
                    <X className="size-5" />
                  </button>
                </Dialog.Close>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
