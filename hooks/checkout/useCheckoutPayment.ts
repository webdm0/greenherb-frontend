"use client"

import { useState } from "react"
import { CardElement } from "@stripe/react-stripe-js"
import { useMutation } from "@tanstack/react-query"
import type { Stripe, StripeElements } from "@stripe/stripe-js"
import { completeCheckoutPayment, createCheckoutPaymentIntent } from "@/services/api/client"
import type {
  CompleteCheckoutResponse,
  CheckoutPaymentIntentRequest,
  CheckoutPaymentIntentResponse,
} from "@/types/checkout"
import { normalizeCustomerName, validateCheckoutDetails } from "@/lib/checkout-validation"
import {
  type CheckoutFormState,
} from "@/hooks/checkout/useCheckoutForm"

function toCountryCode(country: string) {
  switch (country.trim().toLowerCase()) {
    case "united states":
      return "US"
    case "canada":
      return "CA"
    case "united kingdom":
      return "GB"
    case "germany":
      return "DE"
    case "france":
      return "FR"
    case "poland":
      return "PL"
    case "ukraine":
      return "UA"
    default:
      return "US"
  }
}

function validateCheckoutForm(formState: CheckoutFormState) {
  return validateCheckoutDetails(formState)
}

function toPaymentIntentPayload(
  formState: CheckoutFormState,
  discountCode?: string,
): CheckoutPaymentIntentRequest {
  return {
    customerName: normalizeCustomerName(formState.customerName),
    customerEmail: formState.customerEmail.trim(),
    customerPhone: formState.customerPhone.trim(),
    discountCode: discountCode?.trim() || undefined,
    shippingCountry: formState.shippingCountry.trim(),
    shippingCity: formState.shippingCity.trim(),
    shippingAddressLine1: formState.shippingAddressLine1.trim(),
    shippingAddressLine2: formState.shippingAddressLine2.trim() || undefined,
    shippingPostalCode: formState.shippingPostalCode.trim(),
    shippingRegion: formState.shippingRegion.trim() || undefined,
    notes: formState.notes.trim() || undefined,
  }
}

function getPaymentIntentPreparationKey(
  payload: CheckoutPaymentIntentRequest,
  currentTotal: number,
) {
  return JSON.stringify({
    ...payload,
    currentTotal: Number(currentTotal.toFixed(2)),
  })
}

interface SubmitPaymentArgs {
  billingDetails: { name: string; email: string; phone: string }
  currentTotal: number
  discountCode?: string
  elements: StripeElements
  formState: CheckoutFormState
  isAuthenticated: boolean
  onPaid: (payment: CheckoutPaymentIntentResponse) => void
  stripe: Stripe
}

function isSuccessfulPaymentIntentStatus(status?: string | null) {
  return status === "succeeded"
}

async function tryCompleteCheckoutPayment(
  paymentIntent: CheckoutPaymentIntentResponse,
  paymentIntentId: string,
  completePayment: {
    mutateAsync: (payload: {
      orderId: number
      paymentIntentId: string
    }) => Promise<CompleteCheckoutResponse>
  },
) {
  try {
    return await completePayment.mutateAsync({
      orderId: paymentIntent.orderId,
      paymentIntentId,
    })
  } catch {
    return null
  }
}

export function useCheckoutPayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [preparedPayment, setPreparedPayment] =
    useState<CheckoutPaymentIntentResponse | null>(null)
  const [preparedPaymentKey, setPreparedPaymentKey] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const preparePayment = useMutation({
    mutationFn: createCheckoutPaymentIntent,
  })

  const completePayment = useMutation({
    mutationFn: completeCheckoutPayment,
  })

  const submitPayment = async ({
    billingDetails,
    currentTotal,
    discountCode,
    elements,
    formState,
    isAuthenticated,
    onPaid,
    stripe,
  }: SubmitPaymentArgs) => {
    setStatus(null)
    setError(null)
    setIsProcessing(true)

    if (!isAuthenticated) {
      setError("Please sign in before paying so we can keep your order connected to your account.")
      setIsProcessing(false)
      return
    }

    const validationError = validateCheckoutForm(formState)
    if (validationError) {
      setError(validationError)
      setIsProcessing(false)
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError("Your payment form is still loading. Please try again in a moment.")
      setIsProcessing(false)
      return
    }

    try {
      const paymentIntentPayload = toPaymentIntentPayload(formState, discountCode)
      const paymentIntentKey = getPaymentIntentPreparationKey(
        paymentIntentPayload,
        currentTotal,
      )
      let paymentIntent = preparedPayment

      if (
        !paymentIntent ||
        preparedPaymentKey !== paymentIntentKey ||
        Math.abs(paymentIntent.totalAmount - currentTotal) > 0.009
      ) {
        paymentIntent = await preparePayment.mutateAsync(paymentIntentPayload)
        setPreparedPayment(paymentIntent)
        setPreparedPaymentKey(paymentIntentKey)
      }

      if (Math.abs(paymentIntent.totalAmount - currentTotal) > 0.009 && !discountCode) {
        setError(
          "Your order total needs a quick refresh before payment. Please try again.",
        )
        return
      }

      const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name.trim(),
            email: billingDetails.email.trim(),
            phone: billingDetails.phone.trim(),
            address: {
              line1: formState.shippingAddressLine1.trim(),
              line2: formState.shippingAddressLine2.trim() || undefined,
              city: formState.shippingCity.trim(),
              state: formState.shippingRegion.trim() || undefined,
              postal_code: formState.shippingPostalCode.trim(),
              country: toCountryCode(formState.shippingCountry),
            },
          },
        },
      })

      if (result.error) {
        setError(result.error.message ?? "We couldn't complete your payment. Please try again.")
        return
      }

      if (!result.paymentIntent || !isSuccessfulPaymentIntentStatus(result.paymentIntent.status)) {
        setError("Your payment didn't go through. Please try again.")
        return
      }

      const completedOrder = await tryCompleteCheckoutPayment(
        paymentIntent,
        result.paymentIntent.id,
        completePayment,
      )

      setStatus(
        completedOrder
          ? "Payment successful. Your order is confirmed."
          : "Payment successful. We are finalizing your order now.",
      )
      onPaid(paymentIntent)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong while processing your payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    error,
    isSubmitting: isProcessing || preparePayment.isPending || completePayment.isPending,
    preparedPayment,
    status,
    submitPayment,
  }
}
