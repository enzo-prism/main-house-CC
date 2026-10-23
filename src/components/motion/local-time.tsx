import { useEffect, useState } from "react"

const formatter = () =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Belize" })

/** Live clock for Ambergris Caye (Belize, UTC−6, no DST). Renders a placeholder until mounted. */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const f = formatter()
    const update = () => setTime(f.format(new Date()))
    update()
    const id = window.setInterval(update, 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className={className} data-volatile="" suppressHydrationWarning>
      {/* Fixed-width box: the label beside it must not shift as the time changes. */}
      <span className="tabular inline-block min-w-[7.2em] text-left">{time ?? "—:—"}</span>
    </span>
  )
}
