import { isDev } from '~/utils/config'
import type { MetaFolder, MetaItem, MetaItemRaw, MetaPost, PageWithStatus, StatusType, TagGroup } from '../types'

export function isPublished (page: PageWithStatus): boolean {
  const unpublishedStatuses = ['draft', 'hidden', 'scheduled'] as readonly StatusType[]
  return !unpublishedStatuses.includes(page.status!)
}

export function isListed (page: PageWithStatus): boolean {
  return page.status !== 'unlisted' || isDev
}

export function isVisible (page: PageWithStatus): boolean {
  return isPublished(page) && isListed(page)
}

export function isPreview (page: PageWithStatus): boolean {
  return page?.status === 'preview'
}

/**
 * Hierarchical sort that respects parent ordering at each level
 *
 * 1. Check explicit order property at each path level
 * 2. Fall back to date ordering within same directory
 */
function sortHierarchical (a: MetaItemRaw, b: MetaItemRaw, orderMap: Map<string, number>) {
  const aPath = a._path || ''
  const bPath = b._path || ''

  // Split paths into segments
  const aParts = aPath.split('/').filter(Boolean)
  const bParts = bPath.split('/').filter(Boolean)

  // Compare each level of the hierarchy where both paths exist
  const minDepth = Math.min(aParts.length, bParts.length)
  for (let i = 0; i < minDepth; i++) {
    const aPathAtLevel = '/' + aParts.slice(0, i + 1).join('/') + '/'
    const bPathAtLevel = '/' + bParts.slice(0, i + 1).join('/') + '/'

    // If paths are the same at this level, continue to next level
    if (aPathAtLevel === bPathAtLevel) {
      continue
    }

    // Paths diverge at this level - compare them based on order
    const aOrder = orderMap.get(aPathAtLevel)
    const bOrder = orderMap.get(bPathAtLevel)

    // If both have explicit order, use it
    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder
    }
    if (aOrder !== undefined) return -1
    if (bOrder !== undefined) return 1

    // No explicit order - fall back to date comparison (newer first)
    if (a.date && b.date) {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      if (dateA !== dateB) {
        return dateB - dateA
      }
    }

    // Final fallback: alphabetical by path segment
    return aPathAtLevel.localeCompare(bPathAtLevel)
  }

  // One path is a parent of the other - parent comes first
  if (aParts.length !== bParts.length) {
    return aParts.length - bParts.length
  }

  // Paths are identical (shouldn't happen)
  return 0
}

/**
 * Skip undefined and empty values from an object
 *
 * @param input
 */
function clean<T extends Record<string, any>> (input: T): Partial<T> {
  const keys = Object.keys(input) as (keyof T)[]
  const output: Partial<T> = {}
  for (const key of keys) {
    const value = input[key]
    if (!(value === undefined || value === null || value === '')) {
      output[key] = input[key]
    }
  }
  return output as Partial<T>
}

// ---------------------------------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Makes the required query to the api via queryContent
 */
export async function queryItems (mode: 'development' | 'production' = 'production'): Promise<(MetaItem[])> {
  // initial query
  const items = await queryContent()
    .only([
      '_path',
      'permalink',
      'type',
      'title',
      'shortTitle',
      'description',
      'order',
      'date',
      'status',
      'tags',
      'media',
      'github',
    ])
    .where({
      _extension: 'md',
    })
    .find() satisfies MetaItemRaw[]

  // build order map for hierarchical sorting
  const orderMap = new Map<string, number>()
  items.forEach((page) => {
    if (page.order !== undefined && page._path) {
      orderMap.set(page._path, page.order)
    }
  })

  // process final items array
  return items
    // filter out drafts and unlisted items
    .filter((item) => {
      // const mode = process.env.NODE_ENV || 'development'
      if (mode === 'production') {
        if (item.type === 'post') {
          return item.date && (!item.status || !['draft', 'unlisted', 'hidden'].includes(item.status))
        }
      }
      return true
    })

    // sort by path and order
    .sort((a, b) => sortHierarchical(a, b, orderMap))

    // convert raw items to concrete items
    .map((item) => {
      if (item.type === 'folder') {
        return clean({
          path: item._path!,
          type: item.type,
          title: item.title ?? '',
          description: item.description ?? '',
          items: [],
        }) as MetaFolder
      }
      return clean({
        path: item._path!,
        type: item.type,
        permalink: item.permalink,
        title: item.title ?? '',
        shortTitle: item.shortTitle,
        description: item.description ?? '',
        media: {
          thumbnail: item.media?.thumbnail,
        },
        github: item.github,
        date: item.date,
        status: item.status,
        tags: item.tags,
      }) as MetaPost
    })
}

/**
 * Query Nuxt Content for tags.json
 */
export async function queryTags (): Promise<TagGroup[]> {
  // grab raw data
  const data = await queryContent('tags')
    .where({ _extension: 'yaml' })
    .findOne()
    .catch((err) => {
      console.error('[queryTags] Error:', err)
      return {} as Record<string, string[]>
    })

  // grab tag data only
  const keys = Object.keys(data)
  const tags = keys.reduce((acc, key) => {
    if (/^[A-Z]/.test(key)) {
      acc[key] = data[key]
    }
    return acc
  }, {} as Record<string, string[]>)

  // return tags with titles, etc
  return Object.entries(tags).map(([title, tags]) => ({ title, tags }))
}
