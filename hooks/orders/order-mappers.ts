import type { OrderHistoryOrder, OrderHistoryItem } from "@/types/order"
import { mapImageUrl } from "@/lib/server-mappers"

interface ServerOrderHistoryItem extends Omit<OrderHistoryItem, 'imageUrl'> {
  ProductImageUrl?: string | null
  productImageUrl?: string | null
  imageUrl?: string | null
}

interface ServerOrderHistoryOrder extends Omit<OrderHistoryOrder, 'items'> {
  items: ServerOrderHistoryItem[]
}

function mapServerItemToOrderItem(item: ServerOrderHistoryItem): OrderHistoryItem {
  const {
    ProductImageUrl,
    productImageUrl,
    imageUrl: serverImageUrl,
    ...restItem
  } = item
  
  return {
    ...restItem,
    imageUrl: mapImageUrl({
      ProductImageUrl,
      productImageUrl,
      imageUrl: serverImageUrl,
    }),
  }
}

function mapServerOrderToOrder(order: ServerOrderHistoryOrder): OrderHistoryOrder {
  return {
    ...order,
    items: order.items.map(mapServerItemToOrderItem),
  }
}

export function mapServerOrdersToOrders(orders: ServerOrderHistoryOrder[]): OrderHistoryOrder[] {
  return orders.map(mapServerOrderToOrder)
}
