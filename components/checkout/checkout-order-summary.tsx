"use client"

import type { KeyboardEvent } from "react"
import { IconAlertCircle, IconCheck, IconTag } from "@tabler/icons-react"
import { SkeletonPill } from "@/components/layout/loading-skeletons"
import { SectionHeader } from "@/components/layout/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { PromoFeedback } from "@/hooks/checkout/useCheckoutPricing"
import styles from "./checkout-order-summary.module.css"

function SummaryRow({
  label,
  value,
  emphasized = false,
}: {
  label: string
  value: string
  emphasized?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        emphasized
          ? "pt-2 text-base font-semibold text-foreground"
          : "text-muted-foreground",
      )}
    >
      <span>{label}</span>
      <span className={emphasized ? "" : "text-foreground"}>{value}</span>
    </div>
  )
}

function PromoFeedbackMessage({ promoFeedback }: { promoFeedback: NonNullable<PromoFeedback> }) {
  return (
    <div
      className={cn(
        "mt-3 flex items-start gap-2 rounded-2xl border px-3 py-2.5 text-xs leading-5",
        promoFeedback.tone === "error"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-border/60 bg-background/70 text-muted-foreground",
      )}
    >
      {promoFeedback.tone === "error" ? (
        <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0" stroke={2} />
      ) : null}
      {promoFeedback.message}
    </div>
  )
}

function PromoCodePanel({
  activePromoCode,
  discountAmount,
  isCheckoutReady,
  isPromoApplied,
  onApplyPromo,
  onPromoInputBlur,
  onPromoInputChange,
  onPromoInputKeyDown,
  onRemovePromo,
  promoBadgeLabel,
  promoCodeInput,
  promoFeedback,
  quotePending,
}: {
  activePromoCode: string | null
  discountAmount: number
  isCheckoutReady: boolean
  isPromoApplied: boolean
  onApplyPromo: () => void
  onPromoInputBlur: () => void
  onPromoInputChange: (value: string) => void
  onPromoInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onRemovePromo: () => void
  promoBadgeLabel: string | null
  promoCodeInput: string
  promoFeedback: PromoFeedback
  quotePending: boolean
}) {
  return (
    <div className="section-card-compact">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <IconTag className="h-5 w-5" stroke={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {isPromoApplied ? "Promo code confirmed" : "Have a promo code?"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isPromoApplied
              ? `You saved ${formatCurrency(discountAmount, "USD")} off your subtotal.`
              : "Add your code here to see your updated total before paying."}
          </p>
        </div>
        {isPromoApplied && promoBadgeLabel ? (
          <Badge className={styles.promoBadge}>
            {promoBadgeLabel}
          </Badge>
        ) : null}
      </div>

      <div className="mt-3">
        {activePromoCode ? (
          <div
            className={cn(
              "flex items-center justify-between gap-3 rounded-full border px-4 py-2",
              isPromoApplied
                ? "border-emerald-200/70 bg-emerald-50"
                : "border-amber-200 bg-amber-50",
            )}
          >
            <div className="flex items-center gap-2">
              {isPromoApplied ? (
                <IconCheck className="h-4 w-4 text-emerald-600" stroke={2} />
              ) : (
                <IconTag className="h-4 w-4 text-amber-700" stroke={2} />
              )}
              <span
                className={cn(
                  styles.promoCodeText,
                  isPromoApplied ? "text-emerald-800" : "text-amber-900",
                )}
              >
                {activePromoCode}
              </span>
            </div>
            <button
              type="button"
              onClick={onRemovePromo}
              className={cn(
                "flex cursor-pointer items-center gap-1 text-sm font-semibold transition-colors",
                isPromoApplied
                  ? "text-emerald-700 hover:text-emerald-900"
                  : "text-amber-800 hover:text-amber-950",
              )}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 p-1">
            <Input
              className={styles.promoInput}
              value={promoCodeInput}
              onChange={(event) => onPromoInputChange(event.target.value)}
              onBlur={onPromoInputBlur}
              onKeyDown={onPromoInputKeyDown}
              placeholder="Promo code"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              aria-label="Promo code"
              disabled={!isCheckoutReady}
            />
            <Button
              type="button"
              size="sm"
              className="h-9 rounded-full px-4 text-sm font-semibold"
              disabled={quotePending || !isCheckoutReady}
              onClick={onApplyPromo}
            >
              {quotePending ? "Applying..." : "Apply"}
            </Button>
          </div>
        )}
      </div>

      {promoFeedback && !isPromoApplied ? (
        <PromoFeedbackMessage promoFeedback={promoFeedback} />
      ) : null}
    </div>
  )
}

export function CheckoutOrderSummary({
  activePromoCode,
  confirmedPromoCode,
  discountAmount,
  estimatedShipping,
  isCheckoutReady,
  isHydrated,
  isPromoApplied,
  itemCount,
  onApplyPromo,
  onPromoInputBlur,
  onPromoInputChange,
  onPromoInputKeyDown,
  onRemovePromo,
  promoBadgeLabel,
  promoCodeInput,
  promoFeedback,
  quotePending,
  subtotal,
  total,
}: {
  activePromoCode: string | null
  confirmedPromoCode: string | null
  discountAmount: number
  estimatedShipping: number
  isCheckoutReady: boolean
  isHydrated: boolean
  isPromoApplied: boolean
  itemCount: number
  onApplyPromo: () => void
  onPromoInputBlur: () => void
  onPromoInputChange: (value: string) => void
  onPromoInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onRemovePromo: () => void
  promoBadgeLabel: string | null
  promoCodeInput: string
  promoFeedback: PromoFeedback
  quotePending: boolean
  subtotal: number
  total: number
}) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="section-panel overflow-hidden p-6">
        <SectionHeader
          eyebrow="Order summary"
          title="Summary"
          className="gap-0"
          contentClassName="gap-0"
        />

        <div className="surface-muted-panel mt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {isHydrated ? (
                <p className="text-sm font-semibold text-foreground">
                  {itemCount} item{itemCount === 1 ? "" : "s"} in your order
                </p>
              ) : (
                <SkeletonPill className="h-5 w-32" />
              )}
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Review products before completing payment.
              </p>
            </div>
            <div className="summary-badge">
              {estimatedShipping === 0 ? "Free ship" : "Shipping"}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-border/60 pt-5 text-sm">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal, "USD")} />
          {discountAmount > 0 ? (
            <SummaryRow
              label={`Discount${confirmedPromoCode ? ` (${confirmedPromoCode})` : ""}`}
              value={`-${formatCurrency(discountAmount, "USD")}`}
            />
          ) : null}
          <SummaryRow
            label="Estimated shipping"
            value={
              estimatedShipping === 0
                ? "Free"
                : formatCurrency(estimatedShipping, "USD")
            }
          />
          <SummaryRow label="Total" value={formatCurrency(total, "USD")} emphasized />
        </div>

        <div className="mt-2 text-xs leading-5 text-muted-foreground">
          Promo code applies to subtotal only.
        </div>

        <div className="mt-6 border-t border-border/60 pt-5">
          <PromoCodePanel
            activePromoCode={activePromoCode}
            discountAmount={discountAmount}
            isCheckoutReady={isCheckoutReady}
            isPromoApplied={isPromoApplied}
            onApplyPromo={onApplyPromo}
            onPromoInputBlur={onPromoInputBlur}
            onPromoInputChange={onPromoInputChange}
            onPromoInputKeyDown={onPromoInputKeyDown}
            onRemovePromo={onRemovePromo}
            promoBadgeLabel={promoBadgeLabel}
            promoCodeInput={promoCodeInput}
            promoFeedback={promoFeedback}
            quotePending={quotePending}
          />
        </div>
      </div>
    </aside>
  )
}
