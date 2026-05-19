import { categoryLabels } from "@/lib/product-query"
import type { ProductCategory } from "@/types/product"

export const headerCategoryLabels: Record<ProductCategory, string> = {
  immunity: "Immunity",
  digestive: "Digestion",
  "stress-sleep": "Sleep",
  energy: "Energy",
  "joint-mobility": "Mobility",
}

export const headerCategoryLinks = Object.entries(categoryLabels) as [
  ProductCategory,
  string,
][]
