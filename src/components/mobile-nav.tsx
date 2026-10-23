import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'

import { BOOK_HREF, type NavItem } from '@/lib/nav'
import { contactUrl } from '@/content'
import { cn } from '@/lib/utils'
import { LocalTime } from './motion/local-time'

type Row = { label: string; href: string; caption?: string; current?: boolean }

const enter = (index: number) => ({ '--enter-delay': `${80 + Math.min(index, 12) * 40}ms` }) as CSSProperties

function MenuRow({ row, index, onNavigate }: { row: Row; index: number; onNavigate?: () => void }) {
  return (
    <li className="enter-up" style={enter(index)}>
      <a
        href={row.href}
        aria-current={row.current ? 'page' : undefined}
        onClick={onNavigate}
        className="group focus-ring flex min-h-[56px] items-center justify-between gap-3 rounded-2xl py-1.5"
      >
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              'font-display text-[2.1rem] leading-[1.05] transition-colors duration-300',
              row.current ? 'text-lagoon' : 'text-foreground group-hover:text-lagoon',
            )}
          >
            {row.label}
          </span>
          {row.caption ? <span className="text-xs text-muted-foreground">{row.caption}</span> : null}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
            row.current
              ? 'border-lagoon bg-lagoon text-sand-light'
              : 'border-border text-foreground group-hover:border-ink group-hover:bg-ink group-hover:text-sand-light',
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </span>
      </a>
    </li>
  )
}

/** Full-screen menu body (ported from canary-cove-alpha components/navigation/mobile-nav.tsx). */
export function MobileNav({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const groups = items.filter((item) => item.type === 'dropdown')
  const singles = items.filter((item) => item.type === 'link')

  let order = 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8" data-lenis-prevent>
        <div className="mt-4 flex flex-col gap-8">
          {groups.map((group) => {
            if (group.type !== 'dropdown') return null
            return (
              <section key={group.label} aria-label={group.label}>
                <p className="eyebrow enter-fade" style={enter(order)}>
                  {group.label}
                </p>
                <ul className="mt-2 flex flex-col">
                  {group.items.map((child) => (
                    <MenuRow key={child.href} row={child} index={++order} onNavigate={onNavigate} />
                  ))}
                </ul>
              </section>
            )
          })}

          <section aria-label="More pages">
            <p className="eyebrow enter-fade" style={enter(order)}>
              Plan
            </p>
            <ul className="mt-2 flex flex-col">
              {singles.map((single) =>
                single.type === 'link' ? (
                  <MenuRow key={single.href} row={single} index={++order} onNavigate={onNavigate} />
                ) : null,
              )}
            </ul>
          </section>

          <p
            className="enter-fade flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            style={enter(order + 1)}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
            Now on Ambergris Caye · <LocalTime className="text-foreground" />
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-sand pt-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <a
          href={BOOK_HREF}
          onClick={onNavigate}
          className="group focus-ring flex h-14 w-full items-center justify-between rounded-full bg-ink pl-6 pr-2 text-[15px] font-medium text-sand-light"
        >
          Request Main House dates
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-canary text-ink">
            <ArrowRight className="arrow-nudge h-4 w-4" />
          </span>
        </a>
        <a
          href={contactUrl}
          onClick={onNavigate}
          className="focus-ring mt-1 flex min-h-11 w-full items-center justify-center rounded-full text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          Prefer to write? Message us
        </a>
      </div>
    </div>
  )
}
