export interface OrderHistoryItem {
  id: number
  productId: number | null
  productName: string
  productSlug: string
  productSku: string
  imageUrl?: string | null
  quantity: number
  unitPrice: number
}

export interface OrderHistoryOrder {
  id: number
  orderReference: string
  status: string
  currency: string
  subtotalAmount: number
  discountAmount: number
  discountCode: string | null
  totalAmount: number
  shippingAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingCountry: string
  shippingCity: string
  shippingAddressLine1: string
  shippingAddressLine2: string | null
  shippingPostalCode: string
  shippingRegion: string | null
  notes: string | null
  createdAt: string
  paidAt: string | null
  items: OrderHistoryItem[]
}
