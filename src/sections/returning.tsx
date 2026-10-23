import type { CSSProperties } from 'react'

import { SplitText } from '@/components/motion/split-text'
import { bestFor, whyReturningGuestsOnly } from '@/content'

/**
 * Why returning guests only: the page's one dark reef band (plus the
 * footer), mirroring the Main House band on the Cove's /stay page.
 */
export function ReturningGuests() {
  return (
    <section id="returning-guests" className="surface-reef relative overflow-clip py-24 text-white sm:py-32 lg:py-40">
      <div aria-hidden="true" className="caustics pointer-events-none absolute inset-0 opacity-80" />
      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-16 px-[var(--gutter)] sm:gap-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flow flow-md lg:col-span-7">
            <p data-reveal="fade" className="eyebrow">
              Why returning guests only
            </p>
            <SplitText
              as="h2"
              text="Held for the people we *already know.*"
              className="text-display max-w-[13ch] text-balance"
            />
          </div>
          <div className="flow flow-lg lg:col-span-5 lg:pt-12">
            {whyReturningGuestsOnly.map((paragraph, index) => (
              <p
                key={paragraph}
                data-reveal="up"
                style={{ '--reveal-delay': `${120 + index * 100}ms` } as CSSProperties}
                className={index === 0 ? 'text-lede' : 'text-body'}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="flow flow-lg">
          <p data-reveal="fade" className="eyebrow">
            Best for
          </p>
          <ul data-reveal="stagger" className="grid border-t border-white/15 sm:grid-cols-3" style={{ '--stagger-step': '110ms' } as CSSProperties}>
            {bestFor.map((item, index) => (
              <li
                key={item.title}
                className="flow flow-sm border-b border-white/15 py-8 sm:border-b-0 sm:py-10 sm:pr-8 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-8"
                style={{ '--stagger-index': index } as CSSProperties}
              >
                <span aria-hidden="true" className="tabular text-[11px] font-semibold tracking-[0.2em] text-canary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display block text-[clamp(1.9rem,2.8vw,2.6rem)] leading-[1.02] text-white">{item.title}</span>
                <span className="block max-w-xs text-[15px] leading-relaxed text-white/70">{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
