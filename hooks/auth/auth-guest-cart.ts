"use client"

import { getCartFromStorage } from "@/hooks/cart/cart-storage"

export function getGuestCartItemsForAuth() {
  const cartItems = getCartFromStorage()
  const mergedItems = new Map<number, number>()

  for (const item of cartItems) {
    const productId = Number.parseInt(item.product.id, 10)
    const quantity = Math.max(1, Math.floor(item.quantity))

    if (!Number.isInteger(productId) || productId <= 0 || quantity <= 0) {
      continue
    }

    mergedItems.set(productId, (mergedItems.get(productId) ?? 0) + quantity)
  }

  return Array.from(mergedItems.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }))
}
