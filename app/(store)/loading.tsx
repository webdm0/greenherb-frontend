import {
  ProductCardSkeleton,
  SkeletonCardGrid,
  SkeletonIntro,
} from "@/components/layout/loading-skeletons"
import styles from "./loading.module.css"

export default function StoreLoading() {
  return (
    <main className="flex-1">
      <div className="page-shell py-10">
        <div className="space-y-8">
          <SkeletonIntro
            eyebrowClassName="h-4 w-24"
            titleClassName="h-10 w-64"
          />

          <div className={styles.grid}>
            <div className={styles.sidebar}>
              <SkeletonCardGrid
                count={4}
                className="space-y-4"
                cardClassName="h-16 rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
