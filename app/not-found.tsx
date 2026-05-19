import Link from "next/link"
import { IconArrowLeft, IconLeaf, IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

const notFoundActions = [
  {
    href: "/",
    label: "Back to shop",
    icon: IconArrowLeft,
    buttonProps: { className: "bg-primary text-primary-foreground" },
  },
  {
    href: "/?sort=bestselling",
    label: "View best sellers",
    icon: IconSearch,
    buttonProps: { variant: "outline" as const, className: "border-border" },
  },
] as const

export default function NotFound() {
  return (
    <main className="flex-1 overflow-hidden">
      <section className="relative border-b border-border">
        <div className="not-found-backdrop absolute inset-0" />
        <div className="page-shell relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="hero-chip">
              <IconLeaf className="h-3.5 w-3.5 text-accent" stroke={1.9} />
              404
            </div>

            <h1 className="page-hero-title mt-6 text-5xl md:text-6xl">
              We couldn't find that page.
            </h1>

            <p className="not-found-copy mt-5">
              The page you are looking for is unavailable or may have moved.
              Return to the shop and keep browsing the collection.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {notFoundActions.map(({ href, label, icon: Icon, buttonProps }) => (
                <Button key={href} asChild {...buttonProps}>
                  <Link href={href}>
                    <Icon className="h-4 w-4" stroke={href === "/" ? 1.9 : 1.8} />
                    {label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
