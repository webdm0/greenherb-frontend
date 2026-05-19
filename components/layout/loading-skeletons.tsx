import { cn } from "@/lib/utils"
import styles from "./loading-skeletons.module.css"

interface SkeletonIntroProps {
  eyebrowClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

interface SkeletonBoxProps {
  className?: string
}

interface SkeletonPrimitiveProps {
  className?: string
}

interface SoftPendingStateProps {
  className?: string
  label?: string
}

interface SkeletonCardGridProps {
  count: number
  className?: string
  cardClassName?: string
}

function Skeleton({ className }: SkeletonPrimitiveProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(styles.root, className)}
    />
  )
}

export function SkeletonIntro({
  eyebrowClassName = styles.introEyebrow,
  titleClassName = styles.introTitle,
  descriptionClassName = styles.introDescription,
}: SkeletonIntroProps) {
  return (
    <div className="space-y-3">
      <Skeleton className={eyebrowClassName} />
      <Skeleton className={titleClassName} />
      <Skeleton className={descriptionClassName} />
    </div>
  )
}

export function SkeletonBox({ className }: SkeletonBoxProps) {
  return <Skeleton className={cn(styles.box, className)} />
}

export function SkeletonPanel({ className }: SkeletonPrimitiveProps) {
  return <Skeleton className={cn(styles.panel, className)} />
}

export function SkeletonPill({ className }: SkeletonPrimitiveProps) {
  return <Skeleton className={cn(styles.pill, className)} />
}

export function SkeletonCircle({ className }: SkeletonPrimitiveProps) {
  return <Skeleton className={cn(styles.circle, className)} />
}

export function SoftPendingState({
  className,
  label = "Updating content...",
}: SoftPendingStateProps) {
  return (
    <div className={cn(styles.softPendingOverlay, className)} aria-hidden="true">
      <div className={styles.softPendingBadge}>
        <SkeletonCircle className="h-4 w-4" />
        <span>{label}</span>
      </div>
    </div>
  )
}

export function SkeletonCardGrid({
  count,
  className,
  cardClassName = styles.card,
}: SkeletonCardGridProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={cardClassName} />
      ))}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <SkeletonBox className={styles.productMedia} />
      <div className={styles.productBody}>
        <SkeletonBox className="h-5 w-2/3 rounded-full" />
        <SkeletonBox className="h-4 w-full rounded-full" />
        <SkeletonBox className="h-4 w-1/3 rounded-full" />
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <article className="cart-review-item-card" aria-hidden="true">
      <div className="flex items-start gap-4">
        <SkeletonBox className="cart-review-thumb" />
        <div className="min-w-0 flex-1">
          <SkeletonPill className="h-3 w-16" />
          <SkeletonPill className="mt-3 h-6 w-40" />
          <SkeletonPill className="mt-3 h-4 w-full" />
          <SkeletonPill className="mt-2 h-4 w-3/4" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <SkeletonPill className="h-4 w-20" />
        <SkeletonPill className="h-5 w-16" />
      </div>
    </article>
  )
}

export function OrdersMetricSkeleton() {
  return (
    <div className={styles.orderMetricCard} aria-hidden="true">
      <div className="flex h-full items-center justify-between gap-4 p-5">
        <div className="min-w-0 flex-1 space-y-3">
          <SkeletonPill className="h-3 w-20" />
          <SkeletonBox className="h-7 w-16 rounded-xl" />
        </div>
        <SkeletonCircle className="h-11 w-11 shrink-0" />
      </div>
    </div>
  )
}

export function SurfaceCardSkeleton({ className }: SkeletonPrimitiveProps) {
  return (
    <div className={cn(styles.surfaceCard, className)} aria-hidden="true">
      <div className="space-y-4 p-5">
        <SkeletonPill className="h-3 w-24" />
        <SkeletonBox className="h-6 w-3/5 rounded-xl" />
        <div className="space-y-2">
          <SkeletonPill className="h-4 w-full" />
          <SkeletonPill className="h-4 w-4/5" />
          <SkeletonPill className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}
