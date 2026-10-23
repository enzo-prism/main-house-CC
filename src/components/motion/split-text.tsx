import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type SplitTextProps = {
  /**
   * Plain text. Wrap words in *asterisks* to set them in the italic accent.
   * A "\n" starts a new line (each line renders as a block; the accessible
   * text still joins them with a single space).
   */
  text: string
  as?: ElementType
  className?: string
  /** "reveal" plays when scrolled into view; "enter" plays on page load (hero copy). */
  mode?: "reveal" | "enter"
  /** Delay before the first word, in ms. */
  delay?: number
  /** Stagger between words, in ms. */
  step?: number
  id?: string
  "data-testid"?: string
}

/**
 * Masked word-by-word rise for display headlines. The text content stays
 * byte-identical (words joined by single spaces), so headings keep their
 * accessible name and tests that read textContent are unaffected.
 * The animation is pure CSS (see .split-word in src/styles.css), so it
 * prerenders and plays before hydration.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  mode = "reveal",
  delay = 0,
  step,
  id,
  "data-testid": testId,
}: SplitTextProps) {
  // Short accent phrases (≤ 2 words, e.g. "Ambergris Caye") are kept on one
  // line so a headline never strands half of a place name.
  const toGroups = (line: string) => {
    const groups: { words: string[]; accent: boolean; keep: boolean }[] = []
    for (const token of line.split(/(\*[^*]+\*)/g).filter(Boolean)) {
      const accent = token.startsWith("*") && token.endsWith("*")
      const clean = accent ? token.slice(1, -1) : token
      const parts = clean.split(/\s+/).filter(Boolean)
      if (accent && parts.length <= 2) groups.push({ words: parts, accent, keep: parts.length > 1 })
      else for (const word of parts) groups.push({ words: [word], accent, keep: false })
    }
    return groups
  }
  const lines = text.split("\n").map(toGroups)

  const style = {
    "--reveal-delay": `${delay}ms`,
    "--enter-delay": `${delay}ms`,
    ...(step ? { "--word-step": `${step}ms` } : {}),
  } as CSSProperties

  let wordIndex = 0
  const renderWord = (word: string, accent: boolean) => {
    const index = wordIndex++
    return (
      <span key={`${word}-${index}`} className="split-word">
        <span className={cn(accent && "italic-accent")} style={{ "--word-index": index } as CSSProperties}>
          {word}
        </span>
      </span>
    )
  }

  const renderGroups = (groups: ReturnType<typeof toGroups>): ReactNode => groups.map((group, groupIndex) => (
    <Fragment key={groupIndex}>
      {groupIndex > 0 ? " " : null}
      {group.keep ? (
        <span className="whitespace-nowrap">
          {group.words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 ? " " : null}
              {renderWord(word, group.accent)}
            </Fragment>
          ))}
        </span>
      ) : (
        renderWord(group.words[0], group.accent)
      )}
    </Fragment>
  ))

  const content: ReactNode =
    lines.length === 1
      ? renderGroups(lines[0])
      : lines.map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 ? " " : null}
            <span className="block">{renderGroups(line)}</span>
          </Fragment>
        ))

  return (
    <Tag
      id={id}
      data-testid={testId}
      className={cn(mode === "enter" && "enter-words", className)}
      data-reveal={mode === "reveal" ? "words" : undefined}
      style={style}
    >
      {content}
    </Tag>
  )
}
