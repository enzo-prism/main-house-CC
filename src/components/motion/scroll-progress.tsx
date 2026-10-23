import { motion, useScroll, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

/** Hairline that fills with page scroll progress. */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none h-[2px] origin-left bg-canary motion-reduce:hidden", className)}
      style={{ scaleX }}
    />
  )
}
