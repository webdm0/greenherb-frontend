"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { getGuestCartItemsForAuth } from "@/hooks/auth/auth-guest-cart"
import { useAuthActions } from "@/hooks/auth/useAuthActions"
import { useAuthSessionLifecycle } from "@/hooks/auth/useAuthSessionLifecycle"
import type { AuthUser } from "@/types/auth"

interface LoginPayload {
  identifier: string
  password: string
}

interface RegisterPayload {
  username: string
  email: string
  password: string
}

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  isLoading: boolean
  isLoggingOut: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { login, register, googleLogin, logout } = useAuthActions()

  const setAuthenticatedState = useCallback(
    (payload: { accessToken: string; user: AuthUser }) => {
      setUser(payload.user)
      setAccessToken(payload.accessToken)
      setIsLoggingOut(false)
    },
    [],
  )

  const clearAuthState = useCallback(() => {
    setUser(null)
    setAccessToken(null)
  }, [])

  const handleUnauthenticated = useCallback(() => {
    clearAuthState()
    setIsLoggingOut(false)
  }, [clearAuthState])

  const refreshSession = useAuthSessionLifecycle({
    accessToken,
    isLoggingOut,
    onBootstrappingChange: setIsLoading,
    onAuthenticated: setAuthenticatedState,
    onUnauthenticated: handleUnauthenticated,
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      isLoggingOut,
      isAuthenticated: Boolean(user && accessToken),
      login: async (payload) => {
        const session = await login.mutateAsync({
          ...payload,
          cartItems: getGuestCartItemsForAuth(),
        })
        setAuthenticatedState(session)
      },
      register: async (payload) => {
        const session = await register.mutateAsync({
          ...payload,
          cartItems: getGuestCartItemsForAuth(),
        })
        setAuthenticatedState(session)
      },
      loginWithGoogle: async (idToken) => {
        const session = await googleLogin.mutateAsync({
          idToken,
          cartItems: getGuestCartItemsForAuth(),
        })
        setAuthenticatedState(session)
      },
      logout: async () => {
        setIsLoggingOut(true)

        try {
          await logout.mutateAsync()
          clearAuthState()
        } catch (error) {
          throw error
        } finally {
          setIsLoggingOut(false)
        }
      },
      refresh: refreshSession,
    }),
    [
      accessToken,
      clearAuthState,
      googleLogin,
      isLoading,
      isLoggingOut,
      login,
      logout,
      refreshSession,
      register,
      setAuthenticatedState,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.")
  }

  return context
}
