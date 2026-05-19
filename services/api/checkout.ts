import { post } from "@/services/api/request"
import type {
  CheckoutQuoteRequest,
  CheckoutQuoteResponse,
  CheckoutPaymentIntentRequest,
  CheckoutPaymentIntentResponse,
  CompleteCheckoutRequest,
  CompleteCheckoutResponse,
} from "@/types/checkout"

export const previewCheckoutQuote = (payload: CheckoutQuoteRequest) =>
  post<CheckoutQuoteResponse>("/api/checkout/quote", payload)

export const createCheckoutPaymentIntent = (payload: CheckoutPaymentIntentRequest) =>
  post<CheckoutPaymentIntentResponse>("/api/checkout/payment-intent", payload)

export const completeCheckoutPayment = (payload: CompleteCheckoutRequest) =>
  post<CompleteCheckoutResponse>("/api/checkout/complete", payload)
