"use client"

import { IconShoppingBag, IconTrash } from "@tabler/icons-react"
import {
  CartItemSkeleton,
  SkeletonPill,
} from "@/components/layout/loading-skeletons"
import { SectionHeader } from "@/components/layout/section-header"
import type { CartItem } from "@/types/cart"
import { ProductImageThumb } from "@/components/products/product-image-thumb"
import { PageState } from "@/components/layout/page-state"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatters"
import Link from "next/link"
import styles from "./cart-review-section.module.css"

function CartItemCard({
  item,
  onRemove,
}: {
  item: CartItem
  onRemove: (itemId: string) => void
}) {
  return (
    <article className="cart-review-item-card">
      <div className={styles.itemHeader}>
        <div className={styles.itemContent}>
          <ProductImageThumb
            src={item.product.image}
            alt={item.product.name}
            sizes="96px"
            containerClassName="cart-review-thumb"
          />
          <div className={styles.itemCopy}>
            <p className="eyebrow-label-soft">
              Qty {item.quantity}
            </p>
            <h3 className="section-card-subheading">
              {item.product.name}
            </h3>
            <p className={styles.itemDescription}>
              {item.product.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.removeButton}
          aria-label={`Remove ${item.product.name}`}
          onClick={() => onRemove(item.id)}
        >
          <IconTrash className="h-4 w-4" stroke={1.9} />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="type-body-sm">
          {formatCurrency(item.product.price, "USD")} each
        </span>
        <span className="text-lg font-semibold text-foreground">
          {formatCurrency(item.product.price * item.quantity, "USD")}
        </span>
      </div>
    </article>
  )
}

export function EmptyCheckoutState() {
  return (
    <PageState
      titleTag="h2"
      icon={<IconShoppingBag className="h-9 w-9" stroke={1.8} />}
      title="Your cart is empty"
      description="Add a few favorites first, then come back when you're ready to place your order."
      actions={
        <Button asChild className="h-11 px-6">
          <Link href="/">Return to shop</Link>
        </Button>
      }
    />
  )
}

export function CartReviewSection({
  isHydrated,
  itemCount,
  items,
  onRemoveItem,
}: {
  isHydrated: boolean
  itemCount: number
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
}) {
  return (
    <div className="section-panel-muted min-w-0 overflow-hidden p-5 sm:p-6">
      <SectionHeader
        eyebrow="Cart review"
        title="Items in your order"
        description="Review every item before payment"
        actions={
          isHydrated ? (
            <p className="type-body-sm">
              {itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout
            </p>
          ) : (
            <SkeletonPill className="h-5 w-36" />
          )
        }
        actionsClassName="self-start sm:self-auto"
      />

      <div className={styles.scroll}>
        {isHydrated
          ? items.map((item) => (
              <CartItemCard key={item.id} item={item} onRemove={onRemoveItem} />
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <CartItemSkeleton key={index} />
            ))}
      </div>
    </div>
  )
}
