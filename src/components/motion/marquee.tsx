import { useState, type CSSProperties, type ReactNode } from "react"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"

type MarqueeProps = {
  items: ReactNode[]
  className?: string
  itemClassName?: string
  /** Seconds per full loop. */
  duration?: number
  separator?: ReactNode
  reverse?: boolean
  label?: string
  contentHidden?: boolean
  maskClassName?: string
}

/** Infinite CSS ticker. The duplicate run is aria-hidden; pauses on hover and under reduced motion. */
export function Marquee({ items, className, itemClassName, duration = 40, separator, reverse = false, label = "amenities ticker", contentHidden = false, maskClassName }: MarqueeProps) {
  const [paused, setPaused] = useState(false)
  const run = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <li key={index} className={cn("flex shrink-0 items-center", itemClassName)}>
          {item}
          {separator ? <span aria-hidden="true" className="flex items-center">{separator}</span> : null}
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn("marquee relative flex overflow-hidden", className)}>
      <div aria-hidden={contentHidden || undefined} className={cn("flex w-full min-w-0 overflow-hidden", maskClassName)}>
      <div
        className="marquee-track flex w-max shrink-0"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : undefined, animationPlayState: paused ? "paused" : undefined } as CSSProperties}
      >
        {run(false)}
        {run(true)}
      </div>
      </div>
      <button
        type="button"
        aria-label={`${paused ? "Resume" : "Pause"} ${label}`}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
        className="focus-ring absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-sand-light text-ink shadow-sm transition-colors hover:bg-ink hover:text-sand-light motion-reduce:hidden"
      >
        {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
      </button>
    </div>
  )
}
