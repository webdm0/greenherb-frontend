"use client"

import { PageErrorState } from "@/components/layout/page-error-state"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <PageErrorState
      sectionClassName="page-section-lg"
      cardClassName="section-panel mx-auto max-w-2xl px-6 py-12 text-center sm:px-10"
      eyebrow="Storefront"
      iconContainerClassName="mx-auto"
      title="We couldn't load this page."
      description="Please try again. If the page still doesn't load, refresh and check back in a moment."
      primaryActionLabel="Try again"
      onPrimaryAction={reset}
      secondaryActionLabel="Reload page"
      onSecondaryAction={handleReload}
    />
  )
}
