import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionDividerTitleProps {
  children: ReactNode
  className?: string
  labelClassName?: string
  lineClassName?: string
  labelTag?: "p" | "span"
}

export function SectionDividerTitle({
  children,
  className,
  labelClassName,
  lineClassName,
  labelTag: LabelTag = "p",
}: SectionDividerTitleProps) {
  return (
    <div className={cn("section-label-divider", className)}>
      <div className={cn("h-px flex-1 bg-border", lineClassName)} />
      <LabelTag className={cn("section-label px-2", labelClassName)}>
        {children}
      </LabelTag>
      <div className={cn("h-px flex-1 bg-border", lineClassName)} />
    </div>
  )
}
