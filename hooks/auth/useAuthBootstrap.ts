"use client"

import { useEffect } from "react"
import { refreshAccessToken } from "@/services/api/client"
import type { AuthUser } from "@/types/auth"

interface UseAuthBootstrapParams {
  accessToken: string | null
  isLoggingOut: boolean
  onBootstrappingChange: (value: boolean) => void
  onAuthenticated: (payload: { accessToken: string; user: AuthUser }) => void
  onUnauthenticated: () => void
}

export function useAuthBootstrap({
  accessToken,
  isLoggingOut,
  onBootstrappingChange,
  onAuthenticated,
  onUnauthenticated,
}: UseAuthBootstrapParams) {
  useEffect(() => {
    let active = true

    if (isLoggingOut) {
      onBootstrappingChange(false)
      return
    }

    if (accessToken) {
      onBootstrappingChange(false)
      return
    }

    onBootstrappingChange(true)

    refreshAccessToken()
      .then((response) => {
        if (!active) {
          return
        }

        if (response?.accessToken) {
          onAuthenticated({
            accessToken: response.accessToken,
            user: response.user,
          })
          return
        }

        onUnauthenticated()
      })
      .finally(() => {
        if (active) {
          onBootstrappingChange(false)
        }
      })

    return () => {
      active = false
    }
  }, [
    accessToken,
    isLoggingOut,
    onAuthenticated,
    onBootstrappingChange,
    onUnauthenticated,
  ])
}
