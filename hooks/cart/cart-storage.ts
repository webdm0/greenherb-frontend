"use client"

import type { CartItem } from "@/types/cart"
import { mergeCartItems } from "@/hooks/cart/cart-state"

const CART_STORAGE_KEY = "greenherb-cart"
const CART_EXPIRY_DAYS = 7

interface CartStorage {
  items: CartItem[]
  timestamp: number
}

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return []

    const cartData: CartStorage = JSON.parse(stored)
    const now = Date.now()
    const expiryTime = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000

    if (now - cartData.timestamp > expiryTime) {
      localStorage.removeItem(CART_STORAGE_KEY)
      return []
    }

    return Array.isArray(cartData.items) ? mergeCartItems([], cartData.items) : []
  } catch {
    return []
  }
}

export function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return

  try {
    const cartData: CartStorage = {
      items,
      timestamp: Date.now(),
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
  } catch {
  }
}

export function clearCartStorage() {
  if (typeof window === "undefined") return
  localStorage.removeItem(CART_STORAGE_KEY)
}
