import { cache } from "react"
import type { ProductSearchResult, ProductQuery } from "@/lib/product-query"
import { buildProductSearchParams, PRICE_RANGE } from "@/lib/product-query"
import type { ProductDetail } from "@/lib/product-detail"
import { getBackendOrigin } from "@/lib/backend-origin"
import { cacheTags } from "@/lib/cache-tags"
import { mapImageUrlWithFallback, normalizeBackendAssetUrl } from "@/lib/server-mappers"

function mapProductSearchResult(result: ProductSearchResult): ProductSearchResult {
  return {
    ...result,
    items: result.items.map((item) => ({
      ...item,
      image: normalizeBackendAssetUrl(item.image) || item.image,
    })),
  }
}

function mapProductDetail(detail: ProductDetail): ProductDetail {
  return {
    ...detail,
    imageUrl: mapImageUrlWithFallback(detail),
  }
}

export async function getProducts(query: ProductQuery): Promise<ProductSearchResult> {
  const backendOrigin = getBackendOrigin()
  const searchParams = new URLSearchParams(
    buildProductSearchParams(query, { page: query.page }),
  )
  const url = new URL(`${backendOrigin}/api/products`)
  const hasSearchQuery = query.search.trim().length > 0

  searchParams.set("pageSize", String(query.pageSize))
  url.search = searchParams.toString()

  const response = await fetch(url, {
    ...(hasSearchQuery
      ? { cache: "no-store" as const }
      : { next: { tags: [cacheTags.products] } }),
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status}`)
  }

  const result = await response.json() as ProductSearchResult
  return mapProductSearchResult(result)
}

const getProductBySlugCached = cache(async (slug: string): Promise<ProductDetail | null> => {
  const backendOrigin = getBackendOrigin()
  const response = await fetch(`${backendOrigin}/api/products/${encodeURIComponent(slug)}`, {
    next: { tags: [cacheTags.products] },
    headers: {
      Accept: "application/json",
    },
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to load product ${slug}: ${response.status}`)
  }

  const detail = await response.json() as ProductDetail
  return mapProductDetail(detail)
})

export function getProductBySlug(slug: string) {
  return getProductBySlugCached(slug)
}

const getStaticProductSlugsCached = cache(async () => {
  const backendOrigin = getBackendOrigin()
  const response = await fetch(`${backendOrigin}/api/products/all-slugs`, {
    next: { tags: [cacheTags.products] },
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load product slugs: ${response.status}`)
  }

  const slugs = (await response.json()) as unknown

  if (!Array.isArray(slugs)) {
    return []
  }

  return slugs.filter(
    (slug): slug is string => typeof slug === "string" && slug.length > 0,
  )
})

export function getStaticProductSlugs() {
  return getStaticProductSlugsCached()
}

const getRelatedProductsCached = cache(async (
  category: ProductQuery["categories"][number],
  currentSlug: string,
) => {
  const result = await getProducts({
    search: "",
    categories: [category],
    forms: [],
    dietary: [],
    availability: [],
    minPrice: PRICE_RANGE.min,
    maxPrice: PRICE_RANGE.max,
    sort: "featured",
    page: 1,
    pageSize: 4,
  })

  return result.items
    .filter((product) => product.slug !== currentSlug)
    .slice(0, 3)
})

export function getRelatedProducts(
  category: ProductQuery["categories"][number],
  currentSlug: string,
) {
  return getRelatedProductsCached(category, currentSlug)
}
