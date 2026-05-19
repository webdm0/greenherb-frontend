"use client"

import dynamic from "next/dynamic"
import { startTransition, useMemo, useRef, useState } from "react"
import { IconAlertCircle, IconShoppingBag } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import {
  CartReviewSection,
  EmptyCheckoutState,
} from "@/components/checkout/cart-review-section"
import { CheckoutDetailsFormSection } from "@/components/checkout/checkout-details-form-section"
import {
  CheckoutLoadingState,
  CheckoutPaymentSectionSkeleton,
} from "@/components/checkout/checkout-loading-state"
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary"
import { PageErrorState } from "@/components/layout/page-error-state"
import { ProtectedRouteSignInState } from "@/components/layout/protected-route-sign-in-state"
import {
  type CheckoutFormField,
  useCheckoutForm,
} from "@/hooks/checkout/useCheckoutForm"
import { useCheckoutPricing } from "@/hooks/checkout/useCheckoutPricing"
import { useCart } from "@/hooks/useCart"
import { normalizeCustomerName } from "@/lib/checkout-validation"
import styles from "./checkout-layout.module.css"

const CheckoutPaymentSection = dynamic(
  () =>
    import("@/components/checkout/checkout-payment-section").then(
      (module) => module.CheckoutPaymentSection,
    ),
  {
    loading: CheckoutPaymentSectionSkeleton,
  },
)

type FocusableFieldElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLButtonElement
  | null

function hasResolvedAuthenticatedCart({
  isAuthenticated,
  isHydrated,
  lastSyncedUserId,
  mode,
  syncStatus,
  userId,
}: {
  isAuthenticated: boolean
  isHydrated: boolean
  lastSyncedUserId: number | null
  mode: "guest" | "authenticated"
  syncStatus: "idle" | "syncing" | "error"
  userId: number | null
}) {
  if (!isAuthenticated || !userId) {
    return isHydrated
  }

  return (
    isHydrated &&
    mode === "authenticated" &&
    (lastSyncedUserId === userId || syncStatus === "error")
  )
}

export function CheckoutPageClient() {
  const router = useRouter()
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth()
  const {
    items,
    isHydrated,
    mode,
    removeItem,
    replaceItems,
    getSubtotal,
    getItemCount,
    lastSyncedUserId,
    syncStatus,
  } = useCart()
  const [isRedirectingAfterPayment, setIsRedirectingAfterPayment] = useState(false)
  const fieldRefs = useRef<Partial<Record<CheckoutFormField, FocusableFieldElement>>>({})
  const {
    fieldErrors,
    formState,
    handleCountryChange,
    handleFieldBlur,
    handleFieldChange,
    validateAllFields,
  } = useCheckoutForm()

  const subtotal = getSubtotal
  const itemCount = getItemCount
  const isCartResolved = hasResolvedAuthenticatedCart({
    isAuthenticated,
    isHydrated,
    lastSyncedUserId,
    mode,
    syncStatus,
    userId: user?.id ?? null,
  })
  const isWaitingForInitialCartState =
    !isRedirectingAfterPayment && (isAuthLoading || !isCartResolved)
  const hasCartSyncError = isAuthenticated && syncStatus === "error"
  const isCheckoutReady = isHydrated && items.length > 0
  const pricing = useCheckoutPricing({
    isAuthenticated,
    isCheckoutReady,
    itemCount,
    subtotal,
  })

  const billingDetails = useMemo(
    () => ({
      name: normalizeCustomerName(formState.customerName),
      email: formState.customerEmail,
      phone: formState.customerPhone,
    }),
    [
      formState.customerEmail,
      formState.customerName,
      formState.customerPhone,
    ],
  )

  const registerFieldRef =
    (field: CheckoutFormField) =>
    (element: FocusableFieldElement) => {
      fieldRefs.current[field] = element
    }

  const focusField = (field: CheckoutFormField) => {
    const element = fieldRefs.current[field]
    if (!element) {
      return
    }

    element.scrollIntoView({ behavior: "smooth", block: "center" })
    window.setTimeout(() => {
      element.focus({ preventScroll: true })
    }, 150)
  }

  const handleValidateDetails = () => {
    const validationResult = validateAllFields()

    if (!validationResult.isValid && validationResult.firstInvalidField) {
      focusField(validationResult.firstInvalidField)
    }

    return validationResult
  }

  if (hasCartSyncError) {
    return (
      <PageErrorState
        title="We could not load your cart"
        description="Please try again. If the issue keeps happening, you can return to the catalog and start a new checkout flow."
        eyebrow="Checkout unavailable"
        icon={<IconAlertCircle className="h-10 w-10" stroke={1.9} />}
        primaryActionLabel="Try again"
        onPrimaryAction={() => router.refresh()}
        secondaryActionLabel="Back to catalog"
        secondaryActionHref="/"
      />
    )
  }

  if (isWaitingForInitialCartState) {
    return <CheckoutLoadingState />
  }

  if (!isAuthenticated) {
    return (
      <ProtectedRouteSignInState
        title="Sign in to continue checkout"
        description="Please sign in to review your cart and complete payment."
        actionHref="/login?redirect=/checkout"
        actionLabel="Go to sign in"
        icon={<IconShoppingBag className="h-9 w-9" stroke={1.8} />}
      />
    )
  }

  if (isHydrated && items.length === 0 && !isRedirectingAfterPayment) {
    return <EmptyCheckoutState />
  }

  return (
    <section className="page-section">
      <div className="grid gap-8">
        <CartReviewSection
          isHydrated={isHydrated}
          itemCount={itemCount}
          items={items}
          onRemoveItem={(itemId) => void removeItem(itemId)}
        />

        <div className={styles.mainGrid}>
          <div className="space-y-6">
            <CheckoutDetailsFormSection
              fieldErrors={fieldErrors}
              formState={formState}
              handleCountryChange={handleCountryChange}
              handleFieldBlur={handleFieldBlur}
              handleFieldChange={handleFieldChange}
              isAuthenticated={isAuthenticated}
              registerFieldRef={registerFieldRef}
              userEmail={user?.email}
            />

            <CheckoutPaymentSection
              billingDetails={billingDetails}
              currentTotal={pricing.total}
              discountCode={pricing.appliedPromoCode ?? undefined}
              formState={formState}
              isAuthenticated={isAuthenticated}
              isCheckoutReady={isCheckoutReady}
              onValidateDetails={handleValidateDetails}
              onPaymentError={pricing.handlePaymentError}
              onPaymentPrepared={pricing.handlePaymentPrepared}
              onPaid={(payment) => {
                setIsRedirectingAfterPayment(true)
                startTransition(() => {
                  replaceItems([])
                  router.replace(`/checkout/success?orderReference=${payment.orderReference}`)
                })
              }}
            />
          </div>

          <CheckoutOrderSummary
            activePromoCode={pricing.activePromoCode}
            confirmedPromoCode={pricing.confirmedPromoCode}
            discountAmount={pricing.discountAmount}
            estimatedShipping={pricing.estimatedShipping}
            isCheckoutReady={isCheckoutReady}
            isHydrated={isHydrated}
            isPromoApplied={pricing.isPromoApplied}
            itemCount={itemCount}
            onApplyPromo={() => {
              void pricing.applyPromoCode()
            }}
            onPromoInputBlur={() => {
              if (
                pricing.promoCodeInput &&
                pricing.promoCodeInput !== pricing.appliedPromoCode
              ) {
                void pricing.applyPromoCode({ silentIfEmpty: true })
              }
            }}
            onPromoInputChange={pricing.onPromoInputChange}
            onPromoInputKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                void pricing.applyPromoCode()
              }
            }}
            onRemovePromo={pricing.removePromoCode}
            promoBadgeLabel={pricing.promoBadgeLabel}
            promoCodeInput={pricing.promoCodeInput}
            promoFeedback={pricing.promoFeedback}
            quotePending={pricing.quoteMutation.isPending}
            subtotal={subtotal}
            total={pricing.total}
          />
        </div>
      </div>
    </section>
  )
}
