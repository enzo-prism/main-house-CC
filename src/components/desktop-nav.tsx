import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowUpRight, ChevronDown } from "lucide-react"

import type { NavItem } from "@/lib/nav"
import { cn } from "@/lib/utils"
import * as Popover from "@radix-ui/react-popover"

type DesktopNavProps = {
  items: NavItem[]
}

const OPEN_DELAY_MS = 150
const CLOSE_DELAY_MS = 120

const linkClass = (active: boolean) =>
  cn(
    "focus-ring rounded-full px-3 py-2 text-[14px] font-medium transition-colors duration-300 motion-reduce:transition-none",
    active
      ? "text-foreground underline decoration-canary-deep decoration-2 underline-offset-[9px]"
      : "text-foreground/70 hover:text-foreground",
  )

function focusPanelLink(panel: HTMLElement | null, index: number) {
  const links = panel ? Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[href]")) : []
  if (links.length === 0) return
  const next = links[(index + links.length) % links.length]
  next?.focus({ preventScroll: true })
}

export function DesktopNav({ items }: DesktopNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [preview, setPreview] = useState<Record<string, number>>({})
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelRefs = useRef<Record<string, HTMLElement | null>>({})
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const navRef = useRef<HTMLElement | null>(null)
  const openingMethod = useRef<"hover" | "pointer" | "keyboard">("hover")
  const initialFocusIndex = useRef(0)

  const primary = items

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  useEffect(() => clearTimer, [])


  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const closeAtMobile = () => {
      if (desktop.matches) return
      clearTimer()
      const active = document.activeElement
      const ownsFocus = navRef.current?.contains(active) || Object.values(panelRefs.current).some((panel) => panel?.contains(active))
      setOpenDropdown(null)
      if (ownsFocus) {
        navRef.current?.closest("header")?.querySelector<HTMLButtonElement>('[aria-label="Open navigation menu"]')?.focus({ preventScroll: true })
      }
    }
    desktop.addEventListener("change", closeAtMobile)
    return () => desktop.removeEventListener("change", closeAtMobile)
  }, [])

  const scheduleOpen = (label: string) => {
    clearTimer()
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return
    timer.current = setTimeout(() => {
      openingMethod.current = "hover"
      setOpenDropdown(label)
    }, OPEN_DELAY_MS)
  }

  const scheduleClose = () => {
    clearTimer()
    timer.current = setTimeout(() => {
      // Leaving with the mouse must not remove a keyboard user's focused link.
      if (Object.values(panelRefs.current).some((panel) => panel?.contains(document.activeElement))) return
      setOpenDropdown(null)
    }, CLOSE_DELAY_MS)
  }

  const handlePanelKeyDown = (event: React.KeyboardEvent, label: string) => {
    const panel = panelRefs.current[label]
    const links = panel ? Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[href]")) : []
    const current = links.indexOf(document.activeElement as HTMLAnchorElement)

    if (event.key === "Escape") {
      event.preventDefault()
      setOpenDropdown(null)
      triggerRefs.current[label]?.focus({ preventScroll: true })
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      focusPanelLink(panel, current + 1)
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      focusPanelLink(panel, current - 1)
      return
    }
    if (event.key === "Home") {
      event.preventDefault()
      focusPanelLink(panel, 0)
      return
    }
    if (event.key === "End") {
      event.preventDefault()
      focusPanelLink(panel, links.length - 1)
      return
    }
    if (event.key === "Tab") {
      const atBoundary = event.shiftKey ? current === 0 : current === links.length - 1
      if (!atBoundary) {
        // Safari's default Tab preference skips links. Within an open
        // disclosure, keep the promised link-by-link traversal consistent.
        if (current >= 0) {
          event.preventDefault()
          // Radix's composed key handler reads activeElement after ours. If
          // we focus its last link immediately, it loops back to the first.
          // Move focus after that handler finishes, before the next input.
          queueMicrotask(() => {
            if (panel?.isConnected) focusPanelLink(panel, current + (event.shiftKey ? -1 : 1))
          })
        }
        return
      }
      // Radix loops Tab inside its portaled focus scope. At the edges, resume
      // the header's reading order instead of looping or skipping every link.
      event.preventDefault()
      setOpenDropdown(null)
      const trigger = triggerRefs.current[label]
      const controls = navRef.current
        ? Array.from(navRef.current.querySelectorAll<HTMLElement>("a[href], button"))
        : []
      const next = event.shiftKey ? trigger : controls[controls.indexOf(trigger as HTMLElement) + 1]
      next?.focus({ preventScroll: true })
    }
  }

  return (
    <nav ref={navRef} aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
      <ul className="flex min-w-0 list-none items-center gap-0.5 xl:gap-1">
        {primary.map((item) => {
          if (item.type === "dropdown") {
            const open = openDropdown === item.label
            const active = item.items.some((child) => child.current)

            return (
              <li
                key={item.label}
                className="shrink-0"
                onMouseEnter={() => scheduleOpen(item.label)}
                onMouseLeave={scheduleClose}
              >
                <Popover.Root open={open} onOpenChange={(next) => setOpenDropdown(next ? item.label : null)}>
                  <div className="flex items-center">
                    <a
                      href={item.href}
                      onClick={() => {
                        clearTimer()
                        setOpenDropdown(null)
                      }}
                      className={cn(linkClass(active), "rounded-r-none py-2 pl-3 pr-1.5")}
                    >
                      {item.label}
                    </a>
                    <Popover.Trigger asChild>
                      <button
                        ref={(node) => {
                          triggerRefs.current[item.label] = node
                        }}
                        type="button"
                        aria-label={`${item.label} submenu`}
                        aria-expanded={open}
                        data-testid={`desktop-nav-${item.label.toLowerCase()}`}
                        onClick={(event) => {
                          clearTimer()
                          // Safari does not focus buttons on pointer clicks.
                          // Keep a promoted hover panel's keyboard entry point.
                          event.currentTarget.focus({ preventScroll: true })
                          // Hover may open the panel while the pointer moves
                          // toward the chevron. The first click commits it open.
                          if (open && openingMethod.current === "hover") event.preventDefault()
                          openingMethod.current = event.detail === 0 ? "keyboard" : "pointer"
                          initialFocusIndex.current = 0
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Tab" && open && !event.shiftKey) {
                            event.preventDefault()
                            clearTimer()
                            focusPanelLink(panelRefs.current[item.label], 0)
                            return
                          }
                          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                            event.preventDefault()
                            clearTimer()
                            openingMethod.current = "keyboard"
                            initialFocusIndex.current = event.key === "ArrowUp" ? -1 : 0
                            setOpenDropdown(item.label)
                            if (open) focusPanelLink(panelRefs.current[item.label], initialFocusIndex.current)
                          }
                        }}
                        className={cn(
                          "focus-ring flex h-9 w-7 items-center justify-center rounded-l-none rounded-r-full pointer-coarse:h-11 pointer-coarse:w-10 transition-colors duration-200 motion-reduce:transition-none",
                          active ? "text-foreground" : "text-foreground/60 hover:text-foreground",
                        )}
                      >
                        <ChevronDown
                          className={cn("h-3.5 w-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none", open && "rotate-180")}
                        />
                      </button>
                    </Popover.Trigger>
                  </div>
                  <Popover.Portal>
                  <Popover.Content
                    ref={(node) => {
                      panelRefs.current[item.label] = node
                    }}
                    align="center"
                    sideOffset={14}
                    onKeyDown={(event) => handlePanelKeyDown(event, item.label)}
                    onOpenAutoFocus={(event) => {
                      event.preventDefault()
                      if (openingMethod.current !== "hover") focusPanelLink(panelRefs.current[item.label], initialFocusIndex.current)
                    }}
                    onCloseAutoFocus={(event) => event.preventDefault()}
                    onMouseEnter={clearTimer}
                    onMouseLeave={scheduleClose}
                    className="nav-panel z-[60] w-[600px] overflow-hidden rounded-[1.5rem] border border-border/80 bg-sand-light p-2 shadow-[var(--shadow-lift)] outline-none"
                  >
                    <div className="grid grid-cols-[1fr_220px] gap-2">
                      <ul className="flex flex-col py-1">
                        {item.items.map((child, index) => (
                          <li
                            key={child.href}
                            className="enter-up"
                            style={{ "--enter-delay": `${60 + index * 45}ms` } as CSSProperties}
                          >
                            <a
                              href={child.href}
                              aria-current={child.current ? "page" : undefined}
                              onMouseEnter={() => setPreview((prev) => ({ ...prev, [item.label]: index }))}
                              onFocus={() => setPreview((prev) => ({ ...prev, [item.label]: index }))}
                              onClick={() => {
                                clearTimer()
                                setOpenDropdown(null)
                              }}
                              className={cn(
                                "group flex min-h-14 items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors duration-300 hover:bg-sand-deep/70 focus-visible:bg-sand-deep/70 focus-visible:outline-none motion-reduce:transition-none",
                                child.current && "bg-sand-deep/60",
                              )}
                            >
                              <span className="flex flex-col">
                                <span className="flex items-center gap-1.5 font-display text-[1.45rem] leading-tight text-foreground">
                                  {child.label}
                                </span>
                                <span className="block text-xs text-muted-foreground">{child.caption}</span>
                              </span>
                              <span
                                aria-hidden="true"
                                className="flex h-8 w-8 shrink-0 -translate-x-2 items-center justify-center rounded-full bg-ink text-sand-light opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                              >
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div aria-hidden="true" className="relative min-h-[260px] overflow-hidden rounded-[1.1rem] bg-sand-deep">
                        {item.items.map((child, index) =>
                          child.image ? (
                            <img
                              key={child.href}
                              src={child.image}
                              alt=""
                              className={cn(
                                "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                                (preview[item.label] ?? Math.max(0, item.items.findIndex((entry) => entry.current))) === index ? "scale-100 opacity-100" : "scale-110 opacity-0",
                              )}
                            />
                          ) : null,
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-12">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">{item.label}</p>
                        </div>
                      </div>
                    </div>
                  </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </li>
            )
          }

          return (
            <li key={item.label} className="shrink-0">
              <a href={item.href} className={linkClass(false)}>
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
