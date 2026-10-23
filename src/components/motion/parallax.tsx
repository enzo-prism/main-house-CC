import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"
import { useMotionOk } from "./use-motion-ok"

type ParallaxProps = {
  children: ReactNode
  className?: string
  /** Max travel in percent of the inner layer's height (each direction). */
  amount?: number
  /** Overscale so the moving layer never exposes an edge. */
  scale?: number
}

/**
 * Clips its children and drifts them vertically against the scroll, so media
 * appears to sit deeper than the page. Put it inside a sized, positioned
 * frame; the children should fill it (e.g. an absolutely positioned <img>).
 */
export function Parallax({ children, className, amount = 8, scale = 1.16 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const ok = useMotionOk()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ok ? [`-${amount}%`, `${amount}%`] : ["0%", "0%"])

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div className="absolute inset-0 will-change-transform" style={{ y, scale: ok ? scale : 1 }}>
        {children}
      </motion.div>
    </div>
  )
}
