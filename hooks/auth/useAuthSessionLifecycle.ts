"use client"

import { useEffect } from "react"
import { useAuthBootstrap } from "@/hooks/auth/useAuthBootstrap"
import { refreshAccessToken } from "@/services/api/client"
import {
  configureAuthSessionHandlers,
  setSessionAccessToken,
} from "@/services/api/request"
import type { AuthUser } from "@/types/auth"

interface UseAuthSessionLifecycleParams {
  accessToken: string | null
  isLoggingOut: boolean
  onAuthenticated: (payload: { accessToken: string; user: AuthUser }) => void
  onBootstrappingChange: (value: boolean) => void
  onUnauthenticated: () => void
}

export function useAuthSessionLifecycle({
  accessToken,
  isLoggingOut,
  onAuthenticated,
  onBootstrappingChange,
  onUnauthenticated,
}: UseAuthSessionLifecycleParams) {
  useEffect(() => {
    setSessionAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    configureAuthSessionHandlers({
      onRefreshSuccess: onAuthenticated,
      onUnauthorized: onUnauthenticated,
    })

    return () => {
      configureAuthSessionHandlers({})
    }
  }, [onAuthenticated, onUnauthenticated])

  useAuthBootstrap({
    accessToken,
    isLoggingOut,
    onBootstrappingChange,
    onAuthenticated,
    onUnauthenticated,
  })

  return async () => {
    const session = await refreshAccessToken()
    if (!session?.accessToken) {
      onUnauthenticated()
      return false
    }

    onAuthenticated(session)
    return true
  }
}
