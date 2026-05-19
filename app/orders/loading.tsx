import {
  SkeletonIntro,
} from "@/components/layout/loading-skeletons"
import { OrdersLoadingState } from "@/components/orders/orders-loading-state"

export default function OrdersLoading() {
  return (
    <main>
      <section className="page-section">
        <div className="grid gap-8">
          <SkeletonIntro />

          <OrdersLoadingState withSection={false} />
        </div>
      </section>
    </main>
  )
}
