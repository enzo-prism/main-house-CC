import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// The design system's type roles (src/styles.css: text-hero/display/section/
// title/lede/body) are their own group. Without this, tailwind-merge reads them
// as text colors and `cn("text-section", "text-white")` silently drops the
// headline style. They also must not collide with size utilities: the roles
// use zero-specificity selectors, so `text-section text-[3rem]` keeps the serif
// family and takes the explicit size.
const twMerge = extendTailwindMerge<'type-role'>({
  extend: {
    classGroups: {
      'type-role': [{ text: ['hero', 'display', 'section', 'title', 'lede', 'body'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
