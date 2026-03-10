import type { MetaItem, MetaPost } from '../types'
import type { Link } from '@content/stores/meta'

/**
 * Get the correct title, resolving shortTitle if available
 */
export function getTitle (item: { title: string, shortTitle?: string }) {
  return item.shortTitle ?? item.title
}

/**
 * Get the correct path, resolving permalink if available
 */
export function getPath (item?: { _path?: string, path?: string, permalink?: string }) {
  return item?.permalink ?? item?.path ?? item?._path
}

/**
 * Take a path and slice it to a maximum depth
 */
function slicePath (path: string, maxDepth = 0) {
  if (maxDepth > 0) {
    return path.split('/').slice(0, maxDepth + 1).join('/').replace(/\/?$/, '/')
  }
  return path
}

/**
 * Get parent path by removing last segment
 */
export function getParentPath (path: string, maxDepth = 0) {
  const parentPath = path.replace(/[^/]+\/?$/, '')
  const slicedPath = slicePath(path, maxDepth)
  return slicedPath.length < parentPath.length
    ? slicedPath
    : parentPath
}

/**
 * Ensure the path contains a trailing slash
 */
export function normalizePath (path: string) {
  return path.replace(/\/*$/, '/')
}

/**
 * Ancestor items from the root to the current page
 */
export function getMetaParents (items: MetaItem[], path: string, fallbackTitle = '404'): Link[] {
  // variables
  const parents: Link[] = [{ path: '/', title: 'Home' }]
  let currentPath = '/'

  // resolve any permalinks
  const candidatePath = items
    .find(item => getPath(item) === path)
    ?.path ?? path

  // build segments
  const segments = candidatePath.split('/').filter(Boolean)
  for (const segment of segments) {
    // variables
    currentPath += segment + '/'
    const item = items.find(p => p.path === currentPath)

    // page found
    if (item) {
      parents.push({
        path: item.path,
        title: (('shortTitle' in item) && item.shortTitle) || item.title,
        description: item.description,
      })
    }

    // 404
    else {
      return [
        parents[0] as Link,
        { title: fallbackTitle } as Link,
      ]
    }
  }

  // return
  return parents
}

/**
 * Sibling items in the same folder level as the current page
 */
export function getMetaSiblings (items: MetaPost[], parentPath: string): MetaItem[] {
  return items.filter(p => getParentPath(p.path) === parentPath)
}

/**
 * Related items before and after the current page
 */
export function getMetaSurround (items: MetaItem[], path: string) {
  const index = items.findIndex(p => getPath(p) === path)
  if (index > -1) {
    return {
      prev: items[index - 1],
      next: items[index + 1],
    }
  }
  return { prev: undefined, next: undefined }
}
