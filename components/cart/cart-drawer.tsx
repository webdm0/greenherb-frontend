"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconAlertCircle,
  IconMinus,
  IconPlus,
  IconShoppingBag,
  IconTrash,
} from "@tabler/icons-react"
import { ProductImageThumb } from "@/components/products/product-image-thumb"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCart } from "@/hooks/useCart"
import { formatCurrency } from "@/lib/formatters"
import styles from "./cart-drawer.module.css"

interface CartDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CartDrawer({ open: openProp, onOpenChange }: CartDrawerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    itemId: string
    type: "decrease" | "increase" | "remove"
  } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const { items, removeItem, updateQuantity, getSubtotal, syncStatus } = useCart()
  const subtotal = getSubtotal
  const open = openProp ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen
  const isCartBusy = pendingAction !== null || syncStatus === "syncing"

  const runCartAction = async (
    itemId: string,
    type: "decrease" | "increase" | "remove",
    action: () => Promise<void>,
  ) => {
    if (isCartBusy) {
      return
    }

    setPendingAction({ itemId, type })
    setActionError(null)

    try {
      await action()
    } catch (error) {
      setActionError(
        error instanceof Error && error.message
          ? error.message
          : "We could not update your cart. Please try again.",
      )
    } finally {
      setPendingAction(null)
    }
  }

  const isActionPending = (
    itemId: string,
    type: "decrease" | "increase" | "remove",
  ) => pendingAction?.itemId === itemId && pendingAction.type === type

  const pendingSpinner = (
    <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="app-surface w-full p-0 sm:max-w-md">
        <div className="flex min-h-0 flex-1 flex-col">
          <SheetHeader className="border-b border-border p-6 pr-12">
            <SheetTitle className="type-heading-2xl">
              Your Cart
            </SheetTitle>
            <SheetDescription>
              Review your items before checkout.
            </SheetDescription>
          </SheetHeader>

          {items.length > 0 ? (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={styles.itemRow}
                    >
                      <ProductImageThumb
                        src={item.product.image}
                        alt={item.product.name}
                        sizes="72px"
                        containerClassName="aspect-square rounded-xl"
                      />
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="type-heading-base">
                              {item.product.name}
                            </h3>
                            <p className="mt-1 type-body-sm">
                              {formatCurrency(item.product.price, "USD")}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Remove ${item.product.name}`}
                            disabled={isCartBusy}
                            onClick={() =>
                              void runCartAction(item.id, "remove", () => removeItem(item.id))
                            }
                          >
                            {isActionPending(item.id, "remove") ? (
                              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
                            ) : (
                              <IconTrash className="h-4 w-4" stroke={1.9} />
                            )}
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-border bg-background">
                            <button
                              type="button"
                              className="cursor-pointer p-2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label={`Decrease ${item.product.name} quantity`}
                              disabled={isCartBusy}
                              onClick={() =>
                                void runCartAction(item.id, "decrease", () =>
                                  updateQuantity(item.id, item.quantity - 1)
                                )
                              }
                            >
                              {isActionPending(item.id, "decrease") ? (
                                pendingSpinner
                              ) : (
                                <IconMinus className="h-3.5 w-3.5" stroke={2.2} />
                              )}
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="cursor-pointer p-2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label={`Increase ${item.product.name} quantity`}
                              disabled={isCartBusy}
                              onClick={() =>
                                void runCartAction(item.id, "increase", () =>
                                  updateQuantity(item.id, item.quantity + 1)
                                )
                              }
                            >
                              {isActionPending(item.id, "increase") ? (
                                pendingSpinner
                              ) : (
                                <IconPlus className="h-3.5 w-3.5" stroke={2.2} />
                              )}
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(item.product.price * item.quantity, "USD")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border bg-card/70 p-6">
                {actionError ? (
                  <div className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
                    <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0" stroke={2} />
                    <p>{actionError}</p>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-lg font-semibold text-foreground">
                    {formatCurrency(subtotal, "USD")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Shipping and taxes are calculated at checkout.
                </p>
                <Button asChild className="mt-5 h-11 w-full">
                  <Link
                    href="/checkout"
                    onClick={(event) => {
                      if (isCartBusy) {
                        event.preventDefault()
                        return
                      }

                      setOpen(false)
                    }}
                    aria-disabled={isCartBusy}
                    className={isCartBusy ? "pointer-events-none opacity-60" : undefined}
                  >
                    Checkout
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 h-11 w-full border-border"
                  onClick={() => setOpen(false)}
                >
                  Continue shopping
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-primary">
                <IconShoppingBag className="h-9 w-9" stroke={1.8} />
              </div>
              <h3 className="mt-6 type-heading-2xl">
                Your cart is empty
              </h3>
              <p className="mt-3 max-w-xs type-body-sm-relaxed">
                Add products to your cart and they will appear here before checkout.
              </p>
              <Button asChild className="mt-6" onClick={() => setOpen(false)}>
                <Link
                  href="/"
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  Start shopping
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
