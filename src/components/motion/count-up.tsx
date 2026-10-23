import { useEffect, useRef, useState } from "react"

type CountUpProps = {
  value: number
  className?: string
  duration?: number
  prefix?: string
  suffix?: string
  /** Pad with leading zeros to this many digits (e.g. 2 → "03"). */
  pad?: number
}

const format = (n: number, pad?: number) => (pad ? String(n).padStart(pad, "0") : n.toLocaleString("en-US"))

/**
 * Renders the final value on the server (crawlers, no-JS, tests), then counts
 * up from zero the first time it scrolls into view.
 */
export function CountUp({ value, className, duration = 1600, prefix = "", suffix = "", pad }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return // already on screen: leave it

    // The prerendered markup shows the final value; only after hydration, and
    // only for numbers still below the fold, rewind to zero for the count.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplay(0)
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 4)
          setDisplay(Math.round(eased * value))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(element)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [duration, value])

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular">
        {prefix}
        {format(display, pad)}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {format(value, pad)}
        {suffix}
      </span>
    </span>
  )
}
