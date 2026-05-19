"use client"

import { useState } from "react"
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconShieldCheck,
  IconShoppingCart,
  IconTruckDelivery,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartActions } from "@/hooks/useCart"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { productDetailToCatalogProduct, type ProductDetail } from "@/lib/product-detail"
import styles from "./product-purchase-panel.module.css"

interface ProductPurchasePanelProps {
  product: ProductDetail
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCartActions()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const isInStock = product.quantityInStock > 0
  const totalPrice = product.price * quantity
  const totalCompareAtPrice = product.compareAtPrice
    ? product.compareAtPrice * quantity
    : null

  async function handleAddToCart() {
    if (!isInStock) {
      return
    }

    setIsAdding(true)

    try {
      await addItem(productDetailToCatalogProduct(product), quantity)
      setIsAdded(true)
      window.setTimeout(() => setIsAdded(false), 1800)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="section-card-compact border-border/70 p-5 sm:p-6">
      <div className={styles.headerRow}>
        <div>
          <p className="type-body-sm">Price</p>
          <div className="mt-1 flex items-end gap-3">
            <span className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              {formatCurrency(totalPrice, "USD")}
            </span>
            {totalCompareAtPrice ? (
              <span className="pb-1 text-sm text-muted-foreground line-through">
                {formatCurrency(totalCompareAtPrice, "USD")}
              </span>
            ) : null}
          </div>
        </div>
        <Badge
          variant={isInStock ? "secondary" : "outline"}
          className={cn(
            "rounded-full px-3 py-1 text-xs",
            isInStock
              ? "bg-secondary text-secondary-foreground"
              : "border-destructive/40 text-destructive"
          )}
        >
          {isInStock ? `${product.quantityInStock} in stock` : "Out of stock"}
        </Badge>
      </div>

      <div className={styles.actionRow}>
        <div className="inline-flex items-center rounded-full border border-border bg-secondary/40 p-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground transition hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1 || isAdding}
          >
            <IconMinus className="h-4 w-4" stroke={2.2} />
          </button>
          <span className="min-w-10 text-center text-sm font-semibold text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground transition hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() =>
              setQuantity((current) => Math.min(product.quantityInStock || 12, current + 1))
            }
            disabled={!isInStock || isAdding}
          >
            <IconPlus className="h-4 w-4" stroke={2.2} />
          </button>
        </div>

        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!isInStock || isAdding}
          className={cn(
            "h-11 w-full rounded-full text-sm font-semibold",
            styles.actionButton,
            isAdded && "bg-accent text-accent-foreground hover:bg-accent/90"
          )}
        >
          {isAdding ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              Adding...
            </span>
          ) : isAdded ? (
            <span className="flex items-center gap-2">
              <IconCheck className="h-4 w-4" stroke={2.2} />
              Added to cart
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconShoppingCart className="h-4 w-4" stroke={1.9} />
              Add to cart
            </span>
          )}
        </Button>
      </div>

      <div className="surface-tint mt-5 space-y-3">
        <div className="flex items-center gap-3 text-sm text-foreground">
          <IconTruckDelivery className="h-4 w-4 shrink-0 text-accent" stroke={1.9} />
          <span>Free shipping on orders over $75 and fast order processing.</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <IconShieldCheck className="h-4 w-4 shrink-0 text-accent" stroke={1.9} />
          <span>Carefully selected formulas with straightforward ingredient profiles.</span>
        </div>
      </div>
    </div>
  )
}
