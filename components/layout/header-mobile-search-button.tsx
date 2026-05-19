"use client"

import { IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

const OPEN_HEADER_MOBILE_MENU_EVENT = "header-mobile-menu:open"

export function HeaderMobileSearchButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      aria-controls="mobile-navigation-dialog"
      aria-label="Open search and navigation"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent(OPEN_HEADER_MOBILE_MENU_EVENT, {
            detail: { source: "search-button" },
          }),
        )
      }
    >
      <IconSearch className="h-5 w-5" stroke={1.8} />
    </Button>
  )
}
