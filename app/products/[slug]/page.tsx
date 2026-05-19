import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  IconAlertCircle,
  IconAward,
  IconLeaf,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react"
import {
  ProductHeroSection,
  SimilarProductsSection,
} from "@/components/products/product-detail-sections"
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel"
import { Badge } from "@/components/ui/badge"
import {
  formatDate,
  formatDietaryLabel,
  getDietaryContent,
  getProductContent,
  getPurityContent,
  parseIngredientsList,
  parseSentenceList,
} from "@/lib/product-page"
import {
  getProductBySlug,
  getStaticProductSlugs,
} from "@/services/api/server/products"
import styles from "./layout.module.css"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = true

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found | GreenHerb",
    }
  }

  return {
    title: `${product.name} | GreenHerb`,
    description: product.shortDescription,
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getStaticProductSlugs()

    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const ingredientList = parseIngredientsList(product.ingredients)
  const usageSteps = parseSentenceList(product.howToUse)
  const warningNotes = parseSentenceList(product.warnings)
  const productContent = getProductContent(product)
  const purityContent = getPurityContent(product)
  const dietaryContent = getDietaryContent(product)

  return (
    <main>
      <ProductHeroSection
        product={product}
        heroKicker={productContent.heroKicker}
      />

      <section className="page-section">
        <div className={styles.mainGrid}>
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="section-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <IconLeaf className="h-4 w-4 text-accent" stroke={1.9} />
                  <p className="section-label">Made for</p>
                </div>
                <p className="type-heading-xl mt-1">{productContent.madeForTitle}</p>
                <p className="mt-3 type-body-sm-relaxed">{productContent.madeForBody}</p>
              </div>
              <div className="section-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <IconShieldCheck
                    className="h-4 w-4 text-accent"
                    stroke={1.9}
                  />
                  <p className="section-label">Purity</p>
                </div>
                <p className="type-heading-xl mt-1">{purityContent.title}</p>
                <p className="mt-3 type-body-sm-relaxed">{purityContent.body}</p>
              </div>
              <div className="section-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <IconSparkles
                    className="h-4 w-4 text-accent"
                    stroke={1.9}
                  />
                  <p className="section-label">Freshness</p>
                </div>
                <p className="type-heading-xl mt-1">{productContent.freshnessTitle}</p>
                <p className="mt-3 type-body-sm-relaxed">
                  Last quality review on {formatDate(product.updatedAt)}.
                </p>
              </div>
            </div>

            <div className={styles.overviewGrid}>
              <article className="product-detail-overview-card">
                <p className="section-label">Overview</p>
                <h2 className="type-heading-2xl mt-3 leading-tight">
                  {productContent.overviewTitle}
                </h2>
                <p className="section-copy-lg">{product.description}</p>
              </article>

              <aside className="product-detail-contrast-card">
                <p className="section-label text-primary-foreground/60">
                  {dietaryContent.eyebrow}
                </p>
                <h2 className="type-heading-2xl mt-3 leading-tight text-primary-foreground">
                  {dietaryContent.title}
                </h2>
                {product.dietary.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.dietary.map((item) => (
                      <Badge
                        key={item}
                        className="rounded-full bg-primary-foreground/10 px-3 py-1 text-primary-foreground"
                      >
                        {formatDietaryLabel(item)}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                {dietaryContent.points.length > 0 ? (
                  <div className="mt-6 space-y-3 text-sm text-primary-foreground/80">
                    {dietaryContent.points.map((point, index) => (
                      <p key={index} className="flex items-center gap-2">
                        {index === 0 ? (
                          <IconLeaf className="h-4 w-4 shrink-0" stroke={1.9} />
                        ) : (
                          <IconAward className="h-4 w-4 shrink-0" stroke={1.9} />
                        )}
                        {point}
                      </p>
                    ))}
                  </div>
                ) : null}
              </aside>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <article className="product-detail-body-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px bg-border flex-1" />
                  <p className="section-label px-2">Ingredients</p>
                  <div className="h-px bg-border flex-1" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ingredientList.map((ingredient, index) => (
                    <div key={index} className="product-detail-list-item">
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent/65" />
                      <span>{ingredient}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="product-detail-body-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px bg-border flex-1" />
                  <p className="section-label px-2">How to use</p>
                  <div className="h-px bg-border flex-1" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {usageSteps.map((sentence, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="product-detail-step-badge">
                          {index + 1}
                        </div>
                        <p className="pt-0.5 text-sm leading-6 text-foreground">
                          {sentence}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="product-detail-meta-panel">
                    <div>
                      <p className="product-highlight-label uppercase">Serving size</p>
                      <p className="mt-1 text-foreground">
                        {product.servingSize}
                      </p>
                    </div>
                    {product.servingsPerContainer ? (
                      <div>
                        <p className="product-highlight-label uppercase">Per container</p>
                        <p className="mt-1 text-foreground">
                          {product.servingsPerContainer} servings
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            </div>

            <article className="product-detail-warning-card">
              <div className="flex items-start gap-4">
                <div className="product-detail-warning-icon">
                  <IconAlertCircle className="h-5 w-5" stroke={1.9} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="product-detail-warning-label">Important notes</p>
                    <div className="product-detail-warning-divider" />
                  </div>
                  <div className="mt-3 space-y-2">
                    {warningNotes.map((sentence, index) => (
                      <p key={index} className="product-detail-warning-copy">
                        {sentence}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="lg:sticky lg:top-28">
            <ProductPurchasePanel product={product} />
          </div>
        </div>
      </section>

      <SimilarProductsSection product={product} />
    </main>
  )
}
