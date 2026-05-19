export interface CheckoutQuoteRequest {
  discountCode?: string
}

export interface CheckoutPricingSummary {
  currency: string
  subtotal: number
  discountAmount: number
  discountCode?: string
  shippingAmount: number
  totalAmount: number
}

export interface CheckoutQuoteResponse extends CheckoutPricingSummary {}

export interface CheckoutPaymentIntentRequest {
  customerName: string
  customerEmail: string
  customerPhone: string
  discountCode?: string
  shippingCountry: string
  shippingCity: string
  shippingAddressLine1: string
  shippingAddressLine2?: string
  shippingPostalCode: string
  shippingRegion?: string
  notes?: string
}

export interface CheckoutPaymentIntentResponse extends CheckoutPricingSummary {
  orderId: number
  orderReference: string
  paymentIntentId: string
  clientSecret: string
}

export interface CompleteCheckoutRequest {
  orderId: number
  paymentIntentId: string
}

export interface CompleteCheckoutResponse {
  orderId: number
  orderReference: string
  status: string
  paidAt: string | null
}
