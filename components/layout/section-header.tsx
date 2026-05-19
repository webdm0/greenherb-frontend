import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  titleTag?: "h1" | "h2" | "h3"
  className?: string
  contentClassName?: string
  eyebrowClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  actionsClassName?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  titleTag: TitleTag = "h2",
  className,
  contentClassName,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("section-header-inline", className)}>
      <div className={cn("section-header", contentClassName)}>
        {eyebrow ? (
          <p className={cn("eyebrow-label-wide", eyebrowClassName)}>{eyebrow}</p>
        ) : null}
        <TitleTag className={cn("section-card-heading", titleClassName)}>
          {title}
        </TitleTag>
        {description ? (
          <p className={cn("section-copy", descriptionClassName)}>{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className={cn("shrink-0", actionsClassName)}>
          {actions}
        </div>
      ) : null}
    </div>
  )
}
