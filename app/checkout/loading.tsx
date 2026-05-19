import {
  SkeletonIntro,
} from "@/components/layout/loading-skeletons"
import { CheckoutLoadingState } from "@/components/checkout/checkout-loading-state"

export default function CheckoutLoading() {
  return (
    <main>
      <section className="page-section">
        <div className="grid gap-8">
          <SkeletonIntro
            eyebrowClassName="h-4 w-28"
            titleClassName="h-11 w-96"
          />

          <CheckoutLoadingState withSection={false} />
        </div>
      </section>
    </main>
  )
}
