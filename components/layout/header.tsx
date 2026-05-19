import dynamic from "next/dynamic"
import Link from "next/link"
import { Suspense } from "react"
import {
  IconMenu2,
  IconSearch,
  IconShoppingBag,
} from "@tabler/icons-react"
import { BrandLogo } from "@/components/brand/brand-logo"
import { HeaderAccountMenu } from "@/components/layout/header-account-menu"
import { HeaderCategoryNav } from "@/components/layout/header-category-nav"
import { HeaderMobileSearchButton } from "@/components/layout/header-mobile-search-button"
import { HeaderSearch } from "@/components/layout/header-search"
import { Button } from "@/components/ui/button"
import styles from "./header.module.css"

function HeaderMobileMenuFallback() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden -ml-2"
      aria-label="Open menu"
      disabled
    >
      <IconMenu2 className="h-6 w-6" stroke={2} />
    </Button>
  )
}

function HeaderSearchFallback() {
  return (
    <div className="relative hidden lg:block" aria-hidden="true">
      <IconSearch
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        stroke={1.8}
      />
      <div className="h-9 w-44 rounded-md border border-input bg-transparent pl-9 pr-3" />
    </div>
  )
}

const HeaderMobileMenu = dynamic(
  () =>
    import("@/components/layout/header-mobile-menu").then(
      (module) => module.HeaderMobileMenu,
    ),
  {
    loading: HeaderMobileMenuFallback,
  },
)

const LazyCartDrawer = dynamic(
  () =>
    import("@/components/cart/lazy-cart-drawer").then(
      (module) => module.LazyCartDrawer,
    ),
  {
    loading: () => (
      <Button variant="ghost" size="icon" aria-label="Cart" disabled>
        <IconShoppingBag className="h-5 w-5" stroke={1.9} />
      </Button>
    ),
  },
)

export function Header() {
  return (
    <header className="app-surface sticky top-0 z-50 border-b border-border">
      <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground sm:text-sm">
        <p className="truncate sm:truncate-none">
          Free shipping over $75 | Code{" "}
          <span className="font-semibold">GREENHERB15</span> for 15% off
        </p>
      </div>
      <div className="page-shell relative">
        <div className={styles.mainGrid}>
          <div className="flex items-center gap-2">
            <Suspense fallback={<HeaderMobileMenuFallback />}>
              <HeaderMobileMenu />
            </Suspense>
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3"
              aria-label="GreenHerb home"
            >
              <BrandLogo size={32} className="sm:w-10 sm:h-10" />
              <div className="min-w-0">
                <span className="block truncate font-serif text-base font-semibold tracking-tight text-foreground sm:text-xl">
                  GreenHerb
                </span>
                <p className={styles.tagline}>
                  Herbs, Tea, Supplements
                </p>
              </div>
            </Link>
          </div>
          <HeaderCategoryNav />
          <div className="flex items-center gap-2 lg:justify-end">
            <Suspense fallback={<HeaderSearchFallback />}>
              <HeaderSearch />
            </Suspense>
            <HeaderMobileSearchButton />
            <HeaderAccountMenu />
            <LazyCartDrawer />
          </div>
        </div>
      </div>
    </header>
  )
}
