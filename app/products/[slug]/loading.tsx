import {
  SkeletonCardGrid,
  SkeletonIntro,
  SkeletonPill,
  SkeletonPanel,
} from "@/components/layout/loading-skeletons"
import styles from "./layout.module.css"

export default function ProductLoading() {
  return (
    <main>
      <div className="page-shell py-10">
        <div className={styles.heroGrid}>
          <div className="space-y-6">
            <div className="flex gap-2">
              <SkeletonPill className="h-7 w-20" />
              <SkeletonPill className="h-7 w-28" />
            </div>
            <SkeletonIntro
              eyebrowClassName="h-4 w-28"
              titleClassName="h-12 w-3/4"
            />
            <SkeletonCardGrid count={4} className="grid gap-3 sm:grid-cols-2" />
          </div>

          <div className="section-panel p-3">
            <SkeletonPanel className={styles.imageSkeletonAspect} />
          </div>
        </div>
      </div>
    </main>
  )
}
