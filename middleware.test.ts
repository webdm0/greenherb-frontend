import { afterEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const ORIGINAL_ENV = { ...process.env }

const toBase64Url = (value: string | Uint8Array) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")

const createSessionHintToken = () => {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = toBase64Url(
    JSON.stringify({
      sid: "session-1",
      ver: "1",
      iat: nowSeconds,
      exp: nowSeconds + 60,
    }),
  )

  return `${header}.${payload}.${toBase64Url("signature")}`
}

const createRequest = (path: string, cookieHeader?: string) =>
  new NextRequest(`https://frontend.example.com${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  })

const importProxy = async (env?: {
  BACKEND_ORIGIN?: string
  SESSION_HINT_KEY?: string
}) => {
  vi.resetModules()

  delete process.env.BACKEND_ORIGIN
  delete process.env.SESSION_HINT_KEY
  delete process.env.SESSION_HINT_ISS
  delete process.env.SESSION_HINT_AUD

  if (env?.BACKEND_ORIGIN) {
    process.env.BACKEND_ORIGIN = env.BACKEND_ORIGIN
  }

  if (env?.SESSION_HINT_KEY) {
    process.env.SESSION_HINT_KEY = env.SESSION_HINT_KEY
  }

  return import("./proxy")
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()

  delete process.env.BACKEND_ORIGIN
  delete process.env.SESSION_HINT_KEY
  delete process.env.SESSION_HINT_ISS
  delete process.env.SESSION_HINT_AUD
  Object.assign(process.env, ORIGINAL_ENV)
})

describe("proxy", () => {
  it("redirects authenticated users away from auth pages when session hint is valid", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    vi.spyOn(crypto.subtle, "verify").mockResolvedValue(true)

    const { proxy } = await importProxy({
      SESSION_HINT_KEY: "test-session-hint-key",
    })

    const response = await proxy(
      createRequest(
        "/login",
        `refreshToken=opaque-refresh; __session_hint=${createSessionHintToken()}`,
      ),
    )

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe("https://frontend.example.com/")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("allows auth pages through when refresh cookie is missing", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { proxy } = await importProxy()
    const response = await proxy(createRequest("/register"))

    expect(response.status).toBe(200)
    expect(response.headers.get("x-middleware-next")).toBe("1")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("redirects guests away from protected checkout pages", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { proxy } = await importProxy()
    const response = await proxy(createRequest("/checkout"))

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "https://frontend.example.com/login",
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("validates the backend session and forwards set-cookie on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 200,
        headers: {
          "set-cookie": "__session_hint=refreshed; Path=/; HttpOnly",
        },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { proxy } = await importProxy({
      BACKEND_ORIGIN: "https://api.example.com/",
      SESSION_HINT_KEY: "test-session-hint-key",
    })

    const cookieHeader = "refreshToken=opaque-refresh; __session_hint=invalid"
    const response = await proxy(createRequest("/login", cookieHeader))

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/auth/session",
      expect.objectContaining({
        method: "GET",
        headers: { cookie: cookieHeader },
        cache: "no-store",
        redirect: "manual",
      }),
    )
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe("https://frontend.example.com/")
    expect(response.headers.get("set-cookie")).toContain(
      "__session_hint=refreshed; Path=/; HttpOnly",
    )
  })

  it("clears auth cookies and allows the page when backend session validation fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }))
    vi.stubGlobal("fetch", fetchMock)

    const { proxy } = await importProxy({
      BACKEND_ORIGIN: "https://api.example.com",
      SESSION_HINT_KEY: "test-session-hint-key",
    })

    const response = await proxy(
      createRequest(
        "/login",
        "refreshToken=opaque-refresh; __session_hint=invalid",
      ),
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("x-middleware-next")).toBe("1")
    expect(response.headers.get("set-cookie")).toContain("refreshToken=")
    expect(response.headers.get("set-cookie")).toContain("__session_hint=")
  })

  it("allows protected checkout pages through when backend session validation succeeds", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 200,
        headers: {
          "set-cookie": "__session_hint=refreshed; Path=/; HttpOnly",
        },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { proxy } = await importProxy({
      BACKEND_ORIGIN: "https://api.example.com/",
      SESSION_HINT_KEY: "test-session-hint-key",
    })

    const cookieHeader = "refreshToken=opaque-refresh; __session_hint=invalid"
    const response = await proxy(createRequest("/checkout", cookieHeader))

    expect(response.status).toBe(200)
    expect(response.headers.get("x-middleware-next")).toBe("1")
    expect(response.headers.get("set-cookie")).toContain(
      "__session_hint=refreshed; Path=/; HttpOnly",
    )
  })

  it("redirects protected checkout pages to login and clears auth cookies when backend session validation fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }))
    vi.stubGlobal("fetch", fetchMock)

    const { proxy } = await importProxy({
      BACKEND_ORIGIN: "https://api.example.com",
      SESSION_HINT_KEY: "test-session-hint-key",
    })

    const response = await proxy(
      createRequest(
        "/checkout",
        "refreshToken=opaque-refresh; __session_hint=invalid",
      ),
    )

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "https://frontend.example.com/login",
    )
    expect(response.headers.get("set-cookie")).toContain("refreshToken=")
    expect(response.headers.get("set-cookie")).toContain("__session_hint=")
  })

  it("redirects guests away from protected orders pages", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { proxy } = await importProxy()
    const response = await proxy(createRequest("/orders"))

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "https://frontend.example.com/login",
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("redirects guests away from nested protected checkout pages", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { proxy } = await importProxy()
    const response = await proxy(createRequest("/checkout/success"))

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "https://frontend.example.com/login",
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
