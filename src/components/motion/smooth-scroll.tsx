import { useEffect } from "react"
import Lenis from "lenis"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Inertial wheel scrolling on desktop pointers. It drives the real window
 * scroll position (no wrapper element), so sticky positioning, anchors,
 * IntersectionObservers and window.scrollY behave exactly as they do natively.
 * Skipped for touch input, reduced motion and automated browsers, and paused
 * whenever a modal (Radix scroll lock, mobile menu) owns the page.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (navigator.webdriver) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const lenis = new Lenis({
      // Lenis 1.3 does not animate on its own: without autoRaf (or a manual
      // requestAnimationFrame loop) it swallows wheel input and the page
      // never moves.
      autoRaf: true,
      lerp: 0.11,
      wheelMultiplier: 1,
      smoothWheel: true,
      anchors: {
        offset: 0,
        onComplete: () => {
          // The header shrinks and responsive filmstrips can settle while a
          // long anchor journey is in progress. Align against the final live
          // geometry so the destination still lands under the current header.
          const hash = window.location.hash.slice(1)
          if (!hash) return
          let id: string
          try { id = decodeURIComponent(hash) } catch { return }
          const target = document.getElementById(id)
          if (target) lenis.scrollTo(target, { immediate: true, force: true })
        },
      },
      prevent: (node: HTMLElement) =>
        Boolean(node.closest?.("[data-lenis-prevent], [role='dialog'], [role='alertdialog'], [role='listbox']")),
      // Shift+wheel is a horizontal scroll on Windows/Linux mice: let the
      // browser route it to the rail under the cursor.
      virtualScroll: (data) => !(data.event as WheelEvent).shiftKey,
    })
    window.__lenis = lenis

    // Lenis keeps writing its animated position for ~1s after the last wheel
    // tick, which silently overrides native focus()/scrollTo()/scrollBy()
    // made in that window (form errors, "Back to top", filter jumps). Any
    // click or keypress means the user is acting, so stop gliding.
    const halt = () => {
      if (lenis.isScrolling === "smooth") lenis.scrollTo(window.scrollY, { immediate: true, force: true })
    }
    window.addEventListener("pointerdown", halt, true)
    window.addEventListener("keydown", halt, true)

    const sync = () => {
      const body = document.body
      const locked = body.hasAttribute("data-scroll-locked") || body.dataset.mobileNavOpen === "true"
      if (locked) lenis.stop()
      else lenis.start()
    }
    const mo = new MutationObserver(sync)
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked", "data-mobile-nav-open"] })

    return () => {
      window.removeEventListener("pointerdown", halt, true)
      window.removeEventListener("keydown", halt, true)
      mo.disconnect()
      lenis.destroy()
      if (window.__lenis === lenis) delete window.__lenis
    }
  }, [])

  return null
}
