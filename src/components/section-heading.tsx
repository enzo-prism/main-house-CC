import type { CSSProperties, ReactNode } from "react"

import { SplitText } from "@/components/motion/split-text"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow?: string
  /** Wrap words in *asterisks* for the italic accent. */
  title: string
  lede?: ReactNode
  action?: ReactNode
  align?: "left" | "center" | "split"
  as?: "h1" | "h2" | "h3"
  size?: "display" | "section" | "title"
  tone?: "default" | "light"
  className?: string
  titleClassName?: string
  id?: string
}

/**
 * Eyebrow + serif title (word reveal) + lede + optional action. `split` puts
 * the title left and lede/action right on wide screens.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  align = "left",
  as = "h2",
  size = "section",
  tone = "default",
  className,
  titleClassName,
  id,
}: SectionHeadingProps) {
  const sizeClass = size === "display" ? "text-display" : size === "title" ? "text-title" : "text-section"
  const light = tone === "light"

  const titleBlock = (
    <div className={cn("flow flow-md", align === "center" && "items-center text-center")}>
      {eyebrow ? (
        <p data-reveal="fade" className={cn("eyebrow", light && "text-white/70")}>
          {eyebrow}
        </p>
      ) : null}
      <SplitText
        as={as}
        id={id}
        text={title}
        className={cn(sizeClass, "max-w-[18ch] text-balance", align === "center" && "mx-auto", light ? "text-white" : "text-foreground", titleClassName)}
      />
    </div>
  )

  const ledeBlock =
    lede || action ? (
      <div
        data-reveal="up"
        style={{ "--reveal-delay": "160ms" } as CSSProperties}
        className={cn("flow flow-md", align === "center" && "items-center text-center")}
      >
        {lede ? (
          <div className={cn("text-lede max-w-xl", align === "center" && "mx-auto", light && "text-white/75")}>{lede}</div>
        ) : null}
        {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
      </div>
    ) : null

  if (align === "split") {
    return (
      <div className={cn("grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16", className)}>
        {titleBlock}
        {ledeBlock}
      </div>
    )
  }

  return (
    <div className={cn("flow flow-lg", align === "center" && "items-center", className)}>
      {titleBlock}
      {ledeBlock}
    </div>
  )
}
