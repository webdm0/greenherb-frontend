"use client"

import { useState } from "react"
import {
  IconCurrencyDollar,
  IconPackage,
  IconReceipt2,
} from "@tabler/icons-react"
import { OrderCard } from "@/components/orders/order-card"
import { OrdersStatCard } from "@/components/orders/orders-stat-card"
import {
  formatCurrency,
  getOrderItemCount,
} from "@/components/orders/order-utils"
import type { OrderHistoryOrder } from "@/types/order"

export function OrdersListClient({ orders }: { orders: OrderHistoryOrder[] }) {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const totalOrders = orders.length
  const totalItems = orders.reduce((sum, order) => sum + getOrderItemCount(order), 0)
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const orderStats = [
    {
      label: "Orders",
      value: totalOrders,
      icon: IconReceipt2,
    },
    {
      label: "Items bought",
      value: totalItems,
      icon: IconPackage,
    },
    {
      label: "Total spent",
      value: formatCurrency(totalSpent, orders[0]?.currency ?? "USD"),
      icon: IconCurrencyDollar,
    },
  ] as const

  return (
    <section className="page-section">
      <div className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-3">
          {orderStats.map((stat) => (
            <OrdersStatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-5">
          {orders.map((order) => {
            const itemCount = getOrderItemCount(order)
            const isExpanded = expandedOrderId === order.id

            return (
              <OrderCard
                key={order.id}
                order={order}
                itemCount={itemCount}
                isExpanded={isExpanded}
                onToggle={() =>
                  setExpandedOrderId((current) => (current === order.id ? null : order.id))
                }
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
