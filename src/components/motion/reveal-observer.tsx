import { useEffect } from "react"

const SELECTOR = "[data-reveal]:not([data-revealed])"

/**
 * One IntersectionObserver for the whole page (ported from
 * canary-cove-alpha/components/motion/reveal-observer.tsx). Any element opts
 * in with `data-reveal="up|fade|left|right|scale|blur|clip|clip-x|stagger|words"`;
 * this marks it `data-revealed` the first time it enters the viewport and the
 * CSS in src/styles.css plays the transition.
 */
export function RevealObserver() {
  useEffect(() => {
    const reveal = (element: Element) => element.setAttribute("data-revealed", "")

    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(SELECTOR).forEach(reveal)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            reveal(entry.target)
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    )

    const observeAll = (root: ParentNode) => {
      if (root instanceof Element && root.matches(SELECTOR)) io.observe(root)
      root.querySelectorAll?.(SELECTOR).forEach((element) => io.observe(element))
    }

    observeAll(document)

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) observeAll(node as Element)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
