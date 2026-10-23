import { useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"
import { useFinePointer, useMotionOk } from "./use-motion-ok"

type MagneticProps = {
  children: ReactNode
  className?: string
  strength?: number
}

/** Pulls its child gently toward the cursor on desktop pointers. */
export function Magnetic({ children, className, strength = 0.28 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const ok = useMotionOk()
  const fine = useFinePointer()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })
  const active = ok && fine

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(event) => {
        if (!active || event.pointerType !== "mouse") return
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
