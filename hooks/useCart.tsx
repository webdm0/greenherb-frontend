"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react"
import { useAuth } from "@/components/auth/auth-provider"
import {
  cartReducer,
  initialCartState,
  normalizeQuantity,
  type CartMode,
  type CartSyncStatus,
} from "@/hooks/cart/cart-state"
import { clearCartStorage, getCartFromStorage, saveCartToStorage } from "@/hooks/cart/cart-storage"
import { getProductId, mapServerCartToItems } from "@/hooks/cart/cart-mappers"
import {
  addCartItem,
  clearServerCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/api/client"
import type { CartItem, ServerCart } from "@/types/cart"
import type { Product } from "@/types/product"

interface CartContextValue {
  items: CartItem[]
  isHydrated: boolean
  mode: CartMode
  syncStatus: CartSyncStatus
  lastSyncedUserId: number | null
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  replaceItems: (items: CartItem[]) => void
  mergeItems: (items: CartItem[]) => void
  getSubtotal: number
  getItemCount: number
}

interface CartActionsContextValue {
  addItem: (product: Product, quantity?: number) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)
const CartActionsContext = createContext<CartActionsContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated, isLoading, user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const previousUserIdRef = useRef<number | null>(null)

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: getCartFromStorage() })
  }, [])

  useEffect(() => {
    if (!state.isHydrated || isLoading) {
      return
    }

    const nextMode = isAuthenticated && user && accessToken ? "authenticated" : "guest"

    if (state.mode !== nextMode) {
      if (state.mode === "authenticated" && nextMode === "guest") {
        previousUserIdRef.current = null
        clearCartStorage()
        dispatch({ type: "CLEAR_CART" })
        dispatch({ type: "SET_SYNC_STATUS", payload: "idle" })
      }

      dispatch({ type: "SET_MODE", payload: nextMode })
    }
  }, [accessToken, isAuthenticated, isLoading, state.isHydrated, state.mode, user])

  useEffect(() => {
    if (!state.isHydrated || state.mode !== "guest") {
      return
    }

    saveCartToStorage(state.items)
  }, [state.isHydrated, state.items, state.mode])

  useEffect(() => {
    if (state.mode === "authenticated") {
      clearCartStorage()
    }
  }, [state.mode])

  useEffect(() => {
    if (!state.isHydrated || isLoading) {
      return
    }

    if (!isAuthenticated || !user || !accessToken) {
      previousUserIdRef.current = null
      dispatch({ type: "SET_SYNC_STATUS", payload: "idle" })
      return
    }

    if (previousUserIdRef.current === user.id) {
      return
    }

    let cancelled = false
    dispatch({ type: "SET_SYNC_STATUS", payload: "syncing" })

    const syncCart = async () => {
      try {
        const serverCart = await getCart()

        if (cancelled) {
          return
        }

        dispatch({ type: "REPLACE_ITEMS", payload: mapServerCartToItems(serverCart) })
        dispatch({ type: "MARK_SYNCED", payload: user.id })
        clearCartStorage()
        previousUserIdRef.current = user.id
      } catch {
        if (!cancelled) {
          dispatch({ type: "SET_SYNC_STATUS", payload: "error" })
        }
      }
    }

    void syncCart()

    return () => {
      cancelled = true
    }
  }, [accessToken, isAuthenticated, isLoading, state.isHydrated, state.items, user])

  const syncServerCart = useCallback(
    async (requestPromise: Promise<ServerCart>) => {
      dispatch({ type: "SET_SYNC_STATUS", payload: "syncing" })

      try {
        const serverCart = await requestPromise
        dispatch({ type: "REPLACE_ITEMS", payload: mapServerCartToItems(serverCart) })
        dispatch({ type: "MARK_SYNCED", payload: user?.id ?? null })
        clearCartStorage()
      } catch (error) {
        dispatch({ type: "SET_SYNC_STATUS", payload: "error" })
        throw error
      }
    },
    [user?.id],
  )

  const addItemToState = useCallback(
    async (product: Product, quantity: number = 1) => {
      if (state.mode === "authenticated" && accessToken) {
        await syncServerCart(addCartItem(getProductId(product), quantity))
        return
      }

      dispatch({ type: "ADD_ITEM", payload: { product, quantity } })
    },
    [accessToken, state.mode, syncServerCart],
  )

  const removeItemFromState = useCallback(
    async (itemId: string) => {
      if (state.mode === "authenticated" && accessToken) {
        await syncServerCart(removeCartItem(Number.parseInt(itemId, 10)))
        return
      }

      dispatch({ type: "REMOVE_ITEM", payload: { itemId } })
    },
    [accessToken, state.mode, syncServerCart],
  )

  const updateItemQuantityInState = useCallback(
    async (itemId: string, quantity: number) => {
      if (state.mode === "authenticated" && accessToken) {
        if (quantity <= 0) {
          await syncServerCart(removeCartItem(Number.parseInt(itemId, 10)))
          return
        }

        await syncServerCart(
          updateCartItem(Number.parseInt(itemId, 10), normalizeQuantity(quantity)),
        )
        return
      }

      dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } })
    },
    [accessToken, state.mode, syncServerCart],
  )

  const clearCartItems = useCallback(async () => {
    if (state.mode === "authenticated" && accessToken) {
      await syncServerCart(clearServerCart())
      return
    }

    dispatch({ type: "CLEAR_CART" })
  }, [accessToken, state.mode, syncServerCart])

  const replaceItems = useCallback((items: CartItem[]) => {
    dispatch({ type: "REPLACE_ITEMS", payload: items })
  }, [])

  const mergeItems = useCallback((items: CartItem[]) => {
    dispatch({ type: "MERGE_ITEMS", payload: items })
  }, [])

  const actionsValue = useMemo<CartActionsContextValue>(
    () => ({
      addItem: addItemToState,
    }),
    [addItemToState],
  )

  const value = useMemo<CartContextValue>(() => {
    const getSubtotal = state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
    const getItemCount = state.items.reduce((total, item) => total + item.quantity, 0)

    return {
      items: state.items,
      isHydrated: state.isHydrated,
      mode: state.mode,
      syncStatus: state.syncStatus,
      lastSyncedUserId: state.lastSyncedUserId,
      addItem: addItemToState,
      removeItem: removeItemFromState,
      updateQuantity: updateItemQuantityInState,
      clearCart: clearCartItems,
      replaceItems,
      mergeItems,
      getSubtotal,
      getItemCount,
    }
  }, [
    addItemToState,
    clearCartItems,
    mergeItems,
    removeItemFromState,
    replaceItems,
    state.isHydrated,
    state.lastSyncedUserId,
    state.items,
    state.mode,
    state.syncStatus,
    updateItemQuantityInState,
  ])

  return (
    <CartActionsContext.Provider value={actionsValue}>
      <CartContext.Provider value={value}>{children}</CartContext.Provider>
    </CartActionsContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}

export function useCartActions() {
  const context = useContext(CartActionsContext)

  if (!context) {
    throw new Error("useCartActions must be used within CartProvider")
  }

  return context
}
