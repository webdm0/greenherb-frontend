import type { ReactNode } from "react"
import Link from "next/link"
import { IconArrowRight, IconCheck, IconReceipt2, IconShoppingBag } from "@tabler/icons-react"
import { Breadcrumbs, PageHero } from "@/components/layout/page-hero"
import { PageState } from "@/components/layout/page-state"
import { Button } from "@/components/ui/button"

interface CheckoutSuccessPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function SuccessActionCard({
  title,
  description,
  href,
  buttonLabel,
  buttonIcon,
  buttonVariant = "default",
}: {
  title: string
  description: string
  href: string
  buttonLabel: string
  buttonIcon: ReactNode
  buttonVariant?: "default" | "outline"
}) {
  return (
    <div className="action-card">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 type-body-sm-relaxed">
        {description}
      </p>
      <Button
        asChild
        variant={buttonVariant}
        className="mt-4 h-11 w-full border-border"
      >
        <Link href={href}>
          {buttonLabel}
          {buttonIcon}
        </Link>
      </Button>
    </div>
  )
}

function getOrderReferenceLabel(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return null
  }

  const normalized = value.trim()
  return /^[A-Z0-9]{6,32}$/i.test(normalized) ? normalized.toUpperCase() : null
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = (await searchParams) ?? {}
  const orderReference = getOrderReferenceLabel(params.orderReference)

  return (
    <main>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Checkout", href: "/checkout" },
              { label: "Success" },
            ]}
          />
        }
        eyebrow="Order confirmed"
        title="Thank you. Your order is confirmed."
        description={
          orderReference
            ? `We received your payment for order #${orderReference}. You can check your order details and status anytime in your order history.`
            : "We received your payment. You can check your order details and status anytime in your order history."
        }
        asideTitle="Next steps"
        asideItems={[
          {
            icon: <IconCheck className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.8} />,
            content: "Your payment went through successfully",
          },
          {
            icon: <IconReceipt2 className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.8} />,
            content: "You can review this order anytime in your account",
          },
        ]}
      />

      <PageState
        titleTag="h2"
        sectionClassName="page-section-lg"
        cardClassName="section-panel-elevated mx-auto max-w-4xl bg-card/90 px-8 py-10 text-center sm:px-10"
        iconContainerClassName="page-state-icon bg-primary text-primary-foreground shadow-sm"
        icon={<IconCheck className="h-10 w-10" stroke={2} />}
        title={orderReference ? `Order #${orderReference} is on its way.` : "Your order is on its way."}
        description="We will keep this order in your history so it is easy to find again whenever you want to check the items, delivery address, or payment details."
        descriptionClassName="mt-4 max-w-2xl"
        actionsClassName="mt-8 grid gap-4 md:grid-cols-2"
        actions={
          <>
            <SuccessActionCard
              title="See your order details"
              description="Open your order history to see what you bought, where it is going, and the current status."
              href="/orders"
              buttonLabel="Order history"
              buttonIcon={<IconArrowRight className="h-4 w-4" stroke={1.9} />}
            />
            <SuccessActionCard
              title="Keep shopping"
              description="Head back to the shop if you want to keep exploring after this order."
              href="/"
              buttonLabel="Continue shopping"
              buttonIcon={<IconShoppingBag className="h-4 w-4" stroke={1.9} />}
              buttonVariant="outline"
            />
          </>
        }
      />
    </main>
  )
}
