import Link from "next/link";
import {
  IconAdjustmentsHorizontal,
  IconLeaf,
  IconReceipt2,
  IconShoppingBag,
} from "@tabler/icons-react";
import { SectionHeader } from "@/components/layout/section-header";
import { SectionDividerTitle } from "@/components/layout/section-divider-title";
import styles from "./auth-shell.module.css";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  heroEyebrow?: string;
  heroTitle: string;
  heroDescription: string;
  switchLabel: string;
  switchHref: string;
  switchText: string;
  socialActions?: React.ReactNode;
  children: React.ReactNode;
}

const authHighlights = [
  {
    label: "Shop faster",
    icon: IconShoppingBag,
  },
  {
    label: "Use filters",
    icon: IconAdjustmentsHorizontal,
  },
  {
    label: "Track orders",
    icon: IconReceipt2,
  },
] as const;

export function AuthShell({
  eyebrow,
  title,
  description,
  heroEyebrow = "Account access",
  heroTitle,
  heroDescription,
  switchLabel,
  switchHref,
  switchText,
  socialActions,
  children,
}: AuthShellProps) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="auth-shell-backdrop absolute inset-0" />
      <div className="page-shell relative py-14 sm:py-20">
        <div className={styles.shellGrid}>
          <section className="hidden lg:block">
            <div className="page-hero-body max-w-lg">
              <div className="auth-shell-hero-eyebrow">
                <IconLeaf className="h-3.5 w-3.5 text-accent" stroke={1.9} />
                {heroEyebrow}
              </div>
              <h1 className="page-hero-title mt-6 text-5xl xl:text-6xl">
                {heroTitle}
              </h1>
              <p className="page-hero-copy mt-5 text-base text-pretty sm:text-lg">
                {heroDescription}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {authHighlights.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="section-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-accent">
                        <Icon className="h-4 w-4" stroke={1.9} />
                      </span>
                      <span>{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full max-w-md mx-auto lg:ml-auto">
            <div className="auth-shell-panel">
              <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                eyebrowClassName="eyebrow-label"
                titleClassName="sm:text-4xl"
                descriptionClassName="mt-3"
                className="gap-0"
                contentClassName="gap-0"
              />

              <div className="mt-6 grid gap-3">{socialActions}</div>

              <SectionDividerTitle
                className="my-6 gap-3"
                labelClassName="eyebrow-label-soft px-0"
                labelTag="span"
              >
                or
              </SectionDividerTitle>

              {children}

              <p className="mt-6 text-center type-body-sm">
                {switchLabel}{" "}
                <Link
                  href={switchHref}
                  prefetch={false}
                  className="font-semibold text-foreground hover:text-accent transition-colors"
                >
                  {switchText}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
