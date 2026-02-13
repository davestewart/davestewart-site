import type { MetaItem, TocLink } from '../types'

/**
 * Convert MetaItems to TocLinks
 */
export function metaItemsToToc (items: MetaItem[]) {
  function makeLinks (items: MetaItem[], depth: number = 1): TocLink[] {
    if (depth > searchDepth) {
      searchDepth = depth
    }
    return items.map((item) => {
      const link: TocLink = {
        id: item.path.replace(/^\/|\/$/g, '').replace(/\//g, '-'),
        depth,
        text: item.title || '',
      }

      if (('items' in item) && item.items.length > 0 && item.items.some(item => item.type === 'folder')) {
        link.children = makeLinks(item.items, depth + 1)
      }

      return link
    })
  }

  let searchDepth = 2
  const links = makeLinks(items, 2)

  return {
    depth: searchDepth,
    searchDepth,
    title: 'On this page',
    links,
  }
}
