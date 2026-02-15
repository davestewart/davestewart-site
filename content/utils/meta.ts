import { slugify } from '../utils'
import type { MetaItem, TocLink } from '../types'

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
