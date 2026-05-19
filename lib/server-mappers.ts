interface ServerProductImage {
  image?: string | null
  imageUrl?: string | null
  productImageUrl?: string | null
  ProductImageUrl?: string | null
}

export function normalizeBackendAssetUrl(value: string | null): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed
  }

  if (trimmed.startsWith("/backend/")) {
    return trimmed
  }

  if (trimmed.startsWith("/")) {
    return `/backend${trimmed}`
  }

  return `/backend/${trimmed}`
}

export function mapImageUrl(serverProduct: ServerProductImage): string | null {
  return normalizeBackendAssetUrl(
    serverProduct.image ||
    serverProduct.ProductImageUrl ||
    serverProduct.productImageUrl ||
    serverProduct.imageUrl ||
    null,
  )
}

export function mapImageUrlWithFallback(serverProduct: ServerProductImage, fallback: string = getImageFallback()): string {
  return mapImageUrl(serverProduct) || fallback
}

export function getImageFallback(): string {
  return "/products/ashwagandha.jpg"
}
