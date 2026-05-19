import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageStateProps {
  icon: ReactNode
  eyebrow?: ReactNode
  title: ReactNode
  description: ReactNode
  actions?: ReactNode
  titleTag?: "h1" | "h2"
  sectionClassName?: string
  cardClassName?: string
  iconContainerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  actionsClassName?: string
}

export function PageState({
  icon,
  eyebrow,
  title,
  description,
  actions,
  titleTag = "h1",
  sectionClassName = "page-state-section",
  cardClassName = "page-state-card",
  iconContainerClassName = "page-state-icon",
  titleClassName,
  descriptionClassName,
  actionsClassName,
}: PageStateProps) {
  const TitleTag = titleTag

  return (
    <section className={sectionClassName}>
      <div className={cardClassName}>
        <div className={iconContainerClassName}>{icon}</div>
        {eyebrow ? <p className="eyebrow-label-wide mt-6">{eyebrow}</p> : null}
        <TitleTag className={cn("page-state-title", titleClassName)}>{title}</TitleTag>
        <p className={cn("page-state-copy", descriptionClassName)}>{description}</p>
        {actions ? (
          <div className={cn("page-state-actions", actionsClassName)}>
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  )
}
