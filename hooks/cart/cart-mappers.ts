import { normalizeQuantity } from "@/hooks/cart/cart-state"
import { mapImageUrl, getImageFallback } from "@/lib/server-mappers"
import type { CartItem, ServerCart, ServerCartItem, ServerCartProduct } from "@/types/cart"
import type {
  DietaryPreference,
  Product,
  ProductCategory,
  ProductForm,
} from "@/types/product"

const validCategories: ProductCategory[] = [
  "immunity",
  "digestive",
  "stress-sleep",
  "energy",
  "joint-mobility",
]

const validForms: ProductForm[] = [
  "capsules",
  "tablets",
  "powders",
  "liquid-extracts",
  "gummies",
  "teas",
]

function toProductCategory(category: string): ProductCategory {
  return validCategories.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : "digestive"
}

function toProductForm(form: string): ProductForm {
  return validForms.includes(form as ProductForm) ? (form as ProductForm) : "capsules"
}

function mapServerProductToProduct(product: ServerCartProduct): Product {
  return {
    id: String(product.id),
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.compareAtPrice ?? undefined,
    image: mapImageUrl(product) || getImageFallback(),
    rating: 0,
    reviewCount: 0,
    inStock: product.inStock,
    category: toProductCategory(product.category),
    form: toProductForm(product.form),
    dietary: [] as DietaryPreference[],
    createdAt: product.createdAt,
    soldCount: 0,
  }
}

function mapServerItemToCartItem(item: ServerCartItem): CartItem {
  return {
    id: String(item.productId),
    product: mapServerProductToProduct(item.product),
    quantity: normalizeQuantity(item.quantity),
  }
}

export function mapServerCartToItems(cart: ServerCart) {
  return cart.items.map(mapServerItemToCartItem)
}

export function getProductId(product: Product) {
  const productId = Number.parseInt(product.id, 10)

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("Product id is invalid for cart sync.")
  }

  return productId
}
