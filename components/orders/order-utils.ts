import { formatCurrency, formatDate, formatOptionalDate } from "@/lib/formatters"
import type { OrderHistoryOrder } from "@/types/order"

export { formatCurrency, formatDate, formatOptionalDate }

export function formatItemCount(count: number) {
  return `${count} item${count === 1 ? "" : "s"}`
}

export function getOrderItemCount(order: OrderHistoryOrder) {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}
