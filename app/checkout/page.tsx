import { IconCreditCard, IconTruckDelivery } from "@tabler/icons-react"
import { CheckoutBreadcrumbs } from "./_components/checkout-breadcrumbs"
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client"
import { PageHero } from "@/components/layout/page-hero"
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"

export default function CheckoutPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={<CheckoutBreadcrumbs />}
        eyebrow="Secure checkout"
        title="Finish your order in just a few simple steps."
        description={
          <>
            Review your items, add delivery details, and complete your purchase
            {" "}in just a few simple steps.
          </>
        }
        asideTitle="Checkout notes"
        asideItems={[
          {
            icon: <IconTruckDelivery className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.8} />,
            content: "Free shipping above $75",
          },
          {
            icon: <IconCreditCard className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.8} />,
            content: "Secure card payment",
          },
        ]}
      />

      <ReactQueryProvider>
        <CheckoutPageClient />
      </ReactQueryProvider>
    </main>
  )
}
