"use client"

import Link from "next/link"
import { type FormEvent, useEffect, useRef, useState } from "react"
import { IconMenu2, IconSearch, IconX } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { headerCategoryLabels, headerCategoryLinks } from "@/components/layout/header-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import styles from "./header-mobile-menu.module.css"

const OPEN_HEADER_MOBILE_MENU_EVENT = "header-mobile-menu:open"

export function HeaderMobileMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dialogId = "mobile-navigation-dialog"
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previousFocusedElementRef = useRef<HTMLElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "")
  }, [searchParams])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleOpen = () => {
      previousFocusedElementRef.current = document.activeElement as HTMLElement | null
      setIsOpen(true)

      requestAnimationFrame(() => {
        searchInputRef.current?.focus()
      })
    }

    window.addEventListener(OPEN_HEADER_MOBILE_MENU_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_HEADER_MOBILE_MENU_EVENT, handleOpen)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      previousFocusedElementRef.current?.focus()
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setIsOpen(false)
        return
      }

      if (event.key !== "Tab") {
        return
      }

      const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements || focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement as HTMLElement | null

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const openMenu = () => {
    previousFocusedElementRef.current = document.activeElement as HTMLElement | null
    setIsOpen(true)

    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigateWithSearch(searchValue)
    searchInputRef.current?.blur()
    closeMenu()
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
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden -ml-2"
        aria-controls={dialogId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => {
          if (isOpen) {
            closeMenu()
            return
          }

          openMenu()
        }}
      >
        {isOpen ? (
          <IconX className="h-6 w-6" stroke={2} />
        ) : (
          <IconMenu2 className="h-6 w-6" stroke={2} />
        )}
      </Button>
      {isOpen ? (
        <div
          ref={panelRef}
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-label="Search and navigation"
          className="app-surface absolute inset-x-0 top-full border-t border-border lg:hidden"
        >
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
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
                      className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm p-2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <IconX className="h-4 w-4" stroke={1.9} />
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-foreground font-medium"
              onClick={closeMenu}
            >
              All Products
            </Link>
            {headerCategoryLinks.map(([category, label]) => (
              <Link
                key={category}
                href={`/category/${category}`}
                className="block py-2 text-foreground font-medium"
                onClick={closeMenu}
              >
                {headerCategoryLabels[category] ?? label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  )
}
