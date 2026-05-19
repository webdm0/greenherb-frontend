"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { IconLock } from "@tabler/icons-react"
import { PageState } from "@/components/layout/page-state"
import { Button } from "@/components/ui/button"

interface ProtectedRouteSignInStateProps {
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  icon?: ReactNode
}

export function ProtectedRouteSignInState({
  title,
  description,
  actionHref = "/login",
  actionLabel = "Go to sign in",
  icon = <IconLock className="h-9 w-9" stroke={1.8} />,
}: ProtectedRouteSignInStateProps) {
  return (
    <PageState
      titleTag="h2"
      icon={icon}
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
