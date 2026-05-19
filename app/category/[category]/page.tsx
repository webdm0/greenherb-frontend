import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  categoryDescriptions,
  ShopPageContent,
} from "@/components/products/shop-page-content"
import { categoryLabels } from "@/lib/product-query"
import type { ProductCategory } from "@/types/product"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

const categories = Object.keys(categoryLabels) as ProductCategory[]

export const dynamicParams = false
export const dynamic = "force-static"

function parseCategory(value: string): ProductCategory | null {
  return categories.includes(value as ProductCategory)
    ? (value as ProductCategory)
    : null
}

export function generateStaticParams() {
  return categories.map((category) => ({ category }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = parseCategory((await params).category)

  if (!category) {
    return {
      title: "Category Not Found | GreenHerb",
    }
  }

  return {
    title: `${categoryLabels[category]} | GreenHerb`,
    description: categoryDescriptions[category],
  }
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const category = parseCategory((await params).category)

  if (!category) {
    notFound()
  }

  return (
    <ShopPageContent
      lockedCategory={category}
    />
  )
}
