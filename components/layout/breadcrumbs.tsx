import Link from "next/link"
import type { ReactNode } from "react"
import { IconChevronRight, IconShoppingBag } from "@tabler/icons-react"
import styles from "./breadcrumbs.module.css"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

interface BreadcrumbsProps {
  rootItem?: BreadcrumbItem
  items: BreadcrumbItem[]
}

const defaultRootItem: BreadcrumbItem = {
  label: "Shop",
  href: "/",
  icon: <IconShoppingBag className="h-4 w-4" stroke={1.9} />,
}
export function Breadcrumbs({ rootItem = defaultRootItem, items }: BreadcrumbsProps) {
  const hasRootLabel = Boolean(rootItem.label)

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
        <li className="min-w-0">
          {rootItem.href ? (
            <Link
              href={rootItem.href}
              className={styles.link}
            >
              {rootItem.icon}
              {hasRootLabel ? <span>{rootItem.label}</span> : null}
              {!hasRootLabel ? <span className="sr-only">{rootItem.label}</span> : null}
            </Link>
          ) : (
            <span className={styles.current}>
              {rootItem.icon}
              {rootItem.label}
            </span>
          )}
        </li>
        {items.map((item, index) => (
          <li
            key={item.href ?? `${item.label}-${index}`}
            className="flex min-w-0 items-center gap-2"
          >
            <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.75} />
            {item.href ? (
              <Link
                href={item.href}
                className="min-w-0 break-words text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="min-w-0 break-words font-medium text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
