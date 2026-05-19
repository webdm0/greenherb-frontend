import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosHeaderValue,
  type AxiosRequestConfig,
} from "axios"
import type { AuthResponse } from "@/types/auth"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type ErrorResponseData =
  | {
      errors?: unknown
      message?: unknown
      title?: unknown
      detail?: unknown
    }
  | string
  | null
  | undefined

type RetriableRequestConfig = AxiosRequestConfig & { _retry?: boolean }

type AuthSessionHandlers = {
  onRefreshSuccess?: ((session: AuthResponse) => void) | null
  onUnauthorized?: (() => void) | null
}

const API_PREFIX = "/backend"
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again."
const REFRESH_ENDPOINT = "/api/auth/refresh"
const REFRESH_TIMEOUT_MS = 10_000

const api = axios.create({
  baseURL: API_PREFIX,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: API_PREFIX,
  withCredentials: true,
  timeout: REFRESH_TIMEOUT_MS,
})

let sessionAccessToken: string | null = null
let refreshInFlight: Promise<AuthResponse> | null = null
let authSessionHandlers: AuthSessionHandlers = {}

const isRefreshRequest = (config?: AxiosRequestConfig) =>
  Boolean(config?.url?.includes(REFRESH_ENDPOINT))

const toAxiosHeaders = (headers?: AxiosRequestConfig["headers"]) => {
  if (headers instanceof AxiosHeaders) {
    return headers
  }

  const normalized = new AxiosHeaders()
  if (!headers) {
    return normalized
  }

  for (const [name, value] of Object.entries(headers)) {
    if (value == null) {
      continue
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      if (value instanceof AxiosHeaders) {
        normalized.set(name, value)
      }
      continue
    }

    normalized.set(name, value as AxiosHeaderValue)
  }

  return normalized
}

const hasAuthorizationHeader = (config?: AxiosRequestConfig) => {
  if (!config?.headers) {
    return false
  }

  return Boolean(toAxiosHeaders(config.headers).get("Authorization"))
}

const setAuthorizationHeader = (
  config: { headers?: AxiosRequestConfig["headers"] },
  token: string,
) => {
  const headers = toAxiosHeaders(config.headers)
  headers.set("Authorization", `Bearer ${token}`)
  config.headers = headers
}

const withoutAbortSignal = (config: RetriableRequestConfig) => {
  if (!config.signal) {
    return config
  }

  const nextConfig = { ...config }
  delete nextConfig.signal
  return nextConfig as RetriableRequestConfig
}

const findFirstString = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nestedValue = findFirstString(item)
      if (nestedValue) {
        return nestedValue
      }
    }

    return null
  }

  if (value && typeof value === "object") {
    for (const nestedValue of Object.values(value as Record<string, unknown>)) {
      const resolvedValue = findFirstString(nestedValue)
      if (resolvedValue) {
        return resolvedValue
      }
    }
  }

  return null
}

const sanitizeErrorMessage = (value: string, fallback = DEFAULT_ERROR_MESSAGE) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return fallback
  }

  const looksLikeHtml =
    trimmed.startsWith("<") || /<html|<!doctype|<body|<pre/i.test(trimmed)
  if (looksLikeHtml) {
    return fallback
  }

  const normalized = trimmed.replace(/\s+/g, " ")
  const maxLength = 240

  if (normalized.length > maxLength) {
    return `${normalized.slice(0, maxLength)}...`
  }

  return normalized
}

const getErrorMessage = (
  err: AxiosError<ErrorResponseData>,
  fallback = DEFAULT_ERROR_MESSAGE,
) => {
  const data = err.response?.data

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const validationMessage = findFirstString(data.errors)
    if (validationMessage) {
      return sanitizeErrorMessage(validationMessage, fallback)
    }

    if (typeof data.message === "string") {
      return sanitizeErrorMessage(data.message, fallback)
    }

    if (typeof data.detail === "string") {
      return sanitizeErrorMessage(data.detail, fallback)
    }

    if (typeof data.title === "string") {
      return sanitizeErrorMessage(data.title, fallback)
    }
  }

  if (typeof data === "string") {
    return sanitizeErrorMessage(data, fallback)
  }

  if (err.response?.status === 401) {
    return "Unauthorized."
  }

  return fallback
}

const handleUnauthorized = () => {
  sessionAccessToken = null
  authSessionHandlers.onUnauthorized?.()
}

const performRefreshRequest = async () => {
  const response = await refreshClient.post<AuthResponse>(REFRESH_ENDPOINT)
  const session = response.data

  if (!session?.accessToken) {
    throw new Error("Refresh response does not contain access token.")
  }

  sessionAccessToken = session.accessToken
  authSessionHandlers.onRefreshSuccess?.(session)
  return session
}

export const requestAccessTokenRefresh = async () => {
  if (!refreshInFlight) {
    refreshInFlight = performRefreshRequest().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

export function setSessionAccessToken(accessToken: string | null) {
  sessionAccessToken = accessToken
}

export function configureAuthSessionHandlers(handlers: AuthSessionHandlers) {
  authSessionHandlers = handlers
}

api.interceptors.request.use((config) => {
  if (sessionAccessToken && !isRefreshRequest(config) && !hasAuthorizationHeader(config)) {
    setAuthorizationHeader(config, sessionAccessToken)
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const originalRequest = error.config as RetriableRequestConfig | undefined
    const shouldRetryProtectedRequest =
      status === 401 &&
      Boolean(originalRequest) &&
      !isRefreshRequest(originalRequest) &&
      hasAuthorizationHeader(originalRequest)

    if (shouldRetryProtectedRequest && originalRequest) {
      if (!originalRequest._retry) {
        originalRequest._retry = true

        try {
          const session = await requestAccessTokenRefresh()
          setAuthorizationHeader(originalRequest, session.accessToken)
          return api.request(withoutAbortSignal(originalRequest))
        } catch (refreshError) {
          handleUnauthorized()
          return Promise.reject(refreshError)
        }
      }

      handleUnauthorized()
    }

    return Promise.reject(error)
  },
)

async function request<T>(
  method: Method,
  url: string,
  data?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  try {
    const response = await api.request<T>({
      method,
      url,
      data,
      signal,
    })

    return response.data
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<ErrorResponseData>
      const enrichedError = new Error(getErrorMessage(err)) as Error & {
        status?: number
        isNetworkError?: boolean
      }

      enrichedError.status = err.response?.status
      enrichedError.isNetworkError = !err.response
      throw enrichedError
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error(DEFAULT_ERROR_MESSAGE)
  }
}

export const get = <T>(url: string, signal?: AbortSignal) =>
  request<T>("GET", url, undefined, signal)

export const post = <T>(url: string, data?: unknown, signal?: AbortSignal) =>
  request<T>("POST", url, data, signal)

export const put = <T>(url: string, data: unknown, signal?: AbortSignal) =>
  request<T>("PUT", url, data, signal)

export const patch = <T>(url: string, data: unknown, signal?: AbortSignal) =>
  request<T>("PATCH", url, data, signal)

export const del = <T>(url: string, signal?: AbortSignal) =>
  request<T>("DELETE", url, undefined, signal)
