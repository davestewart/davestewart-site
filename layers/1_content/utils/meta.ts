import type { MetaFolder, MetaItem, TocLink } from '../types'

/**
 * Get the correct title, resolving shortTitle if available
 */
export function getTitle (item: MetaItem) {
  return item.type === 'post'
    ? item.shortTitle || item.title
    : item.title
}

/**
 * Get the correct path, resolving permalink if available
 */
export function getPath (item: MetaItem) {
  return item.type === 'post'
    ? item.permalink || item.path
    : item.path
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

/**
 * Convert MetaItems to TocLinks
 */
export function metaItemsToToc (items: MetaItem[]) {
  function makeLinks (items: MetaFolder[], depth: number = 1): TocLink[] {
    if (depth > searchDepth) {
      searchDepth = depth
    }
    return items.map((item) => {
      const link: TocLink = {
        id: item.slug,
        depth,
        text: item.title || '',
      }

      const folders = item.items?.filter(item => item.type === 'folder')
      if (folders?.length) {
        link.children = makeLinks(folders, depth + 1)
      }

      return link
    })
  }

  let searchDepth = 2
  const folders = items.filter(item => item.type === 'folder')
  const links = makeLinks(folders, 2)

  return {
    depth: searchDepth,
    searchDepth,
    title: 'On this page',
    links,
  }
}
