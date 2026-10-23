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
 * Responsive <img> for Cloudinary originals and the self-hosted Main House
 * photos. Plain markup so it prerenders; the srcset never requests more
 * pixels than the original holds.
 */
// Self-hosted photos (public/photos/…) ship as <base>-480.webp and <base>-800.webp.
const LOCAL_STEPS = [480, 800]

const sources = (photo: Photo) => {
  if (photo.src.startsWith('/')) {
    const widths = LOCAL_STEPS.filter((width) => width <= photo.width)
    return {
      src: `${photo.src}-${widths[widths.length - 1]}.webp`,
      srcSet: widths.map((width) => `${photo.src}-${width}.webp ${width}w`).join(', '),
    }
  }
  const widths = Array.from(new Set(STEPS.filter((width) => width < photo.width).concat(Math.min(photo.width, 2560))))
  return {
    src: cld(photo.src, widths[Math.min(2, widths.length - 1)]),
    srcSet: widths.map((width) => `${cld(photo.src, width)} ${width}w`).join(', '),
  }
}

export function CldImage({ photo, sizes, className, style, priority = false, fill = true, alt }: CldImageProps) {
  const { src, srcSet } = sources(photo)

  return (
    <img
      src={src}
      srcSet={srcSet}
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
