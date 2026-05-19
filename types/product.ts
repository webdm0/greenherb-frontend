export type ProductCategory =
  | "immunity"
  | "digestive"
  | "stress-sleep"
  | "energy"
  | "joint-mobility"

export type ProductForm =
  | "capsules"
  | "tablets"
  | "powders"
  | "liquid-extracts"
  | "gummies"
  | "teas"

export type DietaryPreference =
  | "organic"
  | "vegan"
  | "gluten-free"
  | "non-gmo"
  | "sugar-free"

export type ProductBadge = "Best Seller" | "New" | "Popular" | "Sale"

export interface Product {
  id: string
  slug?: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  badges?: ProductBadge[]
  inStock: boolean
  organic?: boolean
  category: ProductCategory
  form: ProductForm
  dietary: DietaryPreference[]
  createdAt: string
  soldCount: number
}
