import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

const VARIANTS = {
  solid: 'bg-ink text-sand-light hover:bg-lagoon',
  canary: 'bg-canary text-ink hover:bg-sand-light',
  light: 'bg-sand-light text-ink hover:bg-canary',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-sand-light',
  'outline-light': 'border border-white/45 text-white hover:border-white hover:bg-white hover:text-ink',
  text: 'text-ink',
  'text-light': 'text-white',
} as const

const ARROW_BG = {
  solid: 'bg-sand-light/12 text-sand-light',
  canary: 'bg-ink/10 text-ink',
  light: 'bg-ink/8 text-ink',
  outline: 'bg-ink/6 group-hover:bg-sand-light/15',
  'outline-light': 'bg-white/12 group-hover:bg-ink/8',
  text: 'bg-ink text-sand-light',
  'text-light': 'bg-white text-ink',
} as const

export type CtaVariant = keyof typeof VARIANTS

type CtaLinkProps = {
  href: string
  children: string
  variant?: CtaVariant
  size?: 'md' | 'lg'
  arrow?: 'right' | 'diag' | 'none'
  className?: string
  icon?: ReactNode
  'data-testid'?: string
  'aria-label'?: string
}

/**
 * The Canary Cove call-to-action (ported from canary-cove-alpha
 * components/ui/cta-link.tsx): a pill with a rolling label and an arrow chip
 * that nudges on hover. `text` variants are inline arrow links.
 */
export function CtaLink({
  href,
  children,
  variant = 'solid',
  size = 'md',
  arrow = 'right',
  className,
  icon,
  'data-testid': testId,
  'aria-label': ariaLabel,
}: CtaLinkProps) {
  const isText = variant === 'text' || variant === 'text-light'
  const Arrow = arrow === 'diag' ? ArrowUpRight : ArrowRight

  return (
    <a
      href={href}
      data-testid={testId}
      aria-label={ariaLabel}
      className={cn(
        'group focus-ring relative inline-flex shrink-0 touch-manipulation items-center justify-center gap-3 whitespace-nowrap font-medium transition-[background-color,color,border-color,transform] duration-500 ease-[var(--ease-out-expo)] motion-safe:active:scale-[0.97] motion-reduce:transition-none',
        isText
          ? 'min-h-11 rounded-full text-[15px]'
          : cn('rounded-full', size === 'lg' ? 'h-14 pl-7 pr-2 text-[15px]' : 'h-12 pl-6 pr-1.5 text-sm'),
        arrow === 'none' && !isText && (size === 'lg' ? 'pr-7' : 'pr-6'),
        VARIANTS[variant],
        className,
      )}
    >
      {icon}
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {arrow !== 'none' ? (
        <span
          aria-hidden="true"
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full transition-colors duration-500',
            isText ? 'h-8 w-8' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9',
            ARROW_BG[variant],
          )}
        >
          <Arrow className={cn('arrow-nudge h-4 w-4', arrow === 'diag' && 'arrow-nudge-diag')} />
        </span>
      ) : null}
    </a>
  )
}
