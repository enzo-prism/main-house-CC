import { useRef, type ElementType } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

import { cn } from "@/lib/utils"
import { useMotionOk } from "./use-motion-ok"

type ScrollWordRevealProps = {
  /** Wrap words in *asterisks* for the italic accent. */
  text: string
  as?: ElementType
  className?: string
  /** Opacity of words that have not been reached yet. */
  dim?: number
}

function Word({
  children,
  progress,
  range,
  dim,
  ok,
  accent,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  dim: number
  ok: boolean
  accent: boolean
}) {
  const opacity = useTransform(progress, range, ok ? [dim, 1] : [1, 1])
  return (
    <motion.span style={{ opacity }} className={cn(accent && "italic-accent")}>
      {children}
    </motion.span>
  )
}

/** Statement paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollWordReveal({ text, as: Tag = "p", className, dim = 0.35 }: ScrollWordRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const ok = useMotionOk()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] })

  const words: { word: string; accent: boolean }[] = []
  for (const token of text.split(/(\*[^*]+\*)/g).filter(Boolean)) {
    const accent = token.startsWith("*") && token.endsWith("*")
    const clean = accent ? token.slice(1, -1) : token
    for (const word of clean.split(/\s+/).filter(Boolean)) words.push({ word, accent })
  }

  return (
    <Tag ref={ref} className={className}>
      {words.map(({ word, accent }, index) => {
        const start = index / words.length
        return (
          <span key={`${word}-${index}`}>
            {index > 0 ? " " : null}
            <Word
              progress={scrollYProgress}
              range={[start, start + 1 / words.length]}
              dim={dim}
              ok={ok}
              accent={accent}
            >
              {word}
            </Word>
          </span>
        )
      })}
    </Tag>
  )
}
