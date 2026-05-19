import Link from "next/link"
import { headerCategoryLabels, headerCategoryLinks } from "@/components/layout/header-config"

export function HeaderCategoryNav() {
  return (
    <nav className="hidden lg:flex items-center gap-6 lg:mx-auto">
      {headerCategoryLinks.map(([category, label]) => {
        return (
          <Link
            key={category}
            href={`/category/${category}`}
            className="text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            {headerCategoryLabels[category] ?? label}
          </Link>
        )
      })}
    </nav>
  )
}
