"use client"

import Link from "next/link"
import { type ReactNode } from "react"
import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { SoftPendingState } from "@/components/layout/loading-skeletons"
import { ProductResultsSummary } from "@/components/products/product-results-summary"
import { ProductSortSelect } from "@/components/products/product-sort-select"
import { useShopNavigation } from "@/components/products/shop-navigation"
import { Button } from "@/components/ui/button"
import {
  buildProductHref,
  type ProductQuery,
  type ProductSearchResult,
} from "@/lib/product-query"
import { cn } from "@/lib/utils"
import styles from "./product-grid.module.css"

interface ProductGridProps {
  query: ProductQuery
  result: ProductSearchResult
  children: ReactNode
  isLoading?: boolean
}

type PaginationItem = number | "start-ellipsis" | "end-ellipsis"

function getVisibleRange(result: ProductSearchResult) {
  if (result.total === 0) {
    return { from: 0, to: 0 }
  }

  return {
    from: (result.page - 1) * result.pageSize + 1,
    to: Math.min(result.page * result.pageSize, result.total),
  }
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ]
}

function getUrlQuery(pathname: string, query: ProductQuery) {
  if (pathname === "/") {
    return query
  }

  return {
    ...query,
    categories: [],
  }
}

function PaginationNavButton({
  children,
  disabled,
}: {
  children: ReactNode
  disabled: boolean
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="pagination-nav-button"
      disabled={disabled}
      asChild={!disabled}
    >
      {children}
    </Button>
  )
}

function PaginationEllipsis() {
  return (
    <span className="pagination-ellipsis" aria-hidden="true">
      ...
    </span>
  )
}

function PaginationPageButton({
  href,
  isCurrent,
  page,
}: {
  href: string
  isCurrent: boolean
  page: number
}) {
  if (isCurrent) {
    return (
      <span
        aria-current="page"
        className={cn(
          "pagination-page-button inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground",
        )}
      >
        {page}
      </span>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "pagination-page-button",
        "border-border text-foreground hover:bg-secondary",
      )}
      asChild
    >
      <Link href={href}>{page}</Link>
    </Button>
  )
}

export function ProductGrid({
  query,
  result,
  children,
  isLoading = false,
}: ProductGridProps) {
  const navigation = useShopNavigation()
  const isPending = navigation.isPending || isLoading
  const urlQuery = getUrlQuery(navigation.pathname, query)
  const visibleRange = getVisibleRange(result)

  return (
    <div className="flex-1">
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <ProductResultsSummary
          from={visibleRange.from}
          to={visibleRange.to}
          total={result.total}
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="hidden type-body-sm sm:inline">
              Sort by:
            </span>
            <ProductSortSelect value={navigation.query.sort} />
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          className={cn(
            "transition-opacity duration-200",
            isPending && "opacity-55",
          )}
          aria-busy={isPending}
        >
          {result.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {children}
            </div>
          ) : (
            <div className={cn("product-card-shell", styles.emptyState)}>
              <h2 className="type-heading-xl">
                No products found
              </h2>
              <p className="mt-2 type-body-sm">
                Try clearing a filter or choosing a wider price range.
              </p>
            </div>
          )}
        </div>
        {isPending ? <SoftPendingState label="Updating products..." /> : null}
      </div>
      {result.totalPages > 1 && (
        <div className="pagination-controls">
          <PaginationNavButton disabled={result.page === 1}>
            {result.page > 1 ? (
              <Link
                href={buildProductHref(
                  urlQuery,
                  { page: result.page - 1 },
                  navigation.pathname,
                )}
                aria-label="Previous page"
              >
                <IconChevronLeft className="pagination-icon" stroke={1.75} />
              </Link>
            ) : (
              <IconChevronLeft className="pagination-icon" stroke={1.75} />
            )}
          </PaginationNavButton>

          {getPaginationItems(result.page, result.totalPages).map((item) => {
            if (typeof item !== "number") {
              return <PaginationEllipsis key={item} />
            }

            const page = item
            const href = buildProductHref(urlQuery, { page }, navigation.pathname)

            return (
              <PaginationPageButton
                key={page}
                href={href}
                isCurrent={page === result.page}
                page={page}
              />
            )
          })}

          <PaginationNavButton disabled={result.page === result.totalPages}>
            {result.page < result.totalPages ? (
              <Link
                href={buildProductHref(
                  urlQuery,
                  { page: result.page + 1 },
                  navigation.pathname,
                )}
                aria-label="Next page"
              >
                <IconChevronRight className="pagination-icon" stroke={1.75} />
              </Link>
            ) : (
              <IconChevronRight className="pagination-icon" stroke={1.75} />
            )}
          </PaginationNavButton>
        </div>
      )}
    </div>
  )
}
