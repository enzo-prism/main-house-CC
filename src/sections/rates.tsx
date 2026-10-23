import { useEffect, useState, type CSSProperties } from 'react'

import { CtaLink } from '@/components/cta-link'
import { CountUp } from '@/components/motion/count-up'
import { SectionHeading } from '@/components/section-heading'
import {
  MONTHS,
  MONTH_NAMES,
  bookingUrl,
  damageDeposit,
  damageDepositNote,
  formatUsd,
  pricingIntro,
  seasonForMonth,
  seasons,
  type SeasonId,
} from '@/content'
import { cn } from '@/lib/utils'

const SEASON_SWATCH: Record<SeasonId, string> = {
  low: 'bg-[var(--season-low)]',
  high: 'bg-[var(--season-high)]',
  peak: 'bg-[var(--season-peak)]',
}

type Month = (typeof MONTHS)[number]

/** The current month on Ambergris Caye (America/Belize, no DST). */
const belizeMonth = (): Month => {
  const name = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'America/Belize' }).format(new Date())
  return (MONTHS as readonly string[]).includes(name) ? (name as Month) : 'Dec'
}

/**
 * Seasonal pricing. A twelve-month picker (each month carries its season's
 * swatch) drives a live readout of the nightly rate; the season ledger and
 * the separate damage deposit sit underneath. Prerenders with December
 * selected, then moves to the current month after hydration.
 */
export function Rates() {
  const [month, setMonth] = useState<Month>('Dec')

  // The clock is unknowable at prerender time: move to today's month once
  // hydrated (the static HTML keeps December so hydration matches).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMonth(belizeMonth())
  }, [])

  const index = MONTHS.indexOf(month)
  const season = seasonForMonth(month)

  return (
    <section id="pricing" className="bg-surface py-20 sm:py-28 lg:py-36">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-14 px-[var(--gutter)] sm:gap-20">
        <SectionHeading eyebrow="Seasonal rates" title="Your dates *set the rate.*" align="split" lede={pricingIntro} />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flow flow-lg lg:col-span-7 lg:self-center" data-reveal="up">
            <p id="month-picker-label" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Choose a travel month
            </p>
            <div role="group" aria-labelledby="month-picker-label" className="grid grid-cols-4 gap-2 sm:grid-cols-6" data-testid="month-picker">
              {MONTHS.map((name, monthIndex) => {
                const monthSeason = seasonForMonth(name)
                const selected = name === month
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${MONTH_NAMES[monthIndex]}, ${monthSeason.name}`}
                    onClick={() => setMonth(name)}
                    className={cn(
                      'focus-ring group relative flex min-h-[4.25rem] flex-col justify-between overflow-hidden rounded-2xl border px-3 pb-2.5 pt-3 text-left transition-[background-color,border-color,color,transform] duration-300 motion-safe:active:scale-[0.97]',
                      selected
                        ? 'border-ink bg-ink text-sand-light'
                        : 'border-border bg-sand-light text-foreground hover:border-ink/40',
                    )}
                  >
                    <span className="font-display text-[1.6rem] leading-none">{name}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'block h-1 w-full rounded-full transition-opacity duration-300',
                        SEASON_SWATCH[monthSeason.id],
                        !selected && monthSeason.id !== season.id && 'opacity-60',
                      )}
                    />
                  </button>
                )
              })}
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground" aria-label="Season key">
              {seasons.map((item) => (
                <li key={item.id} className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className={cn('h-2.5 w-2.5 rounded-full', SEASON_SWATCH[item.id])} />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-[1.75rem] border border-border/70 bg-sand p-7 shadow-[var(--shadow-soft)] sm:p-9 lg:col-span-5"
            data-reveal="up"
            style={{ '--reveal-delay': '140ms' } as CSSProperties}
            data-testid="rate-readout"
          >
            <div aria-live="polite" className="flow flow-md">
              <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span aria-hidden="true" className={cn('h-2.5 w-2.5 rounded-full', SEASON_SWATCH[season.id])} />
                {season.name}
              </p>
              <p className="font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-foreground">{MONTH_NAMES[index]}</p>
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display tabular text-[clamp(3.6rem,7vw,5.75rem)] leading-[0.85] tracking-[-0.02em] text-foreground">
                  {formatUsd(season.rate)}
                </span>
                <span className="text-[15px] text-muted-foreground">per night</span>
              </p>
              <p className="text-body max-w-sm">
                For the full five-suite Main House. {damageDepositNote}
              </p>
            </div>
            <CtaLink href={bookingUrl} arrow="diag" className="self-start" data-testid="rates-book">
              {`Request ${MONTH_NAMES[index]} dates`}
            </CtaLink>
          </div>
        </div>

        <div className="flow flow-md">
          <p data-reveal="fade" className="eyebrow">
            Every season
          </p>
          <ul className="border-t border-ink/15" data-reveal="stagger" data-testid="season-ledger">
            {seasons.map((item, seasonIndex) => {
              const active = item.id === season.id
              return (
                <li
                  key={item.id}
                  data-active={active || undefined}
                  className={cn(
                    'grid gap-x-8 gap-y-3 border-b border-ink/15 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_auto]',
                  )}
                  style={{ '--stagger-index': seasonIndex } as CSSProperties}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn('h-3 w-3 shrink-0 rounded-full transition-transform duration-500', SEASON_SWATCH[item.id], active && 'scale-125')}
                    />
                    <span className={cn('font-display text-[clamp(1.75rem,2.6vw,2.4rem)] leading-none transition-colors', active ? 'text-foreground' : 'text-foreground/80')}>
                      {item.name}
                    </span>
                  </span>
                  <span className="order-3 flex flex-wrap gap-1.5 sm:col-span-2 lg:order-none lg:col-span-1">
                    <span className="sr-only">Travel months: </span>
                    {item.months.map((name) => (
                      <span
                        key={name}
                        className={cn(
                          'inline-flex h-8 items-center rounded-full border px-3 text-[13px] transition-colors duration-300',
                          name === month ? 'border-ink bg-ink text-sand-light' : 'border-border text-foreground/75',
                        )}
                      >
                        {name}
                      </span>
                    ))}
                  </span>
                  <span className="flex items-baseline gap-2 sm:justify-self-end">
                    <span className="font-display tabular text-[clamp(2rem,3.2vw,2.75rem)] leading-none text-foreground">{formatUsd(item.rate)}</span>
                    <span className="text-sm text-muted-foreground">per night</span>
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex flex-col gap-4 rounded-[1.25rem] border border-border/70 bg-sand px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8" data-reveal="up">
            <p className="text-[15px] text-foreground">
              <span className="font-medium">Damage deposit.</span>{' '}
              <span className="text-muted-foreground">Separate from the nightly rate, on every Main House stay.</span>
            </p>
            <CountUp value={damageDeposit} prefix="$" className="font-display text-[2.25rem] leading-none text-foreground" />
          </div>
        </div>
      </div>
    </section>
  )
}
