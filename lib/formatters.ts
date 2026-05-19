export function formatDate(value: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function formatOptionalDate(
  value: string | null,
  locale = "en-US",
  fallback = "Unavailable",
) {
  return value ? formatDate(value, locale) : fallback
}

export function formatCurrency(
  amount: number,
  currency: string,
  locale = "en-US",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)
}
