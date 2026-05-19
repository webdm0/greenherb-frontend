import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import {
  IconArrowRight,
  IconCheck,
  IconShieldCheck,
  IconShoppingBag,
  IconSparkles,
} from "@tabler/icons-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ProductCardSkeleton } from "@/components/layout/loading-skeletons"
import { ProductCard } from "@/components/products/product-card"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/ui/rating-stars"
import type { ProductDetail } from "@/lib/product-detail"
import {
  buildCategoryHref,
  formatCategoryLabel,
  formatFormLabel,
  getProductHighlights,
  getUsageCue,
} from "@/lib/product-page"
import { getRelatedProducts } from "@/services/api/server/products"
import styles from "./product-detail-sections.module.css"

function ProductHighlights({ product }: { product: ProductDetail }) {
  const highlights = getProductHighlights(product)

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {highlights.map((highlight) => (
        <div
          key={highlight.label}
          className="product-highlight-card"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <IconCheck className="h-3.5 w-3.5" stroke={2.3} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="product-highlight-label uppercase">{highlight.label}</p>
              <p className="product-highlight-value">{highlight.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductHeroSection({
  product,
  heroKicker,
}: {
  product: ProductDetail
  heroKicker: string
}) {
  const usageCue = getUsageCue(product)

  return (
    <section className="page-hero-section">
      <div className="page-hero-glow pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="page-shell relative">
        <Breadcrumbs
          rootItem={{
            label: "Shop",
            href: "/",
            icon: <IconShoppingBag className="h-4 w-4" stroke={1.9} />,
          }}
          items={[
            {
              label: formatCategoryLabel(product.category),
              href: buildCategoryHref(product.category),
            },
            { label: product.name },
          ]}
        />

        <div className={styles.heroGrid}>
          <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={styles.brandBadge}>
                {product.brand}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {formatCategoryLabel(product.category)}
              </Badge>
              {product.isFeatured ? (
                <Badge
                  variant="outline"
                  className="rounded-full border-accent/40 bg-card/70 px-3 py-1"
                >
                  Recommended
                </Badge>
              ) : null}
            </div>

            <div className="min-w-0 max-w-3xl">
              <p className="page-hero-kicker">{heroKicker}</p>
              <h1 className="page-hero-title mt-3 tracking-tight">{product.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {product.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-foreground">
              <span className="inline-flex min-w-0 items-center gap-2">
                <RatingStars rating={product.rating} className="rating-stars gap-1" />
                <strong>{product.rating.toFixed(1)}</strong>
                <span className="text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-2">
                <IconSparkles className="h-4 w-4 text-accent" stroke={1.9} />
                <span>{product.soldCount.toLocaleString("en-US")} sold</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-2">
                <IconShieldCheck className="h-4 w-4 text-accent" stroke={1.9} />
                {usageCue}
              </span>
            </div>

            <ProductHighlights product={product} />
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 hidden h-28 w-28 rounded-full bg-accent/10 blur-2xl lg:block" />
            <div className="product-hero-media-frame">
              <div className="product-hero-media-surface">
                <div className="absolute inset-x-6 top-6 z-10 flex items-center justify-between">
                  <div className="rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                    {product.sku}
                  </div>
                  <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    {formatFormLabel(product.form)}
                  </div>
                </div>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  preload
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedProductsFallback() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

async function RelatedProductsGrid({
  category,
  currentSlug,
}: {
  category: ProductDetail["category"]
  currentSlug: string
}) {
  const relatedProducts = await getRelatedProducts(category, currentSlug)

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {relatedProducts.map((relatedProduct) => (
        <ProductCard key={relatedProduct.id} product={relatedProduct} />
      ))}
    </div>
  )
}

export function SimilarProductsSection({ product }: { product: ProductDetail }) {
  return (
    <section className="border-y border-border bg-secondary/35">
      <div className="page-section">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">More to explore</p>
            <h2 className="section-card-heading">Similar formulas in the collection</h2>
          </div>
          <Link
            href={buildCategoryHref(product.category)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Curated by category and current assortment
            <IconArrowRight className="h-4 w-4" stroke={1.9} />
          </Link>
        </div>

        <Suspense fallback={<RelatedProductsFallback />}>
          <RelatedProductsGrid
            category={product.category}
            currentSlug={product.slug}
          />
        </Suspense>
      </div>
    </section>
  )
}
