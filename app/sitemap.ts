import type { MetadataRoute } from "next"
import { categoryLabels } from "@/lib/product-query"
import { getSiteUrl } from "@/lib/site-url"
import { getStaticProductSlugs } from "@/services/api/server/products"
import type { ProductCategory } from "@/types/product"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/register`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/checkout`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]
  const categoryRoutes: MetadataRoute.Sitemap = (
    Object.keys(categoryLabels) as ProductCategory[]
  ).map((category) => ({
    url: `${siteUrl}/category/${category}`,
    changeFrequency: "daily",
    priority: 0.9,
  }))

  try {
    const productRoutes: MetadataRoute.Sitemap = (
      await getStaticProductSlugs()
    ).map((slug) => ({
      url: `${siteUrl}/products/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    return [...staticRoutes, ...categoryRoutes, ...productRoutes]
  } catch {
    return [...staticRoutes, ...categoryRoutes]
  }
}
