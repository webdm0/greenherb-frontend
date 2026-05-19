import type { Product } from "@/types/product"

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface ServerCartProduct {
  id: number
  name: string
  description: string
  imageUrl: string | null
  price: number
  compareAtPrice: number | null
  category: string
  form: string
  inStock: boolean
  createdAt: string
}

export interface ServerCartItem {
  id: number
  productId: number
  quantity: number
  unitPrice: number
  product: ServerCartProduct
}

export interface ServerCart {
  items: ServerCartItem[]
  subtotal: number
  itemCount: number
  updatedAt: string
}
