"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  buildProductSearchParams,
  parseProductQuery,
  type ProductQuery,
} from "@/lib/product-query"

type ProductQueryUpdates = Parameters<typeof buildProductSearchParams>[1]

interface ShopNavigationOptions {
  replace?: boolean
  scroll?: boolean
}

interface ShopNavigationContextValue {
  isPending: boolean
  pathname: string
  query: ProductQuery
  navigate: (updates: ProductQueryUpdates, options?: ShopNavigationOptions) => void
}

const ShopNavigationContext = createContext<ShopNavigationContextValue | null>(
  null,
)

function searchParamsToRecord(searchParams: URLSearchParams) {
  const record: Record<string, string | string[] | undefined> = {}

  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key)

    record[key] = values.length > 1 ? values : values[0]
  }

  return record
}

function scrollToTop() {
  if (typeof window === "undefined") {
    return
  }

  window.scrollTo({
    top: 0,
    behavior: "auto",
  })
}

export function ShopNavigationProvider({
  children,
  lockedCategories = [],
  query: initialQuery,
}: {
  children: ReactNode
  lockedCategories?: ProductQuery["categories"]
  query: ProductQuery
}) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [optimisticQuery, setOptimisticQuery] = useState({
    ...initialQuery,
    categories: lockedCategories.length > 0 ? lockedCategories : initialQuery.categories,
  })
  const [isTransitionPending, startTransition] = useTransition()
  const queryRef = useRef(optimisticQuery)

  useEffect(() => {
    queryRef.current = optimisticQuery
  }, [optimisticQuery])

  useEffect(() => {
    const actualQuery = parseProductQuery(searchParamsToRecord(searchParams))

    setOptimisticQuery({
      ...actualQuery,
      categories: lockedCategories.length > 0 ? lockedCategories : actualQuery.categories,
    })
  }, [lockedCategories, searchParams])

  const commitNavigation = (href: string, options: ShopNavigationOptions = {}) => {
    if (options.scroll) {
      scrollToTop()
    }

    if (options.replace) {
      router.replace(href, { scroll: options.scroll ?? false })
      return
    }

    router.push(href, { scroll: options.scroll ?? false })
  }

  const value = useMemo<ShopNavigationContextValue>(
    () => ({
      isPending: isTransitionPending,
      pathname,
      query: optimisticQuery,
      navigate: (updates, options = {}) => {
        const nextInternalQuery = {
          ...queryRef.current,
          ...updates,
          categories:
            lockedCategories.length > 0
              ? lockedCategories
              : updates.categories ?? queryRef.current.categories,
        }
        const urlQuery = {
          ...nextInternalQuery,
          categories:
            lockedCategories.length > 0 ? [] : nextInternalQuery.categories,
        }
        const search = buildProductSearchParams(urlQuery, {})
        const nextQuery = parseProductQuery(
          searchParamsToRecord(new URLSearchParams(search)),
        )
        const nextOptimisticQuery = {
          ...nextQuery,
          categories:
            lockedCategories.length > 0 ? lockedCategories : nextQuery.categories,
        }

        setOptimisticQuery(nextOptimisticQuery)
        queryRef.current = nextOptimisticQuery

        startTransition(() => {
          commitNavigation(search ? `${pathname}?${search}` : pathname, {
            replace: options.replace ?? true,
            scroll: options.scroll ?? false,
          })
        })
      },
    }),
    [
      isTransitionPending,
      lockedCategories,
      optimisticQuery,
      pathname,
      router,
    ],
  )

  return (
    <ShopNavigationContext.Provider value={value}>
      {children}
    </ShopNavigationContext.Provider>
  )
}

export function useShopNavigation() {
  const context = useContext(ShopNavigationContext)

  if (!context) {
    throw new Error("useShopNavigation must be used within ShopNavigationProvider")
  }

  return context
}
