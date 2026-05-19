import { IconListDetails, IconSortDescending } from "@tabler/icons-react"
import { Breadcrumbs, PageHero } from "@/components/layout/page-hero"
import { OrdersPageClient } from "@/components/orders/orders-page-client"

export default function OrdersPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: "Order history" }]} />}
        eyebrow="Your orders"
        title="All your orders in one clear place."
        description="Review what you bought, check delivery details, and come back to any order whenever you need it."
        asideTitle="Quick help"
        asideItems={[
          {
            icon: <IconSortDescending className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.8} />,
            content: "Newest orders appear first",
          },
          {
            icon: <IconListDetails className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.8} />,
            content: "Open any order to review items, totals, and address details",
          },
        ]}
      />

      <OrdersPageClient />
    </main>
  )
}
