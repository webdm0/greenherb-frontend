"use client"

import Link from "next/link"
import { IconChevronRight, IconShoppingBag } from "@tabler/icons-react"
import styles from "@/components/layout/breadcrumbs.module.css"

export function CheckoutBreadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
        <li className="min-w-0">
          <Link href="/" className={styles.link}>
            <IconShoppingBag className="h-4 w-4" stroke={1.9} />
            <span>Shop</span>
          </Link>
        </li>
        <li className="flex min-w-0 items-center gap-2">
          <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.75} />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
            className="min-w-0 cursor-pointer break-words text-left text-muted-foreground transition-colors hover:text-foreground"
          >
            Cart
          </button>
        </li>
        <li className="flex min-w-0 items-center gap-2">
          <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.75} />
          <span className="min-w-0 break-words font-medium text-foreground">Checkout</span>
        </li>
      </ol>
    </nav>
  )
}
