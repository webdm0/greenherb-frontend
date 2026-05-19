import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const AUTH_PAGES = new Set(["/login", "/register"])
const AUTH_REDIRECT_PATH = "/"
const LOGIN_REDIRECT_PATH = "/login"
const REFRESH_COOKIE = "refreshToken"
const SESSION_HINT_COOKIE = "__session_hint"
const SESSION_VALIDATE_PATH = "/api/auth/session"
const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN?.trim().replace(/\/$/, "") ?? ""
const SESSION_HINT_KEY = process.env.SESSION_HINT_KEY
const SESSION_HINT_ISS = process.env.SESSION_HINT_ISS
const SESSION_HINT_AUD = process.env.SESSION_HINT_AUD
const SESSION_HINT_EXPECTED_VERSION = "1"
const SESSION_HINT_CLOCK_SKEW_SECONDS = 5

type SessionState = "valid" | "invalid" | "unknown"
type SessionValidationResult = {
  state: SessionState
  setCookie: string | null
}

type SessionHintPayload = {
  sid?: unknown
  ver?: unknown
  iat?: unknown
  exp?: unknown
  iss?: unknown
  aud?: unknown
}

let sessionHintCryptoKeyPromise: Promise<CryptoKey> | null = null

const isProtectedPath = (pathname: string) =>
  pathname === "/checkout" ||
  pathname.startsWith("/checkout/") ||
  pathname === "/orders" ||
  pathname.startsWith("/orders/")

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  return value
}

const decodeBase64Url = (value: string): Uint8Array => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const paddingLength = (4 - (base64.length % 4)) % 4
  const padded = `${base64}${"=".repeat(paddingLength)}`
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

const toArrayBuffer = (value: Uint8Array) =>
  value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength,
  ) as ArrayBuffer

const decodeJsonPart = <T>(value: string): T | null => {
  try {
    const bytes = decodeBase64Url(value)
    const json = new TextDecoder().decode(bytes)
    const parsed: unknown = JSON.parse(json)

    if (!parsed || typeof parsed !== "object") {
      return null
    }

    return parsed as T
  } catch {
    return null
  }
}

const getSessionHintCryptoKey = () => {
  if (!SESSION_HINT_KEY) {
    return null
  }

  if (!sessionHintCryptoKeyPromise) {
    const keyBytes = new TextEncoder().encode(SESSION_HINT_KEY)
    sessionHintCryptoKeyPromise = crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    )
  }

  return sessionHintCryptoKeyPromise
}

const isValidAudience = (aud: unknown) => {
  if (!SESSION_HINT_AUD) {
    return true
  }

  if (typeof aud === "string") {
    return aud === SESSION_HINT_AUD
  }

  if (Array.isArray(aud)) {
    return aud.includes(SESSION_HINT_AUD)
  }

  return false
}

const validateSessionHint = async (rawHint: string | undefined) => {
  if (!rawHint) {
    return false
  }

  const cryptoKeyPromise = getSessionHintCryptoKey()
  if (!cryptoKeyPromise) {
    return false
  }

  const parts = rawHint.split(".")
  if (parts.length !== 3) {
    return false
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return false
  }

  const header = decodeJsonPart<Record<string, unknown>>(encodedHeader)
  const payload = decodeJsonPart<SessionHintPayload>(encodedPayload)
  if (!header || !payload) {
    return false
  }

  if (header.alg !== "HS256") {
    return false
  }

  let isSignatureValid = false

  try {
    const signature = toArrayBuffer(decodeBase64Url(encodedSignature))
    const data = toArrayBuffer(
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    )
    const key = await cryptoKeyPromise
    isSignatureValid = await crypto.subtle.verify("HMAC", key, signature, data)
  } catch {
    return false
  }

  if (!isSignatureValid) {
    return false
  }

  const sid = payload.sid
  const ver = payload.ver
  const iat = toFiniteNumber(payload.iat)
  const exp = toFiniteNumber(payload.exp)
  const nowSeconds = Math.floor(Date.now() / 1000)

  if (typeof sid !== "string" || sid.length === 0) {
    return false
  }

  if (String(ver) !== SESSION_HINT_EXPECTED_VERSION) {
    return false
  }

  if (iat == null || exp == null) {
    return false
  }

  if (iat > nowSeconds + SESSION_HINT_CLOCK_SKEW_SECONDS) {
    return false
  }

  if (exp <= nowSeconds - SESSION_HINT_CLOCK_SKEW_SECONDS) {
    return false
  }

  if (SESSION_HINT_ISS && payload.iss !== SESSION_HINT_ISS) {
    return false
  }

  if (!isValidAudience(payload.aud)) {
    return false
  }

  return true
}

const withSessionSetCookie = (
  response: NextResponse,
  sessionValidation: SessionValidationResult,
) => {
  if (!sessionValidation.setCookie) {
    return response
  }

  response.headers.append("set-cookie", sessionValidation.setCookie)
  return response
}

const redirectTo = (request: NextRequest, pathname: string) => {
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = pathname
  redirectUrl.search = ""
  return NextResponse.redirect(redirectUrl)
}

const validateRefreshSession = async (
  request: NextRequest,
): Promise<SessionValidationResult> => {
  if (!BACKEND_ORIGIN) {
    return { state: "unknown", setCookie: null }
  }

  try {
    const sessionUrl = new URL(SESSION_VALIDATE_PATH, BACKEND_ORIGIN)
    const cookieHeader = request.headers.get("cookie")

    const response = await fetch(sessionUrl.toString(), {
      method: "GET",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
      redirect: "manual",
    })

    const setCookie = response.headers.get("set-cookie")

    if (response.status === 401) {
      return { state: "invalid", setCookie }
    }

    if (response.ok) {
      return { state: "valid", setCookie }
    }

    return { state: "unknown", setCookie }
  } catch {
    return { state: "unknown", setCookie: null }
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const routeAccess = AUTH_PAGES.has(pathname)
    ? "guest-only"
    : isProtectedPath(pathname)
      ? "auth-only"
      : null

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  const sessionHint = request.cookies.get(SESSION_HINT_COOKIE)?.value

  if (!routeAccess) {
    return NextResponse.next()
  }

  if (!refreshToken) {
    return routeAccess === "auth-only"
      ? redirectTo(request, LOGIN_REDIRECT_PATH)
      : NextResponse.next()
  }

  const hasValidSessionHint = await validateSessionHint(sessionHint)
  if (hasValidSessionHint) {
    return routeAccess === "guest-only"
      ? redirectTo(request, AUTH_REDIRECT_PATH)
      : NextResponse.next()
  }

  const sessionValidation = await validateRefreshSession(request)

  if (sessionValidation.state === "invalid") {
    const response =
      routeAccess === "auth-only"
        ? redirectTo(request, LOGIN_REDIRECT_PATH)
        : NextResponse.next()
    response.cookies.delete(REFRESH_COOKIE)
    response.cookies.delete(SESSION_HINT_COOKIE)
    return withSessionSetCookie(response, sessionValidation)
  }

  if (sessionValidation.state === "valid") {
    return withSessionSetCookie(
      routeAccess === "guest-only"
        ? redirectTo(request, AUTH_REDIRECT_PATH)
        : NextResponse.next(),
      sessionValidation,
    )
  }

  if (routeAccess === "auth-only") {
    return redirectTo(request, LOGIN_REDIRECT_PATH)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register", "/checkout/:path*", "/orders/:path*"],
}
