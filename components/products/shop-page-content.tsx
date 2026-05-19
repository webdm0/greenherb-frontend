import { Suspense } from "react"
import { IconShoppingBag } from "@tabler/icons-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ProductCard } from "@/components/products/product-card"
import { ProductResultsSummary } from "@/components/products/product-results-summary"
import { ShopResultsClient } from "@/components/products/shop-results-client"
import {
  categoryLabels,
  parseProductQuery,
  type ProductSearchParams,
  type ProductSearchResult,
} from "@/lib/product-query"
import { getProducts } from "@/services/api/server/products"
import type { ProductCategory } from "@/types/product"

export const categoryDescriptions: Record<ProductCategory, string> = {
  immunity:
    "Support for everyday immune health, from daily vitamins and herbal blends to simple staples you can keep in your routine year-round.",
  digestive:
    "Products for daily digestive support, including gut-friendly supplements, herbal teas, and simple formulas for comfort and balance.",
  "stress-sleep":
    "Evening teas, calming blends, and sleep support products made for winding down, relaxing, and building a steadier nighttime routine.",
  energy:
    "Everyday energy and focus support, with vitamins, adaptogens, and practical formulas that fit easily into a daytime routine.",
  "joint-mobility":
    "Joint and movement support products made for everyday comfort, flexibility, and staying active with less stiffness throughout the day.",
}

interface ShopPageContentProps {
  lockedCategory?: ProductCategory
  searchParams?: ProductSearchParams
}

function StaticShopResults({ result }: { result: ProductSearchResult }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="hidden lg:block w-64 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <div className="mb-6 border-b border-border pb-4">
          <ProductResultsSummary
            from={result.total === 0 ? 0 : 1}
            to={Math.min(result.pageSize, result.total)}
            total={result.total}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              imagePriority={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export async function ShopPageContent({
  lockedCategory,
  searchParams = {},
}: ShopPageContentProps) {
  const parsedQuery = parseProductQuery(searchParams)
  const productQuery = lockedCategory
    ? {
        ...parsedQuery,
        categories: [lockedCategory],
      }
    : parsedQuery
  const productResult = await getProducts(productQuery)
  const activeCategory =
    productQuery.categories.length === 1 ? productQuery.categories[0] : null
  const pageTitle = activeCategory
    ? categoryLabels[activeCategory]
    : "All Products"
  const pageDescription = activeCategory
    ? categoryDescriptions[activeCategory]
    : "Browse our full collection of supplements, herbal teas, vitamins, and everyday support products for sleep, digestion, energy, immunity, and more."

  return (
    <main className="flex-1">
      <div className="bg-secondary/50 border-b border-border">
        <div className="page-shell">
          <Breadcrumbs
            rootItem={{
              label: "Shop",
              href: lockedCategory ? "/" : undefined,
              icon: <IconShoppingBag className="h-4 w-4" stroke={1.9} />,
            }}
            items={activeCategory ? [{ label: categoryLabels[activeCategory] }] : []}
          />
          <div className="pb-4 sm:pb-6">
            <h1 className="font-serif text-2xl font-semibold text-foreground text-balance sm:text-3xl md:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty sm:text-base">
              {pageDescription}
            </p>
          </div>
        </div>
      </div>
      <div className="page-shell py-8">
        <Suspense fallback={<StaticShopResults result={productResult} />}>
          <ShopResultsClient
            initialQuery={productQuery}
            initialResult={productResult}
            lockedCategories={lockedCategory ? [lockedCategory] : []}
          />
        </Suspense>
      </div>
    </main>
  )
}
