import type { Product } from "@/types/product"
import { mapImageUrlWithFallback } from "./server-mappers"

export interface ProductDetail {
  id: number
  name: string
  slug: string
  sku: string
  brand: string
  category: Product["category"]
  form: Product["form"]
  dosage: string
  servingSize: string
  countInPack: number | null
  servingsPerContainer: number | null
  shortDescription: string
  description: string
  ingredients: string
  howToUse: string
  warnings: string
  imageUrl: string
  price: number
  compareAtPrice: number | null
  quantityInStock: number
  dietary: Product["dietary"]
  rating: number
  reviewCount: number
  soldCount: number
  isFeatured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function productDetailToCatalogProduct(detail: ProductDetail): Product {
  const badges: NonNullable<Product["badges"]> = []

  if (detail.soldCount >= 1000) {
    badges.push("Best Seller")
  }

  if (detail.reviewCount < 40) {
    badges.push("New")
  }

  if (detail.isFeatured) {
    badges.push("Popular")
  }

  if (detail.compareAtPrice && detail.compareAtPrice > detail.price) {
    badges.push("Sale")
  }

  return {
    id: String(detail.id),
    slug: detail.slug,
    name: detail.name,
    description: detail.shortDescription,
    price: detail.price,
    originalPrice: detail.compareAtPrice ?? undefined,
    image: mapImageUrlWithFallback(detail),
    rating: detail.rating,
    reviewCount: detail.reviewCount,
    badges,
    inStock: detail.quantityInStock > 0,
    organic: detail.dietary.includes("organic"),
    category: detail.category,
    form: detail.form,
    dietary: detail.dietary,
    createdAt: detail.createdAt,
    soldCount: detail.soldCount,
  }
}
