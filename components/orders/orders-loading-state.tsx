import { Fragment } from "react"
import {
  OrdersMetricSkeleton,
  SurfaceCardSkeleton,
} from "@/components/layout/loading-skeletons"

export function OrdersLoadingState({
  withSection = true,
}: {
  withSection?: boolean
}) {
  const Wrapper = withSection ? "section" : Fragment

  return (
    <Wrapper {...(withSection ? { className: "page-section" } : {})}>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <OrdersMetricSkeleton key={index} />
        ))}
      </div>
      <div className="mt-8 grid gap-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <SurfaceCardSkeleton key={index} className="h-56 rounded-[1.75rem]" />
        ))}
      </div>
    </Wrapper>
  )
}
