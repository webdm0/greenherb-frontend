"use client"

import { sortOptions, type ProductSort } from "@/lib/product-query"
import { useShopNavigation } from "@/components/products/shop-navigation"
import { DropdownSelect } from "@/components/ui/dropdown-select"
import styles from "./product-sort-select.module.css"

interface ProductSortSelectProps {
  value: ProductSort
}

export function ProductSortSelect({ value }: ProductSortSelectProps) {
  const navigation = useShopNavigation()
  const currentSort = navigation.query.sort ?? value
  const activeOption =
    sortOptions.find((option) => option.value === currentSort) ?? sortOptions[0]

  const handleValueChange = (nextSort: ProductSort) => {
    navigation.navigate({
      sort: nextSort,
      page: 1,
    })
  }

  return (
    <DropdownSelect
      ariaLabel="Sort products"
      className={styles.trigger}
      onValueChange={(nextSort) => handleValueChange(nextSort as ProductSort)}
      options={sortOptions}
      placeholder={activeOption.label}
      value={currentSort}
    />
  )
}
