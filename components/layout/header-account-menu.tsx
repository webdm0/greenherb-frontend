"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconLogout,
  IconReceipt2,
  IconUser,
} from "@tabler/icons-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function HeaderAccountMenu() {
  const router = useRouter()
  const { isAuthenticated, isLoading, isLoggingOut, logout, user } = useAuth()

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Account">
            <IconUser className="h-5 w-5" stroke={1.9} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-50 w-56">
          <div className="px-3 py-2 text-sm">
            <p className="font-semibold text-foreground">{user.username}</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/orders" className="flex items-center gap-2">
              <IconReceipt2 className="h-4 w-4" stroke={1.9} />
              Order history
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              try {
                await logout()
                router.replace("/login")
              } catch {
                router.refresh()
              }
            }}
          >
            <div className="flex items-center gap-2">
              <IconLogout className="h-4 w-4" stroke={1.9} />
              Sign out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (isLoggingOut) {
    return (
      <Button variant="ghost" size="icon" aria-label="Account" disabled>
        <IconUser className="h-5 w-5" stroke={1.9} />
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Account" asChild>
      <Link href="/login" prefetch={false}>
        <IconUser className="h-5 w-5" stroke={1.9} />
      </Link>
    </Button>
  )
}
