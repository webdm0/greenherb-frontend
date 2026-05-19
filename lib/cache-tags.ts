export const cacheTags = {
  products: "products",
} as const

export const allowedCacheTags = Object.values(cacheTags)

export type CacheTag = (typeof allowedCacheTags)[number]

export function isAllowedCacheTag(value: string): value is CacheTag {
  return allowedCacheTags.includes(value as CacheTag)
}
