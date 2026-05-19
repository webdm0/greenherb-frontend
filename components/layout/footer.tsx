import Link from "next/link"
import {
  IconBrandGithub,
  IconCreditCard,
  IconRefresh,
  IconShieldCheck,
  IconTruckDelivery,
} from "@tabler/icons-react"
import { BrandLogo } from "@/components/brand/brand-logo"
import { ProjectDisclaimerModal } from "@/components/legal/project-disclaimer-modal"
import { categoryLabels } from "@/lib/product-query"
import type { ProductCategory } from "@/types/product"
import styles from "./footer.module.css"

const footerHighlights = [
  {
    title: "Free Shipping",
    description: "Tracked delivery on orders over $75.",
    icon: IconTruckDelivery,
  },
  {
    title: "Easy Returns",
    description: "A simple 30-day test return flow.",
    icon: IconRefresh,
  },
  {
    title: "Quality Assured",
    description: "Product cards include ratings and badges.",
    icon: IconShieldCheck,
  },
  {
    title: "Secure Payment",
    description: "Stripe test checkout with no real charges.",
    icon: IconCreditCard,
  },
] as const

const footerSourceLinks = [
  {
    href: "https://github.com/webdm0/greenherb-frontend",
    label: "Frontend",
  },
  {
    href: "https://github.com/webdm0/greenherb-backend",
    label: "Backend",
  },
] as const

const footerShopLinks = [
  { href: "/", label: "All Products" },
] as const

const footerAccountLinks = [
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create account" },
  { href: "/orders", label: "Order history" },
  { href: "/checkout", label: "Checkout" },
] as const

const footerExploreLinks = [
  { href: "/?availability=sale", label: "On Sale" },
  { href: "/?availability=new", label: "New Arrivals" },
  { href: "/?sort=rating", label: "Top Rated" },
  { href: "/?sort=price-low", label: "Price: Low to High" },
] as const

const footerPaymentBadges = ["Visa", "MC", "Amex", "PP"] as const

function FooterSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className={styles.sectionTitle}>{children}</h4>
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="border-b border-primary-foreground/10">
        <div className="page-shell py-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {footerHighlights.map(({ title, description, icon: Icon }) => (
              <div key={title} className={styles.featureCard}>
                <div className="flex items-start gap-3">
                  <div className={styles.featureIcon}>
                    <Icon className="h-6 w-6" stroke={1.8} />
                  </div>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-primary-foreground/70">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-shell py-12">
        <div className={styles.mainGrid}>
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <BrandLogo size={40} />
              <div>
                <h3 className="font-serif text-xl font-semibold">GreenHerb</h3>
                <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
                  Herbal Supplements Store
                </p>
              </div>
            </div>
            <p className={`${styles.mutedCopy} mb-6 max-w-md`}>
              Everyday wellness essentials with a clean shopping flow, clear
              product discovery, and a calm checkout experience.
            </p>
            <div
              className={`inline-flex max-w-full flex-wrap items-center gap-3 p-3 pl-4 text-sm ${styles.footerSourceBlock}`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className={styles.footerSourceCodeIcon}
              >
                <path
                  d="M16 18L22 12L16 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 6L2 12L8 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={styles.footerSourceText}>Open Source</span>
              <span className={styles.footerSourceDivider} />
              <a
                href={footerSourceLinks[0].href}
                target="_blank"
                rel="noreferrer"
                className={styles.footerSourceLink}
              >
                {footerSourceLinks[0].label}
              </a>
              <span className={styles.footerSourceDot} />
              <a
                href={footerSourceLinks[1].href}
                target="_blank"
                rel="noreferrer"
                className={styles.footerSourceLink}
              >
                {footerSourceLinks[1].label}
              </a>
            </div>
          </div>

          <div>
            <FooterSectionTitle>Shop</FooterSectionTitle>
            <ul className="space-y-3">
              {footerShopLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.link}>
                    {label}
                  </Link>
                </li>
              ))}
              {(Object.entries(categoryLabels) as [ProductCategory, string][]).map(
                ([key, label]) => (
                  <li key={key}>
                    <Link
                      href={`/category/${key}`}
                      className={styles.link}
                    >
                      {label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <FooterSectionTitle>Account</FooterSectionTitle>
            <ul className="space-y-3">
              {footerAccountLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={
                      href === "/login" || href === "/register" ? false : undefined
                    }
                    className={styles.accountLink}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterSectionTitle>Explore</FooterSectionTitle>
            <ul className="space-y-3">
              {footerExploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterSectionTitle>Contact</FooterSectionTitle>
            <div className="space-y-3 text-primary-foreground/80">
            <div>
                <p className="font-medium text-primary-foreground">GitHub</p>
                <a
                  href="https://github.com/webdm0"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.profileLink}
                >
                  <IconBrandGithub className="h-4 w-4" stroke={1.8} />
                  Profile
                </a>
              </div>
              <div>
                <p className="font-medium text-primary-foreground">Support</p>
                <a
                  href="mailto:you@example.com"
                  className={styles.supportEmail}
                >
                  help@greenherb.store
                </a>
              </div>
              <div>
                <p className="font-medium text-primary-foreground">Hours</p>
                <p className="text-primary-foreground/70">
                  Mon - Fri, 9:00 - 18:00 UTC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="page-shell py-6">
          <div className={styles.bottomGrid}>
            <p className="text-sm text-primary-foreground/60 lg:text-left">
              © 2026 GreenHerb. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <ProjectDisclaimerModal
                triggerLabel="Terms of Service"
                triggerClassName={styles.bottomLink}
              />
              <span className="text-primary-foreground/35">·</span>
              <ProjectDisclaimerModal
                triggerLabel="Privacy Policy"
                triggerClassName={styles.bottomLink}
              />
              <span className="text-primary-foreground/35">·</span>
              <Link href="/sitemap.xml" className={styles.bottomLink}>
                Sitemap
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 lg:justify-end">
              {footerPaymentBadges.map((label) => (
                <div
                  key={label}
                  className="flex h-6 w-10 items-center justify-center rounded bg-primary-foreground/10 text-xs font-medium"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
