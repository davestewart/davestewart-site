export * from './media'
export * from './meta'
export * from './page'

/**
 * Slugify a path by replacing non-word characters with dashes and lowercasing
 */
export function slugify (path: string) {
  return path
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
