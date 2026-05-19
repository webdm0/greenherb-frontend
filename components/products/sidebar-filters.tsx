"use client"

import Link from "next/link"
import { useEffect, useState, type ReactNode } from "react"
import {
  IconAdjustmentsHorizontal,
  IconArrowRight,
  IconChevronDown,
  IconChevronUp,
  IconLayoutGrid,
  IconX,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import {
  PRICE_RANGE,
  type AvailabilityFilter,
  type FacetOption,
  type ProductFacets,
  type ProductQuery,
  categoryLabels,
} from "@/lib/product-query"
import { useShopNavigation } from "@/components/products/shop-navigation"
import type {
  DietaryPreference,
  ProductForm,
} from "@/types/product"
import styles from "./sidebar-filters.module.css"

interface SidebarFiltersProps {
  facets: ProductFacets
  query: ProductQuery
}

type FilterKey = "form" | "dietary" | "availability"
type FilterValueMap = {
  form: ProductForm
  dietary: DietaryPreference
  availability: AvailabilityFilter
}

function resolveVisiblePriceRange(
  query: ProductQuery,
  facets: ProductFacets,
): [number, number] {
  const usesDefaultRange =
    query.minPrice === PRICE_RANGE.min && query.maxPrice === PRICE_RANGE.max

  if (usesDefaultRange) {
    return [facets.price.min, facets.price.max]
  }

  return [query.minPrice, query.maxPrice]
}

interface FilterSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border pb-4">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between py-3 text-left font-medium text-foreground"
      >
        {title}
        {isOpen ? (
          <IconChevronUp className="h-4 w-4 text-muted-foreground" stroke={1.75} />
        ) : (
          <IconChevronDown className="h-4 w-4 text-muted-foreground" stroke={1.75} />
        )}
      </button>
      {isOpen && <div className="space-y-3 pb-2">{children}</div>}
    </div>
  )
}

function FilterCheckbox({
  option,
  checked,
  onCheckedChange,
}: {
  option: FacetOption
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 group">
      <Checkbox
        aria-label={option.label}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
        className={styles.checkbox}
      />
      <span className="text-sm text-foreground group-hover:text-accent transition-colors flex-1">
        {option.label}
      </span>
      <span className="text-xs text-muted-foreground">({option.count})</span>
    </label>
  )
}

function ListFilterSection({
  title,
  options,
  selectedValues,
  onToggle,
}: {
  title: string
  options: FacetOption[]
  selectedValues: string[]
  onToggle: (value: string, checked: boolean) => void
}) {
  return (
    <FilterSection title={title}>
      {options.map((option) => (
        <FilterCheckbox
          key={option.value}
          option={option}
          checked={selectedValues.includes(option.value)}
          onCheckedChange={(checked) => onToggle(option.value, checked)}
        />
      ))}
    </FilterSection>
  )
}

const filterNavigationKeyMap = {
  form: "forms",
  dietary: "dietary",
  availability: "availability",
} as const

function getActiveFilterValues(
  key: FilterKey,
  query: ProductQuery,
): Set<FilterValueMap[FilterKey]> {
  switch (key) {
    case "form":
      return new Set(query.forms)
    case "dietary":
      return new Set(query.dietary)
    case "availability":
      return new Set(query.availability)
  }
}

function FilterContent({ facets, query }: SidebarFiltersProps) {
  const navigation = useShopNavigation()
  const [priceRange, setPriceRange] = useState<[number, number]>(
    resolveVisiblePriceRange(query, facets),
  )
  const activeQuery = navigation.query

  useEffect(() => {
    setPriceRange(resolveVisiblePriceRange(activeQuery, facets))
  }, [activeQuery, facets])

  const toggleListFilter = <TKey extends FilterKey>(
    key: TKey,
    value: FilterValueMap[TKey],
    checked: boolean,
  ) => {
    const values = getActiveFilterValues(key, activeQuery)

    if (checked) {
      values.add(value)
    } else {
      values.delete(value)
    }

    navigation.navigate({
      [filterNavigationKeyMap[key]]: Array.from(values),
      page: 1,
    })
  }

  const toggleRating = (value: string, checked: boolean) => {
    navigation.navigate({
      rating: checked ? Number(value) : undefined,
      page: 1,
    })
  }

  const updatePriceRange = (value: number[]) => {
    const [min = PRICE_RANGE.min, max = PRICE_RANGE.max] = value

    navigation.navigate({
      minPrice: min,
      maxPrice: max,
      page: 1,
    })
  }

  const clearFilters = () => {
    navigation.navigate({
      categories: activeQuery.categories,
      forms: [],
      dietary: [],
      availability: [],
      rating: undefined,
      minPrice: PRICE_RANGE.min,
      maxPrice: PRICE_RANGE.max,
      page: 1,
    })
  }
  const hasCategoryContext = activeQuery.categories.length > 0

  return (
    <div className="space-y-2">
      {hasCategoryContext ? (
        <div className="border-b border-border pb-5">
          <div className="section-card-compact border-border/70">
            <div className="flex items-center gap-2 eyebrow-label-soft">
              <IconLayoutGrid className="h-4 w-4" stroke={1.8} />
              Browsing
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeQuery.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center rounded-md bg-secondary px-3 py-2 font-serif text-base font-semibold text-foreground"
                >
                  {categoryLabels[category]}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all categories
            <IconArrowRight className="h-4 w-4" stroke={1.8} />
          </Link>
        </div>
      ) : null}
      <FilterSection title="Price Range">
        <div className="px-1 pt-2">
          <Slider
            aria-label="Price range"
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            onValueCommit={updatePriceRange}
            min={facets.price.min}
            max={facets.price.max}
            step={5}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>
      </FilterSection>
      <ListFilterSection
        title="Product Form"
        options={facets.forms}
        selectedValues={activeQuery.forms}
        onToggle={(value, checked) => toggleListFilter("form", value as ProductForm, checked)}
      />
      <ListFilterSection
        title="Dietary Preferences"
        options={facets.dietary}
        selectedValues={activeQuery.dietary}
        onToggle={(value, checked) =>
          toggleListFilter("dietary", value as DietaryPreference, checked)}
      />
      <FilterSection title="Customer Rating">
        {facets.ratings.map((option) => (
          <FilterCheckbox
            key={option.value}
            option={option}
            checked={String(activeQuery.rating ?? "") === option.value}
            onCheckedChange={(checked) => toggleRating(option.value, checked)}
          />
        ))}
      </FilterSection>
      <ListFilterSection
        title="Availability"
        options={facets.availability}
        selectedValues={activeQuery.availability}
        onToggle={(value, checked) =>
          toggleListFilter("availability", value as AvailabilityFilter, checked)}
      />
      <div className="pt-4">
        <Button
          variant="outline"
          className="w-full text-foreground border-border hover:bg-secondary"
          onClick={clearFilters}
        >
          <IconX className="h-4 w-4 mr-2" stroke={2} />
          Clear Refinements
        </Button>
      </div>
    </div>
  )
}

export function SidebarFilters({ facets, query }: SidebarFiltersProps) {
  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-36">
          <h2 className="type-heading-lg mb-4">
            Filters
          </h2>
          <FilterContent facets={facets} query={query} />
        </div>
      </aside>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full mb-4 border-border text-foreground"
            >
              <IconAdjustmentsHorizontal className="h-4 w-4 mr-2" stroke={1.9} />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className={styles.sheetContent}
          >
            <SheetHeader className="p-0 pr-8">
              <SheetTitle className="font-serif text-foreground">
                Filters
              </SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Refine your product search using the filters below.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 pb-2">
              <FilterContent facets={facets} query={query} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
