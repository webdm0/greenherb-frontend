import type { ReactNode } from "react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { cn } from "@/lib/utils"

interface PageHeroInfoItem {
  icon: ReactNode
  content: ReactNode
}

interface PageHeroProps {
  breadcrumbs?: ReactNode
  eyebrow: string
  title: ReactNode
  description: ReactNode
  asideTitle?: string
  asideItems?: PageHeroInfoItem[]
  aside?: ReactNode
  contentClassName?: string
  bodyClassName?: string
  eyebrowClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  asideTitle,
  asideItems = [],
  aside,
  contentClassName,
  bodyClassName,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: PageHeroProps) {
  return (
    <section className="page-hero-section">
      <div className="page-hero-glow absolute inset-x-0 top-0 h-40" />
      <div className="page-shell relative">
        {breadcrumbs}

        <div className={cn("page-hero-content", contentClassName)}>
          <div className={cn("page-hero-body", bodyClassName)}>
            <p className={cn("eyebrow-label-wide", eyebrowClassName)}>{eyebrow}</p>
            <h1 className={cn("page-hero-title", titleClassName)}>{title}</h1>
            <div className={cn("page-hero-copy", descriptionClassName)}>{description}</div>
          </div>

          {aside ??
            (asideTitle && asideItems.length > 0 ? (
              <div className="hero-info-card">
                <p className="eyebrow-label">{asideTitle}</p>
                <div className="mt-4 grid gap-3 text-sm text-foreground">
                  {asideItems.map((item, index) => (
                    <div key={index} className="hero-info-row">
                      {item.icon}
                      {item.content}
                    </div>
                  ))}
                </div>
              </div>
            ) : null)}
        </div>
      </div>
    </section>
  )
}

export { Breadcrumbs }
