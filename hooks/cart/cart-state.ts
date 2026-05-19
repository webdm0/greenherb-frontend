import type { CartItem } from "@/types/cart"
import type { Product } from "@/types/product"

export type CartMode = "guest" | "authenticated"
export type CartSyncStatus = "idle" | "syncing" | "error"

export interface CartState {
  items: CartItem[]
  isHydrated: boolean
  mode: CartMode
  syncStatus: CartSyncStatus
  lastSyncedUserId: number | null
}

export type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "REPLACE_ITEMS"; payload: CartItem[] }
  | { type: "MERGE_ITEMS"; payload: CartItem[] }
  | { type: "SET_MODE"; payload: CartMode }
  | { type: "SET_SYNC_STATUS"; payload: CartSyncStatus }
  | { type: "MARK_SYNCED"; payload: number | null }

export const initialCartState: CartState = {
  items: [],
  isHydrated: false,
  mode: "guest",
  syncStatus: "idle",
  lastSyncedUserId: null,
}

export function normalizeQuantity(quantity: number) {
  return Math.max(1, Math.floor(quantity))
}

function createCartItem(product: Product, quantity: number): CartItem {
  return {
    id: product.id,
    product,
    quantity: normalizeQuantity(quantity),
  }
}

export function mergeCartItems(currentItems: CartItem[], incomingItems: CartItem[]) {
  const merged = new Map<string, CartItem>()

  for (const item of currentItems) {
    merged.set(item.product.id, {
      ...item,
      id: item.product.id,
      quantity: normalizeQuantity(item.quantity),
    })
  }

  for (const item of incomingItems) {
    const existing = merged.get(item.product.id)

    if (existing) {
      merged.set(item.product.id, {
        ...existing,
        product: item.product,
        quantity: existing.quantity + normalizeQuantity(item.quantity),
      })
      continue
    }

    merged.set(item.product.id, {
      ...item,
      id: item.product.id,
      quantity: normalizeQuantity(item.quantity),
    })
  }

  return Array.from(merged.values())
}

function addItemToCart(items: CartItem[], product: Product, quantity: number) {
  return mergeCartItems(items, [createCartItem(product, quantity)])
}

function updateItemQuantity(items: CartItem[], itemId: string, quantity: number) {
  if (quantity <= 0) {
    return items.filter((item) => item.id !== itemId)
  }

  return items.map((item) =>
    item.id === itemId ? { ...item, quantity: normalizeQuantity(quantity) } : item,
  )
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        items: mergeCartItems([], action.payload),
        isHydrated: true,
      }
    case "ADD_ITEM":
      return {
        ...state,
        items: addItemToCart(state.items, action.payload.product, action.payload.quantity),
      }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.itemId),
      }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: updateItemQuantity(
          state.items,
          action.payload.itemId,
          action.payload.quantity,
        ),
      }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }
    case "REPLACE_ITEMS":
      return {
        ...state,
        items: mergeCartItems([], action.payload),
      }
    case "MERGE_ITEMS":
      return {
        ...state,
        items: mergeCartItems(state.items, action.payload),
      }
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
      }
    case "SET_SYNC_STATUS":
      return {
        ...state,
        syncStatus: action.payload,
      }
    case "MARK_SYNCED":
      return {
        ...state,
        lastSyncedUserId: action.payload,
        syncStatus: "idle",
      }
    default:
      return state
  }
}
