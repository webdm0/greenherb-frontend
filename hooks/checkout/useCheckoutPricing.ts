"use client"

import { useEffect, useRef, useState } from "react"
import { useCheckoutQuote } from "@/hooks/checkout/useCheckoutQuote"
import type {
  CheckoutPaymentIntentResponse,
  CheckoutPricingSummary,
} from "@/types/checkout"

export type PromoFeedback =
  | { tone: "success" | "error" | "info"; message: string }
  | null

function normalizePromoCode(value: string) {
  return value.toUpperCase().replace(/\s+/g, "")
}

interface UseCheckoutPricingParams {
  isAuthenticated: boolean
  isCheckoutReady: boolean
  itemCount: number
  subtotal: number
}

export function useCheckoutPricing({
  isAuthenticated,
  isCheckoutReady,
  itemCount,
  subtotal,
}: UseCheckoutPricingParams) {
  const previousCartSignatureRef = useRef<string | null>(null)
  const [promoCodeInput, setPromoCodeInput] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  const [promoFeedback, setPromoFeedback] = useState<PromoFeedback>(null)
  const [serverPricing, setServerPricing] =
    useState<CheckoutPricingSummary | null>(null)
  const quoteMutation = useCheckoutQuote()

  const fallbackShipping = subtotal >= 75 || subtotal === 0 ? 0 : 12
  const estimatedShipping = serverPricing?.shippingAmount ?? fallbackShipping
  const discountAmount = serverPricing?.discountAmount ?? 0
  const total = serverPricing?.totalAmount ?? Math.max(0, subtotal + estimatedShipping)
  const confirmedPromoCode = serverPricing?.discountCode?.trim() || null
  const isPromoApplied = Boolean(confirmedPromoCode && discountAmount > 0)
  const activePromoCode = confirmedPromoCode ?? appliedPromoCode
  const promoBadgeLabel =
    subtotal > 0 && discountAmount > 0
      ? `-${Math.round((discountAmount / subtotal) * 100)}%`
      : null

  useEffect(() => {
    const cartSignature = `${subtotal}:${itemCount}`

    if (previousCartSignatureRef.current === null) {
      previousCartSignatureRef.current = cartSignature
      return
    }

    if (previousCartSignatureRef.current === cartSignature) {
      return
    }

    previousCartSignatureRef.current = cartSignature

    if (!serverPricing && !appliedPromoCode) {
      return
    }

    setServerPricing(null)
    setAppliedPromoCode(null)
    setPromoFeedback({
      tone: "info",
      message: "Your bag changed, so add your promo code again to refresh the savings.",
    })
  }, [appliedPromoCode, itemCount, serverPricing, subtotal])

  const applyPromoCode = async ({ silentIfEmpty = false } = {}) => {
    const normalizedCode = normalizePromoCode(promoCodeInput)

    if (!normalizedCode) {
      setAppliedPromoCode(null)
      setServerPricing(null)
      setPromoFeedback(
        silentIfEmpty
          ? null
          : { tone: "error", message: "Enter a promo code to continue." },
      )
      return
    }

    if (!isAuthenticated) {
      setAppliedPromoCode(null)
      setServerPricing(null)
      setPromoFeedback({
        tone: "error",
        message: "Sign in to use a promo code at checkout.",
      })
      return
    }

    setPromoCodeInput(normalizedCode)
    setPromoFeedback(null)

    try {
      const pricing = await quoteMutation.mutateAsync({
        discountCode: normalizedCode,
      })

      setAppliedPromoCode(pricing.discountCode ?? normalizedCode)
      setServerPricing(pricing)

      if (pricing.discountCode && pricing.discountAmount > 0) {
        setPromoCodeInput(pricing.discountCode)
        setPromoFeedback({
          tone: "success",
          message: `${pricing.discountCode} - $${pricing.discountAmount.toFixed(2)} off.`,
        })
        return
      }

      setAppliedPromoCode(null)
      setPromoFeedback({
        tone: "error",
        message: "This promo code is not available for the items currently in your bag.",
      })
    } catch (error) {
      setAppliedPromoCode(null)
      setServerPricing(null)
      setPromoFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't apply that promo code right now.",
      })
    }
  }

  const removePromoCode = () => {
    setAppliedPromoCode(null)
    setPromoCodeInput("")
    setServerPricing(null)
    setPromoFeedback({ tone: "info", message: "Promo code removed." })
  }

  const onPromoInputChange = (value: string) => {
    const nextValue = normalizePromoCode(value)
    setPromoCodeInput(nextValue)

    if (appliedPromoCode && nextValue !== appliedPromoCode) {
      setAppliedPromoCode(null)
      setServerPricing(null)
    }

    if (promoFeedback) {
      setPromoFeedback(null)
    }
  }

  const handlePaymentError = (message: string | null) => {
    if (!message || !appliedPromoCode) {
      return
    }

    if (!/promo code/i.test(message)) {
      return
    }

    setAppliedPromoCode(null)
    setServerPricing(null)
    setPromoFeedback({
      tone: "error",
      message,
    })
  }

  const handlePaymentPrepared = (payment: CheckoutPaymentIntentResponse | null) => {
    setServerPricing(payment)

    if (!payment) {
      return
    }

    if (!appliedPromoCode) {
      setPromoFeedback(null)
      return
    }

    if (payment.discountCode && payment.discountAmount > 0) {
      setAppliedPromoCode(payment.discountCode)
      setPromoCodeInput(payment.discountCode)
      setPromoFeedback({
        tone: "success",
        message: `${payment.discountCode} - $${payment.discountAmount.toFixed(2)} off.`,
      })
      return
    }

    setAppliedPromoCode(null)
    setPromoFeedback({
      tone: "error",
      message: "This promo code can't be used for this order.",
    })
  }

  return {
    activePromoCode,
    appliedPromoCode,
    applyPromoCode,
    confirmedPromoCode,
    discountAmount,
    estimatedShipping,
    handlePaymentError,
    handlePaymentPrepared,
    isPromoApplied,
    onPromoInputChange,
    promoBadgeLabel,
    promoCodeInput,
    promoFeedback,
    quoteMutation,
    removePromoCode,
    total,
    isCheckoutReady,
  }
}
