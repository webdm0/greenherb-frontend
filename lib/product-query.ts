import type {
  DietaryPreference,
  Product,
  ProductCategory,
  ProductForm,
} from "@/types/product"

export type ProductSort =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "rating"
  | "bestselling"

export type AvailabilityFilter = "in-stock" | "sale" | "new"

export type ProductSearchParams = Record<
  string,
  string | string[] | undefined
>

export interface ProductQuery {
  search: string
  categories: ProductCategory[]
  forms: ProductForm[]
  dietary: DietaryPreference[]
  availability: AvailabilityFilter[]
  minPrice: number
  maxPrice: number
  rating?: number
  sort: ProductSort
  page: number
  pageSize: number
}

export interface FacetOption<T extends string = string> {
  label: string
  value: T
  count: number
}

export interface SelectOption<T extends string = string> {
  label: string
  value: T
}

export interface ProductFacets {
  categories: FacetOption<ProductCategory>[]
  forms: FacetOption<ProductForm>[]
  dietary: FacetOption<DietaryPreference>[]
  availability: FacetOption<AvailabilityFilter>[]
  ratings: FacetOption<string>[]
  price: {
    min: number
    max: number
  }
}

export interface ProductSearchResult {
  items: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  facets: ProductFacets
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 9

export const PRICE_RANGE = {
  min: 4,
  max: 48,
} as const

export const sortOptions: SelectOption<ProductSort>[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Highest Rated", value: "rating" },
  { label: "Best Selling", value: "bestselling" },
]

export const categoryLabels: Record<ProductCategory, string> = {
  immunity: "Immunity Support",
  digestive: "Digestive Health",
  "stress-sleep": "Stress & Sleep",
  energy: "Energy & Vitality",
  "joint-mobility": "Joint & Mobility",
}

const formLabels: Record<ProductForm, string> = {
  capsules: "Capsules",
  tablets: "Tablets",
  powders: "Powders",
  "liquid-extracts": "Liquid Extracts",
  gummies: "Gummies",
  teas: "Teas",
}

const dietaryLabels: Record<DietaryPreference, string> = {
  organic: "Organic Certified",
  vegan: "Vegan",
  "gluten-free": "Gluten-Free",
  "non-gmo": "Non-GMO",
  "sugar-free": "Sugar-Free",
}

const availabilityLabels: Record<AvailabilityFilter, string> = {
  "in-stock": "In Stock",
  sale: "On Sale",
  new: "New Arrivals",
}

const categoryValues = Object.keys(categoryLabels) as ProductCategory[]
const formValues = Object.keys(formLabels) as ProductForm[]
const dietaryValues = Object.keys(dietaryLabels) as DietaryPreference[]
const availabilityValues = Object.keys(
  availabilityLabels,
) as AvailabilityFilter[]
const sortValues = sortOptions.map((option) => option.value)

function readStringList(params: ProductSearchParams, key: string) {
  const value = params[key]

  if (Array.isArray(value)) {
    return value.flatMap((item) => item.split(",")).filter(Boolean)
  }

  return value?.split(",").filter(Boolean) ?? []
}

function readNumber(
  params: ProductSearchParams,
  key: string,
  fallback: number,
) {
  const value = Array.isArray(params[key]) ? params[key]?.[0] : params[key]
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : fallback
}

function keepKnownValues<T extends string>(values: string[], known: readonly T[]) {
  return values.filter((value): value is T => known.includes(value as T))
}

export function parseProductQuery(params: ProductSearchParams): ProductQuery {
  const search = readStringList(params, "search")[0]?.trim() ?? ""
  const minPrice = Math.max(
    PRICE_RANGE.min,
    readNumber(params, "min", PRICE_RANGE.min),
  )
  const maxPrice = Math.min(
    PRICE_RANGE.max,
    readNumber(params, "max", PRICE_RANGE.max),
  )
  const rating = readNumber(params, "rating", 0)
  const page = Math.max(
    DEFAULT_PAGE,
    Math.floor(readNumber(params, "page", DEFAULT_PAGE)),
  )
  const rawSort = readStringList(params, "sort")[0]
  const sort = sortValues.includes(rawSort as ProductSort)
    ? (rawSort as ProductSort)
    : "featured"

  return {
    search,
    categories: keepKnownValues(readStringList(params, "category"), categoryValues),
    forms: keepKnownValues(readStringList(params, "form"), formValues),
    dietary: keepKnownValues(readStringList(params, "dietary"), dietaryValues),
    availability: keepKnownValues(
      readStringList(params, "availability"),
      availabilityValues,
    ),
    minPrice: Math.min(minPrice, maxPrice),
    maxPrice: Math.max(minPrice, maxPrice),
    rating: rating > 0 ? Math.min(5, Math.max(1, rating)) : undefined,
    sort,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  }
}

export function buildProductSearchParams(
  query: ProductQuery,
  updates: Partial<
    Omit<ProductQuery, "pageSize"> & {
      page?: number
      rating?: number
    }
  >,
) {
  const nextQuery = {
    ...query,
    ...updates,
  }
  const params = new URLSearchParams()

  if (nextQuery.search) {
    params.set("search", nextQuery.search)
  }

  for (const value of nextQuery.categories) {
    params.append("category", value)
  }

  for (const value of nextQuery.forms) {
    params.append("form", value)
  }

  for (const value of nextQuery.dietary) {
    params.append("dietary", value)
  }

  for (const value of nextQuery.availability) {
    params.append("availability", value)
  }

  if (nextQuery.minPrice > PRICE_RANGE.min) {
    params.set("min", String(nextQuery.minPrice))
  }

  if (nextQuery.maxPrice < PRICE_RANGE.max) {
    params.set("max", String(nextQuery.maxPrice))
  }

  if (nextQuery.rating) {
    params.set("rating", String(nextQuery.rating))
  }

  if (nextQuery.sort !== "featured") {
    params.set("sort", nextQuery.sort)
  }

  if (nextQuery.page > DEFAULT_PAGE) {
    params.set("page", String(nextQuery.page))
  }

  return params.toString()
}

export function buildProductHref(
  query: ProductQuery,
  updates: Parameters<typeof buildProductSearchParams>[1],
  pathname = "/",
) {
  const search = buildProductSearchParams(query, updates)

  return search ? `${pathname}?${search}` : pathname
}
