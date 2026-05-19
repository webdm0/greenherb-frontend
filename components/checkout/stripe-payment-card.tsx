"use client"

import { useEffect, useRef, type FormEvent } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { FormMessage } from "@/components/ui/form-message"
import { useCheckoutPayment } from "@/hooks/checkout/useCheckoutPayment"
import type { CheckoutFormState } from "@/hooks/checkout/useCheckoutForm"
import type { CheckoutPaymentIntentResponse } from "@/types/checkout"

export function StripePaymentCard({
  billingDetails,
  formState,
  isAuthenticated,
  isCheckoutReady,
  currentTotal,
  discountCode,
  onValidateDetails,
  onPaymentError,
  onPaymentPrepared,
  onPaid,
}: {
  billingDetails: { name: string; email: string; phone: string }
  formState: CheckoutFormState
  isAuthenticated: boolean
  isCheckoutReady: boolean
  currentTotal: number
  discountCode?: string
  onValidateDetails: () => { firstInvalidField: keyof CheckoutFormState | null; isValid: boolean }
  onPaymentError?: (message: string | null) => void
  onPaymentPrepared?: (payment: CheckoutPaymentIntentResponse | null) => void
  onPaid: (payment: CheckoutPaymentIntentResponse) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const previousPreparedPaymentIdRef = useRef<string | null>(null)
  const { error, isSubmitting, preparedPayment, status, submitPayment } =
    useCheckoutPayment()

  useEffect(() => {
    if (!preparedPayment) {
      return
    }

    if (previousPreparedPaymentIdRef.current === preparedPayment.paymentIntentId) {
      return
    }

    previousPreparedPaymentIdRef.current = preparedPayment.paymentIntentId
    onPaymentPrepared?.(preparedPayment)
  }, [onPaymentPrepared, preparedPayment])

  useEffect(() => {
    onPaymentError?.(error)
  }, [error, onPaymentError])

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationResult = onValidateDetails()
    if (!validationResult.isValid) {
      return
    }

    if (!isCheckoutReady) {
      return
    }

    if (!stripe || !elements) {
      return
    }

    await submitPayment({
      billingDetails,
      currentTotal,
      discountCode,
      elements,
      formState,
      isAuthenticated,
      onPaid,
      stripe,
    })
  }

  return (
    <form className="space-y-4" onSubmit={handlePayment}>
      <div className="payment-card-surface">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                color: "#1B3022",
                fontFamily: "Manrope, system-ui, sans-serif",
                fontSize: "16px",
                "::placeholder": {
                  color: "#5A6B5D",
                },
              },
              invalid: {
                color: "#B54B4B",
              },
            },
          }}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">
          {isCheckoutReady
            ? "Review your total and place your order."
            : "We are loading your cart details before payment becomes available."}
        </p>
        <Button
          type="submit"
          className="h-11 sm:px-5"
          disabled={isSubmitting || !stripe || !elements || !isCheckoutReady}
        >
          {isSubmitting
            ? "Processing..."
            : `Pay $${(
                preparedPayment?.totalAmount === currentTotal
                  ? preparedPayment.totalAmount
                  : currentTotal
              ).toFixed(2)}`}
        </Button>
      </div>

      {error ? (
        <FormMessage variant="errorComfortable">
          {error}
        </FormMessage>
      ) : null}

      {status ? (
        <FormMessage variant="success">
          {status}
        </FormMessage>
      ) : null}

      {preparedPayment ? (
        <p className="text-xs text-muted-foreground">
          Order #{preparedPayment.orderReference} is ready for payment in {preparedPayment.currency.toUpperCase()}.
        </p>
      ) : null}
    </form>
  )
}
