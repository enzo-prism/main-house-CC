import { useEffect, useState } from "react"

/**
 * True once mounted on a client that has not asked for reduced motion.
 * Always false during SSR and the hydration render, so motion-driven styles
 * never cause hydration mismatches; scroll-linked effects switch on after.
 */
export function useMotionOk() {
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setOk(!media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return ok
}

/** True for precise hover-capable pointers (desktop), false on touch. */
export function useFinePointer() {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setFine(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return fine
}
