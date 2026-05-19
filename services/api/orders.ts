import { get } from "@/services/api/request"
import { mapServerOrdersToOrders } from "@/hooks/orders/order-mappers"
import type { OrderHistoryOrder } from "@/types/order"

export const getOrders = async () => {
  const orders = await get<OrderHistoryOrder[]>("/api/orders")
  return mapServerOrdersToOrders(orders)
}
