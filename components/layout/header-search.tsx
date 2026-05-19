"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import { IconSearch, IconX } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import styles from "./header-search.module.css"

export function HeaderSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState("")
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "")
  }, [searchParams])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigateWithSearch(searchValue)
    searchInputRef.current?.blur()
  }

  const navigateWithSearch = (value: string) => {
    const trimmedValue = value.trim()
    const params = new URLSearchParams(
      pathname === "/" ? searchParams : undefined,
    )

    if (trimmedValue) {
      params.set("search", trimmedValue)
    } else {
      params.delete("search")
    }

    params.delete("page")

    const search = params.toString()
    router.push(search ? `/?${search}` : "/", { scroll: false })
  }

  const clearSearch = () => {
    setSearchValue("")
    navigateWithSearch("")
  }

  return (
    <form onSubmit={handleSearchSubmit} className="hidden lg:block">
      <div className="relative">
        <IconSearch
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          stroke={1.8}
        />
        <Input
          ref={searchInputRef}
          type="search"
          name="search"
          aria-label="Search products"
          placeholder="Search products"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className={styles.searchInput}
        />
        {searchValue ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <IconX className="h-4 w-4" stroke={1.9} />
          </button>
        ) : null}
      </div>
    </form>
  )
}
