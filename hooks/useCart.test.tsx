"use client"

import type { ReactNode } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CartProvider, useCart } from "@/hooks/useCart"
import type { AuthUser } from "@/types/auth"

const getCartMock = vi.fn()
const addCartItemMock = vi.fn()
const clearServerCartMock = vi.fn()
const removeCartItemMock = vi.fn()
const updateCartItemMock = vi.fn()

let mockAuthState: {
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
} = {
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  user: null,
}

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => mockAuthState,
}))

vi.mock("@/services/api/client", () => ({
  getCart: () => getCartMock(),
  addCartItem: (...args: unknown[]) => addCartItemMock(...args),
  clearServerCart: () => clearServerCartMock(),
  removeCartItem: (...args: unknown[]) => removeCartItemMock(...args),
  updateCartItem: (...args: unknown[]) => updateCartItemMock(...args),
}))

describe("CartProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockAuthState = {
      accessToken: "access-token",
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: 42,
        username: "cart-user",
        email: "cart@example.com",
        isAdmin: false,
      },
    }

    getCartMock.mockResolvedValue({
      items: [
        {
          id: 1,
          productId: 1,
          quantity: 2,
          unitPrice: 19.99,
          product: {
            id: 1,
            name: "Omega 3",
            description: "Fish oil",
            imageUrl: "/omega.jpg",
            price: 19.99,
            compareAtPrice: null,
            category: "digestive",
            form: "capsules",
            inStock: true,
            createdAt: "2026-05-06T00:00:00.000Z",
          },
        },
      ],
      subtotal: 39.98,
      itemCount: 2,
      updatedAt: "2026-05-06T00:00:00.000Z",
    })
  })

  it("clears client cart state when an authenticated user logs out", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )

    const { result, rerender } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1)
    })

    expect(result.current.items[0]?.quantity).toBe(2)

    mockAuthState = {
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    }

    rerender()

    await waitFor(() => {
      expect(result.current.mode).toBe("guest")
      expect(result.current.items).toHaveLength(0)
    })

    const storedCart = localStorage.getItem("greenherb-cart")
    expect(storedCart).not.toBeNull()

    const parsedCart = JSON.parse(storedCart ?? "{}") as {
      items?: unknown[]
      timestamp?: number
    }

    expect(parsedCart.items).toEqual([])
    expect(typeof parsedCart.timestamp).toBe("number")
  })
})
