import { Fragment } from "react"
import {
  SkeletonBox,
  SkeletonPanel,
  SkeletonPill,
} from "@/components/layout/loading-skeletons"
import styles from "./checkout-layout.module.css"

export function CheckoutPaymentSectionSkeleton() {
  return (
    <section className="surface-section" aria-hidden="true">
      <div className="flex gap-4">
        <SkeletonBox className="h-12 w-12 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-3">
          <SkeletonPill className="h-3 w-20" />
          <SkeletonBox className="h-7 w-44 rounded-xl" />
          <SkeletonPill className="h-4 w-3/4" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <SkeletonPanel className="h-20 rounded-[1.25rem]" />
        <SkeletonPanel className="h-52 rounded-[1.5rem]" />
      </div>
    </section>
  )
}

export function CheckoutLoadingState({
  withSection = true,
}: {
  withSection?: boolean
}) {
  const Wrapper = withSection ? "section" : Fragment

  return (
    <Wrapper {...(withSection ? { className: "page-section" } : {})}>
      <div className="grid gap-8">
        <SkeletonPanel className="h-44" />

        <div className={styles.mainGrid}>
          <div className="space-y-6">
            <SkeletonPanel className="h-72" />
            <SkeletonPanel className="h-48" />
          </div>
          <SkeletonPanel className="h-80" />
        </div>
      </div>
    </Wrapper>
  )
}
