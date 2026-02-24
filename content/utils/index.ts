export * from './media'
export * from './meta'

/**
 * Slugify a path by replacing non-word characters with dashes and lowercasing
 */
export function slugify (path: string) {
  return path
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
