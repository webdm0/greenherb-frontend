"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  IconCreditCard,
  IconInfoCircle,
  IconLock,
} from "@tabler/icons-react"
import { StripePaymentCard } from "@/components/checkout/stripe-payment-card"
import { SectionIntro } from "@/components/layout/section-intro"
import type { CheckoutFormState } from "@/hooks/checkout/useCheckoutForm"
import type { CheckoutPaymentIntentResponse } from "@/types/checkout"

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null
const stripeElementsOptions = {
  locale: "en" as const,
}

export function CheckoutPaymentSection({
  billingDetails,
  currentTotal,
  discountCode,
  formState,
  isAuthenticated,
  isCheckoutReady,
  onPaid,
  onPaymentError,
  onPaymentPrepared,
  onValidateDetails,
}: {
  billingDetails: { name: string; email: string; phone: string }
  currentTotal: number
  discountCode?: string
  formState: CheckoutFormState
  isAuthenticated: boolean
  isCheckoutReady: boolean
  onPaid: (payment: CheckoutPaymentIntentResponse) => void
  onPaymentError: (message: string | null) => void
  onPaymentPrepared: (payment: CheckoutPaymentIntentResponse | null) => void
  onValidateDetails: () => { firstInvalidField: keyof CheckoutFormState | null; isValid: boolean }
}) {
  return (
    <section className="surface-section">
      <SectionIntro
        eyebrow="Payment"
        title="Payment method"
        description="Enter your card details to place the order."
        icon={<IconCreditCard className="h-5 w-5" stroke={1.9} />}
      />

      <div className="mt-6">
        <div className="mb-4 rounded-lg border border-accent/40 bg-secondary/50 px-4 py-3">
          <div className="flex items-start gap-3">
            <IconInfoCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" stroke={1.9} />
            <div className="text-sm leading-6">
              <p className="font-semibold text-foreground">Test payment only</p>
              <p className="text-muted-foreground">
                Non-commercial pet project. Use card{" "}
                <span className="font-semibold text-foreground">4242 4242 4242 4242</span>,
                any future expiry date and any CVC.
              </p>
            </div>
          </div>
        </div>
        {stripePromise ? (
          <Elements stripe={stripePromise} options={stripeElementsOptions}>
            <StripePaymentCard
              billingDetails={billingDetails}
              discountCode={discountCode}
              formState={formState}
              isAuthenticated={isAuthenticated}
              isCheckoutReady={isCheckoutReady}
              currentTotal={currentTotal}
              onValidateDetails={onValidateDetails}
              onPaymentError={onPaymentError}
              onPaymentPrepared={onPaymentPrepared}
              onPaid={onPaid}
            />
          </Elements>
        ) : (
          <div className="payment-card-fallback">
            <div className="flex items-start gap-3">
              <IconLock className="mt-0.5 h-5 w-5 text-accent" stroke={1.9} />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Payment is temporarily unavailable
                </p>
                <p className="mt-2 type-body-sm-relaxed">
                  Please try again in a moment or contact support if the issue continues.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
