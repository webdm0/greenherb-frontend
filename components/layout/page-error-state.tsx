import Link from "next/link"
import type { ReactNode } from "react"
import { IconAlertCircle } from "@tabler/icons-react"
import { PageState } from "@/components/layout/page-state"
import { Button } from "@/components/ui/button"

interface PageErrorStateProps {
  title: string
  description: string
  eyebrow?: ReactNode
  icon?: ReactNode
  titleTag?: "h1" | "h2"
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  secondaryActionHref?: string
  sectionClassName?: string
  cardClassName?: string
  iconContainerClassName?: string
  descriptionClassName?: string
  actionsClassName?: string
}

export function PageErrorState({
  title,
  description,
  eyebrow,
  icon = <IconAlertCircle className="h-10 w-10" stroke={1.9} />,
  titleTag = "h1",
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionHref,
  sectionClassName,
  cardClassName,
  iconContainerClassName,
  descriptionClassName,
  actionsClassName,
}: PageErrorStateProps) {
  const actions = primaryActionLabel || secondaryActionLabel
    ? (
        <>
          {primaryActionLabel && onPrimaryAction ? (
            <Button onClick={onPrimaryAction}>{primaryActionLabel}</Button>
          ) : null}
          {secondaryActionLabel && onSecondaryAction ? (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel && secondaryActionHref ? (
            <Button asChild variant="outline">
              <Link href={secondaryActionHref}>{secondaryActionLabel}</Link>
            </Button>
          ) : null}
        </>
      )
    : undefined

  return (
    <PageState
      titleTag={titleTag}
      eyebrow={eyebrow}
      icon={icon}
      title={title}
      description={description}
      actions={actions}
      sectionClassName={sectionClassName}
      cardClassName={cardClassName}
      iconContainerClassName={iconContainerClassName}
      descriptionClassName={descriptionClassName}
      actionsClassName={actionsClassName}
    />
  )
}
