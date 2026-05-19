"use client"

import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthBootstrap } from "@/hooks/auth/useAuthBootstrap"
import { refreshAccessToken } from "@/services/api/client"

vi.mock("@/services/api/client", () => ({
  refreshAccessToken: vi.fn(),
}))

const refreshAccessTokenMock = vi.mocked(refreshAccessToken)

describe("useAuthBootstrap", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not refresh while logging out", () => {
    const onBootstrappingChange = vi.fn()
    const onAuthenticated = vi.fn()
    const onUnauthenticated = vi.fn()

    renderHook(() =>
      useAuthBootstrap({
        accessToken: null,
        isLoggingOut: true,
        onBootstrappingChange,
        onAuthenticated,
        onUnauthenticated,
      }),
    )

    expect(onBootstrappingChange).toHaveBeenCalledWith(false)
    expect(refreshAccessTokenMock).not.toHaveBeenCalled()
    expect(onAuthenticated).not.toHaveBeenCalled()
    expect(onUnauthenticated).not.toHaveBeenCalled()
  })

  it("does not refresh when an access token already exists", () => {
    const onBootstrappingChange = vi.fn()

    renderHook(() =>
      useAuthBootstrap({
        accessToken: "token",
        isLoggingOut: false,
        onBootstrappingChange,
        onAuthenticated: vi.fn(),
        onUnauthenticated: vi.fn(),
      }),
    )

    expect(onBootstrappingChange).toHaveBeenCalledWith(false)
    expect(refreshAccessTokenMock).not.toHaveBeenCalled()
  })

  it("hydrates auth state when refresh succeeds", async () => {
    const onBootstrappingChange = vi.fn()
    const onAuthenticated = vi.fn()
    const onUnauthenticated = vi.fn()

    refreshAccessTokenMock.mockResolvedValue({
      accessToken: "fresh-token",
      user: {
        id: 1,
        username: "greenherb",
        email: "user@example.com",
        isAdmin: false,
      },
    })

    renderHook(() =>
      useAuthBootstrap({
        accessToken: null,
        isLoggingOut: false,
        onBootstrappingChange,
        onAuthenticated,
        onUnauthenticated,
      }),
    )

    expect(onBootstrappingChange).toHaveBeenCalledWith(true)

    await waitFor(() => {
      expect(onAuthenticated).toHaveBeenCalledWith({
        accessToken: "fresh-token",
        user: {
          id: 1,
          username: "greenherb",
          email: "user@example.com",
          isAdmin: false,
        },
      })
    })

    expect(onUnauthenticated).not.toHaveBeenCalled()
    expect(onBootstrappingChange).toHaveBeenLastCalledWith(false)
  })

  it("clears auth state when refresh fails", async () => {
    const onBootstrappingChange = vi.fn()
    const onAuthenticated = vi.fn()
    const onUnauthenticated = vi.fn()

    refreshAccessTokenMock.mockResolvedValue(null)

    renderHook(() =>
      useAuthBootstrap({
        accessToken: null,
        isLoggingOut: false,
        onBootstrappingChange,
        onAuthenticated,
        onUnauthenticated,
      }),
    )

    await waitFor(() => {
      expect(onUnauthenticated).toHaveBeenCalledTimes(1)
    })

    expect(onAuthenticated).not.toHaveBeenCalled()
    expect(onBootstrappingChange).toHaveBeenCalledWith(true)
    expect(onBootstrappingChange).toHaveBeenLastCalledWith(false)
  })
})
