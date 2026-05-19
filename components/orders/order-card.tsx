"use client"

import Link from "next/link"
import type { PropsWithChildren, ReactNode } from "react"
import {
  IconCircleCheck,
  IconChevronDown,
  IconExternalLink,
  IconMapPin,
  IconReceipt2,
} from "@tabler/icons-react"
import { ProductImageThumb } from "@/components/products/product-image-thumb"
import { Button } from "@/components/ui/button"
import {
  formatCurrency,
  formatDate,
  formatItemCount,
  formatOptionalDate,
} from "@/components/orders/order-utils"
import { cn } from "@/lib/utils"
import type { OrderHistoryOrder } from "@/types/order"
import styles from "./order-card.module.css"

function formatAddress(order: OrderHistoryOrder) {
  return [
    order.shippingAddressLine1,
    order.shippingAddressLine2,
    [order.shippingCity, order.shippingRegion].filter(Boolean).join(", "),
    `${order.shippingPostalCode}, ${order.shippingCountry}`,
  ]
    .filter(Boolean)
    .join(", ")
}

function getOrderPreviewLabel(order: OrderHistoryOrder) {
  if (order.items.length === 0) {
    return "No items"
  }

  if (order.items.length === 1) {
    return order.items[0].productName
  }

  return `${order.items[0].productName} +${order.items.length - 1} more`
}

function OrderInfoCard({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className={styles.infoCard}>
      <p className="eyebrow-label-soft">{label}</p>
      <p className={styles.infoValue}>{value}</p>
    </div>
  )
}

function OrdersPreviewItems({
  itemCount,
  items,
}: {
  itemCount: number
  items: OrderHistoryOrder["items"]
}) {
  const previewItems = items.slice(0, 3)

  return (
    <div className="section-card-soft min-w-0 p-4">
      <div className={styles.previewHeader}>
        <p className={styles.previewHeading}>Items in this order</p>
        <p className={styles.previewCount}>
          {formatItemCount(itemCount)}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {previewItems.map((item) => (
          <div
            key={item.id}
            className={styles.previewItemCard}
          >
            <ProductImageThumb
              src={item.imageUrl}
              alt={item.productName}
              sizes="56px"
              containerClassName="h-14 w-14 shrink-0 rounded-xl border border-border/40"
              fallbackClassName="text-muted-foreground"
            />
            <div className="min-w-0 flex-1">
              {item.productSlug ? (
                <Link
                  href={`/products/${item.productSlug}`}
                  className={styles.previewItemName}
                >
                  {item.productName}
                </Link>
              ) : (
                <p className={styles.previewItemText}>
                  {item.productName}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Qty {item.quantity}
              </p>
            </div>
          </div>
        ))}
        {items.length > previewItems.length ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/20 px-4 py-4 text-sm text-muted-foreground">
            +{items.length - previewItems.length} more
          </div>
        ) : null}
      </div>
    </div>
  )
}

function OrderLineItem({
  currency,
  item,
}: {
  currency: string
  item: OrderHistoryOrder["items"][number]
}) {
  return (
    <div className={styles.lineItemRow}>
      <ProductImageThumb
        src={item.imageUrl}
        alt={item.productName}
        sizes="72px"
        containerClassName={styles.lineItemThumb}
        fallbackClassName="text-muted-foreground"
      />
      <div className={styles.lineItemCopy}>
        {item.productSlug ? (
          <Link
            href={`/products/${item.productSlug}`}
            className={cn(styles.lineItemLink, "group")}
          >
            <span className="truncate">{item.productName}</span>
            <IconExternalLink
              className={styles.lineItemLinkIcon}
              stroke={1.9}
            />
          </Link>
        ) : (
          <p className="truncate font-medium text-foreground">{item.productName}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{item.productSku}</p>
        <p className="mt-1 type-body-sm">
          Quantity: {item.quantity}
        </p>
      </div>
      <span className={styles.lineItemPrice}>
        {formatCurrency(item.unitPrice * item.quantity, currency)}
      </span>
    </div>
  )
}

function OrderItemsPanel({
  currency,
  itemCount,
  items,
}: {
  currency: string
  itemCount: number
  items: OrderHistoryOrder["items"]
}) {
  return (
    <div className="order-detail-card">
      <div className="flex items-center justify-between gap-3">
        <p className="section-label">Order items</p>
        <p className="type-body-sm">
          {formatItemCount(itemCount)}
        </p>
      </div>
      <div className={styles.itemsScroll}>
        {items.map((item) => (
          <OrderLineItem key={item.id} item={item} currency={currency} />
        ))}
      </div>
    </div>
  )
}

function OrderSummaryPanel({ order }: { order: OrderHistoryOrder }) {
  return (
    <div className="order-detail-card">
      <div className="flex items-center gap-2">
        <IconReceipt2 className="h-4 w-4 shrink-0 text-accent" stroke={1.9} />
        <p className="section-label">Summary</p>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-4 text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotalAmount, order.currency)}</span>
        </div>
        {order.discountAmount > 0 ? (
          <div className="flex items-center justify-between gap-4 text-muted-foreground">
            <span>
              Discount
              {order.discountCode ? ` (${order.discountCode})` : ""}
            </span>
            <span>-{formatCurrency(order.discountAmount, order.currency)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-4 text-muted-foreground">
          <span>Shipping</span>
          <span>{formatCurrency(order.shippingAmount, order.currency)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-3 font-semibold text-foreground">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount, order.currency)}</span>
        </div>
      </div>
    </div>
  )
}

function OrderTextPanel({
  icon,
  title,
  children,
}: PropsWithChildren<{ icon: ReactNode; title: string }>) {
  return (
    <div className="order-detail-card">
      <div className="flex items-center gap-2">
        {icon}
        <p className="section-label">{title}</p>
      </div>
      {children}
    </div>
  )
}

function OrderDetailsPanels({
  itemCount,
  order,
}: {
  itemCount: number
  order: OrderHistoryOrder
}) {
  return (
    <div className={styles.detailsGrid}>
      <OrderItemsPanel
        currency={order.currency}
        itemCount={itemCount}
        items={order.items}
      />

      <div className="space-y-4">
        <OrderSummaryPanel order={order} />

        <OrderTextPanel
          icon={<IconMapPin className="h-4 w-4 shrink-0 text-accent" stroke={1.9} />}
          title="Delivery"
        >
          <p className="mt-4 type-body-sm-relaxed">
            {formatAddress(order)}
          </p>
        </OrderTextPanel>

        <OrderTextPanel
          icon={<IconCircleCheck className="h-4 w-4 shrink-0 text-accent" stroke={1.9} />}
          title="Customer"
        >
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            {order.customerPhone ? <p>{order.customerPhone}</p> : null}
          </div>
        </OrderTextPanel>
      </div>
    </div>
  )
}

export function OrderCard({
  isExpanded,
  itemCount,
  onToggle,
  order,
}: {
  isExpanded: boolean
  itemCount: number
  onToggle: () => void
  order: OrderHistoryOrder
}) {
  return (
    <article className="section-panel-elevated overflow-hidden bg-card/95">
      <div className={styles.headerSurface}>
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="type-heading-xl sm:text-2xl">
                  Order #{order.orderReference}
                </h3>
                <span className="status-badge-success">
                  Paid
                </span>
              </div>
              <p className="mt-2 type-body-sm">
                Placed on {formatDate(order.createdAt)}
              </p>
              <p className="mt-2 truncate text-sm text-foreground">
                {getOrderPreviewLabel(order)}
              </p>
            </div>

            <div className={styles.headerActions}>
              <div className={styles.summaryCard}>
                <p className="eyebrow-label-soft">Order total</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formatCurrency(order.totalAmount, order.currency)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-11 rounded-full border-border px-5",
                  styles.detailsButton,
                )}
                aria-expanded={isExpanded}
                aria-controls={`order-details-${order.id}`}
                onClick={onToggle}
              >
                {isExpanded ? "Hide details" : "View details"}
                <IconChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                  stroke={1.9}
                />
              </Button>
            </div>
          </div>

          <div className={styles.previewGrid}>
            <OrdersPreviewItems itemCount={itemCount} items={order.items} />

            <div className={styles.infoGrid}>
              <OrderInfoCard
                label="Delivery"
                value={`${order.shippingCity}, ${order.shippingCountry}`}
              />
              <OrderInfoCard
                label="Contact"
                value={order.customerEmail}
              />
              <OrderInfoCard
                label="Paid on"
                value={formatOptionalDate(order.paidAt)}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        id={`order-details-${order.id}`}
        className={cn(
          styles.detailsToggle,
          isExpanded ? styles.detailsExpanded : styles.detailsCollapsed,
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <OrderDetailsPanels order={order} itemCount={itemCount} />
        </div>
      </div>
    </article>
  )
}
