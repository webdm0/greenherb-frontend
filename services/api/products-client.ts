import {
  buildProductSearchParams,
  type ProductQuery,
  type ProductSearchResult,
} from "@/lib/product-query"
import { normalizeBackendAssetUrl } from "@/lib/server-mappers"
import { get } from "@/services/api/request"

function mapProductSearchResult(result: ProductSearchResult): ProductSearchResult {
  return {
    ...result,
    items: result.items.map((item) => ({
      ...item,
      image: normalizeBackendAssetUrl(item.image) || item.image,
    })),
  }
}

export async function searchProducts(query: ProductQuery, signal?: AbortSignal) {
  const searchParams = buildProductSearchParams(query, { page: query.page })
  const params = new URLSearchParams(searchParams)

  params.set("pageSize", String(query.pageSize))

  const result = await get<ProductSearchResult>(`/api/products?${params.toString()}`, signal)
  return mapProductSearchResult(result)
}
