import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./section-intro.module.css"

interface SectionIntroProps {
  eyebrow: string
  title: string
  description?: string
  icon: ReactNode
  className?: string
  iconClassName?: string
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  icon,
  className,
  iconClassName = styles.iconContainer,
}: SectionIntroProps) {
  return (
    <div className={cn(styles.root, className)}>
      <div className={iconClassName}>{icon}</div>
      <div className="min-w-0">
        <p className="eyebrow-label">{eyebrow}</p>
        <h2 className="section-card-heading">{title}</h2>
        {description ? <p className="section-copy">{description}</p> : null}
      </div>
    </div>
  )
}
