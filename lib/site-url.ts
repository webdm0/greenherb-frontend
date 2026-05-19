const DEFAULT_SITE_URL = "http://localhost:3000"

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "")
}

export function getSiteUrl() {
  const rawSiteUrl =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim()

  if (rawSiteUrl) {
    const normalizedUrl = normalizeSiteUrl(rawSiteUrl)
    return /^https?:\/\//i.test(normalizedUrl)
      ? normalizedUrl
      : `https://${normalizedUrl}`
  }

  return DEFAULT_SITE_URL
}
