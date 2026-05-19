"use client"

import type { ReactNode } from "react"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { AuthProvider, useAuth } from "@/components/auth/auth-provider"
import { refreshAccessToken } from "@/services/api/client"
import {
  configureAuthSessionHandlers,
  setSessionAccessToken,
} from "@/services/api/request"

const loginMutateAsync = vi.fn()
const registerMutateAsync = vi.fn()
const googleLoginMutateAsync = vi.fn()
const logoutMutateAsync = vi.fn()
const useAuthBootstrapMock = vi.fn()

vi.mock("@/hooks/auth/useAuthActions", () => ({
  useAuthActions: () => ({
    login: { mutateAsync: loginMutateAsync },
    register: { mutateAsync: registerMutateAsync },
    googleLogin: { mutateAsync: googleLoginMutateAsync },
    logout: { mutateAsync: logoutMutateAsync },
  }),
}))

vi.mock("@/hooks/auth/useAuthBootstrap", () => ({
  useAuthBootstrap: (payload: unknown) => useAuthBootstrapMock(payload),
}))

vi.mock("@/services/api/client", () => ({
  refreshAccessToken: vi.fn(),
}))

vi.mock("@/services/api/request", () => ({
  configureAuthSessionHandlers: vi.fn(),
  setSessionAccessToken: vi.fn(),
}))

const refreshAccessTokenMock = vi.mocked(refreshAccessToken)
const configureAuthSessionHandlersMock = vi.mocked(configureAuthSessionHandlers)
const setSessionAccessTokenMock = vi.mocked(setSessionAccessToken)

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    refreshAccessTokenMock.mockResolvedValue(null)
    loginMutateAsync.mockResolvedValue({
      accessToken: "token",
      user: {
        id: 7,
        username: "tester",
        email: "tester@example.com",
        isAdmin: false,
      },
    })
  })

  it("sends guest cart items with login requests", async () => {
    localStorage.setItem(
      "greenherb-cart",
      JSON.stringify({
        items: [
          {
            id: "1",
            quantity: 2,
            product: { id: "1" },
          },
          {
            id: "1",
            quantity: 3,
            product: { id: "1" },
          },
          {
            id: "5",
            quantity: 1,
            product: { id: "5" },
          },
        ],
        timestamp: Date.now(),
      }),
    )

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({
        identifier: "tester",
        password: "strong-password",
      })
    })

    expect(loginMutateAsync).toHaveBeenCalledWith({
      identifier: "tester",
      password: "strong-password",
      cartItems: [
        { productId: 1, quantity: 5 },
        { productId: 5, quantity: 1 },
      ],
    })
    expect(setSessionAccessTokenMock).toHaveBeenCalled()
    expect(configureAuthSessionHandlersMock).toHaveBeenCalled()
  })

  it("keeps the authenticated session visible when bootstrapping completes", async () => {
    let bootstrapPayload:
      | {
          onAuthenticated: (payload: {
            accessToken: string
            user: {
              id: number
              username: string
              email: string
              isAdmin: boolean
            }
          }) => void
          onBootstrappingChange: (value: boolean) => void
        }
      | undefined

    useAuthBootstrapMock.mockImplementation((payload) => {
      bootstrapPayload = payload as typeof bootstrapPayload
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)

    await act(async () => {
      bootstrapPayload?.onAuthenticated({
        accessToken: "boot-token",
        user: {
          id: 11,
          username: "boot-user",
          email: "boot@example.com",
          isAdmin: false,
        },
      })
      bootstrapPayload?.onBootstrappingChange(false)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoggingOut).toBe(false)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.email).toBe("boot@example.com")
    expect(result.current.accessToken).toBe("boot-token")
  })
})
