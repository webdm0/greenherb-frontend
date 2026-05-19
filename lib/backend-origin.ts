const DEFAULT_DEV_BACKEND_ORIGIN = "http://localhost:5187"

function normalizeOrigin(value: string) {
  return value.replace(/\/+$/, "")
}

export function getBackendOrigin() {
  const rawBackendOrigin = process.env.BACKEND_ORIGIN?.trim()

  if (rawBackendOrigin) {
    return normalizeOrigin(rawBackendOrigin)
  }

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_DEV_BACKEND_ORIGIN
  }

  throw new Error("BACKEND_ORIGIN is required in production.")
}
