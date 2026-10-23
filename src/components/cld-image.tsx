import type { CSSProperties } from 'react'

import type { Photo } from '@/content'
import { cld } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

const STEPS = [480, 768, 1080, 1440, 1920, 2560]


type CldImageProps = {
  photo: Photo
  /** The `sizes` attribute; required so the browser picks a sensible width. */
  sizes: string
  className?: string
  style?: CSSProperties
  priority?: boolean
  /** Absolutely fill a positioned parent (object-cover). */
  fill?: boolean
  alt?: string
}

/**
 * Responsive <img> for Cloudinary originals. Plain markup so it prerenders;
 * the srcset never requests more pixels than the original holds.
 */
export function CldImage({ photo, sizes, className, style, priority = false, fill = true, alt }: CldImageProps) {
  const widths = STEPS.filter((width) => width < photo.width).concat(Math.min(photo.width, 2560))
  const unique = Array.from(new Set(widths))
  const fallback = unique[Math.min(2, unique.length - 1)]

  return (
    <img
      src={cld(photo.src, fallback)}
      srcSet={unique.map((width) => `${cld(photo.src, width)} ${width}w`).join(', ')}
      sizes={sizes}
      alt={alt ?? photo.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      draggable={false}
      className={cn(fill && 'absolute inset-0 h-full w-full object-cover', className)}
      style={{
        ...(photo.focal ? { objectPosition: `${photo.focal.x}% ${photo.focal.y}%` } : null),
        ...style,
      }}
    />
  )
}
