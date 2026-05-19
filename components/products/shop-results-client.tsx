"use client"

import { useMemo } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ProductCard } from "@/components/products/product-card"
import { ProductGrid } from "@/components/products/product-grid"
import {
  ShopNavigationProvider,
  useShopNavigation,
} from "@/components/products/shop-navigation"
import { SidebarFilters } from "@/components/products/sidebar-filters"
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"
import {
  buildProductSearchParams,
  type ProductQuery,
  type ProductSearchResult,
} from "@/lib/product-query"
import { searchProducts } from "@/services/api/client"

interface ShopResultsClientProps {
  initialQuery: ProductQuery
  initialResult: ProductSearchResult
  lockedCategories?: ProductQuery["categories"]
}

function getQueryKey(query: ProductQuery) {
  const params = new URLSearchParams(buildProductSearchParams(query, {}))
  params.set("pageSize", String(query.pageSize))

  return params.toString()
}

function ShopResults({
  initialQuery,
  initialResult,
}: Omit<ShopResultsClientProps, "lockedCategories">) {
  const navigation = useShopNavigation()
  const { query } = navigation
  const initialQueryKey = useMemo(() => getQueryKey(initialQuery), [initialQuery])
  const queryKey = useMemo(() => getQueryKey(query), [query])
  const productsQuery = useQuery({
    queryKey: ["products", queryKey],
    queryFn: ({ signal }) => searchProducts(query, signal),
    initialData: queryKey === initialQueryKey ? initialResult : undefined,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })

  const result = productsQuery.data ?? initialResult

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <SidebarFilters facets={result.facets} query={navigation.query} />
      <ProductGrid
        query={navigation.query}
        result={result}
        isLoading={productsQuery.isFetching}
      >
        {result.items.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            imagePriority={index === 0}
          />
        ))}
      </ProductGrid>
    </div>
  )
}

export function ShopResultsClient({
  initialQuery,
  initialResult,
  lockedCategories = [],
}: ShopResultsClientProps) {
  return (
    <ReactQueryProvider>
      <ShopNavigationProvider
        lockedCategories={lockedCategories}
        query={initialQuery}
      >
        <ShopResults initialQuery={initialQuery} initialResult={initialResult} />
      </ShopNavigationProvider>
    </ReactQueryProvider>
  )
}
