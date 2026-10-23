import { COVE_URL } from '@/content'
import { cn } from '@/lib/utils'

// Official Canary Cove lockup (canary + cocktail + slab wordmark), copied from
// canary-cove-alpha/public/brand. The canary and glass keep their brand colors
// in both variants; only the wordmark switches: ink on light surfaces, white on
// dark ones. Never recolor, stretch or re-set the lockup.
const LOGO_SRC = {
  ink: '/brand/canary-cove-logo.svg',
  light: '/brand/canary-cove-logo-light.svg',
} as const

// Intrinsic viewBox ratio of the lockup (371 × 318).
const LOGO_ASPECT = 371 / 318

type BrandMarkProps = {
  className?: string
  /** Rendered logo height in px; width follows the lockup's aspect ratio. */
  height?: number
  tone?: 'ink' | 'light'
}

/** The lockup as a link home to www.canarycove.com. */
export function BrandMark({ className, height = 52, tone = 'ink' }: BrandMarkProps) {
  return (
    <a
      href={`${COVE_URL}/`}
      aria-label="Canary Cove home"
      className={cn(
        'focus-ring inline-flex shrink-0 items-center rounded-lg transition-transform duration-500 ease-[var(--ease-out-expo)] motion-safe:active:scale-[0.97]',
        className,
      )}
    >
      <img
        src={LOGO_SRC[tone]}
        alt="Canary Cove"
        width={Math.round(height * LOGO_ASPECT)}
        height={height}
        draggable={false}
        className="block h-full w-auto select-none"
      />
    </a>
  )
}

/** The canary alone, in brand colors (decorative accent; aspect 200 × 130). */
export function BrandBird({ className, height = 40 }: { className?: string; height?: number }) {
  return (
    <img
      src="/brand/canary-cove-bird.svg"
      alt=""
      aria-hidden="true"
      width={Math.round((height * 200) / 130)}
      height={height}
      draggable={false}
      style={{ height, width: 'auto' }}
      className={cn('block select-none', className)}
    />
  )
}
