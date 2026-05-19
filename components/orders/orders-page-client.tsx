"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { IconAlertCircle, IconListDetails } from "@tabler/icons-react"
import { useAuth } from "@/components/auth/auth-provider"
import { PageErrorState } from "@/components/layout/page-error-state"
import { PageState } from "@/components/layout/page-state"
import { ProtectedRouteSignInState } from "@/components/layout/protected-route-sign-in-state"
import { OrdersLoadingState } from "@/components/orders/orders-loading-state"
import { OrdersListClient } from "@/components/orders/orders-list-client"
import { Button } from "@/components/ui/button"
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"
import { getOrders } from "@/services/api/client"

function OrdersEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string
  description: string
  actionHref: string
  actionLabel: string
}) {
  return (
    <PageState
      titleTag="h2"
      icon={<IconListDetails className="h-9 w-9" stroke={1.8} />}
      title={title}
      description={description}
      actions={
        <Button asChild className="h-11 px-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      }
    />
  )
}

function OrdersPageContent() {
  const { accessToken, isAuthenticated, isLoading } = useAuth()
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: Boolean(!isLoading && isAuthenticated && accessToken),
  })

  if (isLoading) {
    return <OrdersLoadingState />
  }

  if (!isAuthenticated || !accessToken) {
    return (
      <ProtectedRouteSignInState
        title="Sign in to see your orders"
        description="Sign in to review your past purchases, delivery addresses, and order updates in one place."
        icon={<IconListDetails className="h-9 w-9" stroke={1.8} />}
      />
    )
  }

  if (ordersQuery.isLoading) {
    return <OrdersLoadingState />
  }

  if (ordersQuery.isError) {
    return (
      <PageErrorState
        title="We couldn't load your orders."
        description="Please try again. If your order history still does not appear, refresh the page and check back in a moment."
        titleTag="h2"
        icon={<IconAlertCircle className="h-9 w-9" stroke={1.8} />}
        primaryActionLabel="Try again"
        onPrimaryAction={() => {
          void ordersQuery.refetch()
        }}
        secondaryActionLabel="Reload page"
        onSecondaryAction={() => {
          window.location.reload()
        }}
      />
    )
  }

  const orders = ordersQuery.data ?? []

  if (orders.length === 0) {
    return (
      <OrdersEmptyState
        title="No orders yet"
        description="Your first order will appear here with the items, total, and delivery details after checkout."
        actionHref="/"
        actionLabel="Start shopping"
      />
    )
  }

  return <OrdersListClient orders={orders} />
}

export function OrdersPageClient() {
  return (
    <ReactQueryProvider>
      <OrdersPageContent />
    </ReactQueryProvider>
  )
}
