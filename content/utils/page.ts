import type { MetaPost } from '../types'

/**
 * Get the correct title, resolving shortTitle if available
 */
export function getTitle (page: MetaPost) {
  return page.shortTitle || page.title
}

/**
 * Get the correct path, resolving permalink if available
 */
export function getPath (page: MetaPost) {
  return page.permalink || page.path
}

/**
 * Ensure the path contains a trailing slash
 */
export function normalizePath (path: string) {
  return path.replace(/\/*$/, '/')
}

/**
 * Get parent path by removing last segment
 */
export function getParentPath (path: string) {
  return path.replace(/[^/]+\/?$/, '')
}
