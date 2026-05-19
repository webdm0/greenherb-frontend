import { del, get, post, put } from "@/services/api/request"
import type { ServerCart } from "@/types/cart"

export const getCart = () => get<ServerCart>("/api/cart")

export const addCartItem = (productId: number, quantity: number) =>
  post<ServerCart>("/api/cart/items", { productId, quantity })

export const updateCartItem = (productId: number, quantity: number) =>
  put<ServerCart>(`/api/cart/items/${productId}`, { quantity })

export const removeCartItem = (productId: number) =>
  del<ServerCart>(`/api/cart/items/${productId}`)

export const clearServerCart = () => del<ServerCart>("/api/cart")
