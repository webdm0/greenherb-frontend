"use client"

import { PageErrorState } from "@/components/layout/page-error-state"
import { fontVariables } from "./fonts"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-background text-foreground">
        <main className="grid min-h-screen place-items-center">
          <PageErrorState
            sectionClassName="w-full max-w-3xl"
            cardClassName="section-panel-elevated mx-4 bg-card/95 px-6 py-12 text-center sm:px-10"
            eyebrow="Storefront"
            title="Something went wrong."
            description="This page ran into a problem. Try reloading it, or head back to the storefront."
            primaryActionLabel="Try again"
            onPrimaryAction={reset}
            secondaryActionLabel="Go home"
            secondaryActionHref="/"
          />
        </main>
      </body>
    </html>
  )
}
