import { computed, ref } from 'vue'
import { type ContentItem, type ContentPage, getItems } from './content'

// ---------------------------------------------------------------------------------------------------------------------
// types
// ---------------------------------------------------------------------------------------------------------------------

interface TagGroup {
  title: string
  tags: string[]
}

interface Tag {
  text: string
  count: number
}

export interface SearchQuery {
  path: string
  text: string
  tags: string[]
  textOp: 'and' | 'or'
  tagsOp: 'and' | 'or'
  tagsFilter: 'off' | 'list' | 'groups'
  group: 'path' | 'date'
  sort: 'path' | 'date'
  random: boolean
  format: 'text' | 'image'
  year: string
}

export interface SearchOptions {
  paths?: string[]
  excludeDrafts?: boolean
  hasThumbnail?: boolean
  limit?: number
}

// ---------------------------------------------------------------------------------------------------------------------
// store
// ---------------------------------------------------------------------------------------------------------------------

export const useSearchStore = defineStore('search', () => {
  const tagGroups = ref<TagGroup[]>([])

  const tagList = computed(() => {
    return tagGroups.value
      .map(group => group.tags)
      .flat()
      .sort()
  })

  // initializers
  async function initServer () {
    tagGroups.value = await queryTags()
  }

  function initClient () {
    // nothing, for now
  }

  return {
    // values
    tagGroups,
    tagList,

    // initializers
    initServer,
    initClient,

    // search functions
    searchContent,
    makeTextFilter,
    makeTagsFilter,
    makeDateFilter,
    groupBy,
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// constants
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Default searchable paths across the site
 */
export const DEFAULT_SEARCH_PATHS = [
  '/work/',
  '/products/',
  '/projects/',
  '/archive/',
  '/blog/',
]

// ---------------------------------------------------------------------------------------------------------------------
// query utilities
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Create a default search query
 */
export function makeDefaultQuery (): SearchQuery {
  return {
    text: '',
    textOp: 'and',
    tags: [],
    tagsOp: 'and',
    group: 'path',
    format: 'text',
    tagsFilter: 'off',
    path: '',
    year: '',
    sort: 'date',
    random: false,
  }
}

/**
 * Parse query from URL query params or hash
 * Supports both route.query and URLSearchParams format
 */
export function parseQuery (input: Record<string, any> | string): Partial<SearchQuery> {
  let params: Record<string, any>

  // Parse from string (hash or query string)
  if (typeof input === 'string') {
    const urlParams = new URLSearchParams(input.startsWith('#') ? input.slice(1) : input)
    params = {}

    // Convert URLSearchParams to object, handling multiple values
    for (const [key, value] of urlParams.entries()) {
      if (params[key]) {
        // If key already exists, convert to array
        params[key] = Array.isArray(params[key]) ? [...params[key], value] : [params[key], value]
      }
      else {
        params[key] = value
      }
    }
  }
  else {
    params = input
  }

  const query: Partial<SearchQuery> = {}

  // Parse text
  if (params.text) {
    query.text = params.text
  }

  // Parse tags (can be array or single value)
  if (params.tags) {
    query.tags = Array.isArray(params.tags) ? params.tags : [params.tags]
  }

  // Parse path
  if (params.path) {
    query.path = params.path
  }

  // Parse year
  if (params.year) {
    query.year = params.year
  }

  // Parse sort
  if (params.sort) {
    query.sort = params.sort
  }

  // Parse other query fields
  if (params.tagsFilter) query.tagsFilter = params.tagsFilter
  if (params.textOp) query.textOp = params.textOp
  if (params.tagsOp) query.tagsOp = params.tagsOp
  if (params.group) query.group = params.group
  if (params.format) query.format = params.format

  return query
}

/**
 * Clean query by removing default values
 */
export function cleanQuery (query: SearchQuery): Record<string, any> {
  const cleaned: Record<string, any> = {}
  const defaults = makeDefaultQuery()

  for (const key in query) {
    const queryKey = key as keyof SearchQuery
    if (String(query[queryKey]) !== String(defaults[queryKey])) {
      cleaned[key] = query[queryKey]
    }
  }

  return cleaned
}

// ---------------------------------------------------------------------------------------------------------------------
// search functionality
// ---------------------------------------------------------------------------------------------------------------------

export function searchFeatured (query: Partial<SearchQuery>, random = false) {
  return searchContent(
    { ...query, sort: 'date', random },
    {
      paths: ['/products/', '/projects/', '/work/', '/blog/'],
      excludeDrafts: true,
      hasThumbnail: true,
      limit: 6,
    },
  )
}

/**
 * Search and filter content based on query parameters
 */
export function searchContent (query: Partial<SearchQuery>, options: SearchOptions = {}): ContentItem[] {
  const {
    paths = [],
    excludeDrafts = true,
    hasThumbnail = false,
    limit,
  } = options

  // Get all pages
  let items = getItems('/')

  // Filter drafts
  if (excludeDrafts) {
    items = items.filter((item) => {
      return item.type === 'folder' || !('draft' in item) || !(item as any).draft
    })
  }

  // Filter by path - use query.path if specified, otherwise use options.paths
  const pathsToSearch = query.path ? [query.path] : paths
  if (pathsToSearch.length > 0) {
    items = items.filter((item) => {
      return pathsToSearch.some(p => item.path === p || item.path.startsWith(p))
    })
  }

  // Filter by thumbnail
  if (hasThumbnail) {
    items = items.filter((item) => {
      return item.type === 'post' && item.media?.thumbnail
    })
  }

  // Apply query filters
  if (query.tags && query.tags.length > 0) {
    items = items.filter(makeTagsFilter(query.tags, query.tagsOp === 'or'))
  }

  if (query.text) {
    items = items.filter(makeTextFilter(query.text, query.textOp === 'or'))
  }

  if (query.year) {
    items = items.filter(makeDateFilter(query.year))
  }

  if (query.random) {
    items = items.slice().sort(() => Math.random() - 0.5)
  }

  // Apply limit
  if (limit) {
    items = items.slice(0, limit)
  }

  // Sort by date or random
  if (query.sort === 'date') {
    items.sort((a, b) => {
      const da = a.type === 'post' && a.date ? new Date(a.date).getTime() : 0
      const db = b.type === 'post' && b.date ? new Date(b.date).getTime() : 0
      return db - da
    })
  }
  return items
}

/**
 * Create a text filter function
 */
export function makeTextFilter (text: string, useOr = true) {
  text = text.trim()
  if (text === '') {
    return () => true
  }
  const matches = text.toLowerCase().match(/\S+/g) || []
  const predicates = matches.map((t) => {
    return t.startsWith('/')
      ? (item: ContentItem) => item.path && item.path.includes(t)
      : (item: ContentItem) => {
        return ((item.title || '') + (item.description || '')).toLowerCase().includes(t)
      }
  })
  return useOr
    ? (item: ContentItem) => predicates.some(fn => fn(item))
    : (item: ContentItem) => predicates.every(fn => fn(item))
}

/**
 * Create a tags filter function
 */
export function makeTagsFilter (tags: string[], useOr = false) {
  const orQuery = (page: ContentPage) => (page.tags ?? []).some((tag: string) => tags.includes(tag))
  const andQuery = (page: ContentPage) => {
    const pageTags = (page.tags ?? [])
    return tags.every((tag: string) => pageTags.includes(tag))
  }
  const query = useOr ? orQuery : andQuery
  return (item: ContentItem) => {
    return item.type === 'folder' || query(item)
  }
}

/**
 * Create a date filter function
 */
export function makeDateFilter (year: string) {
  return (item: ContentItem) => {
    if (item.type === 'folder') {
      return true
    }
    const pageYear = item.date
      ? item.date.substring(0, 4)
      : ''
    return pageYear === year
  }
}

/**
 * Group items by a key
 */
export function groupBy (array: ContentItem[], key: keyof ContentPage, iteratee?: (val: string) => string) {
  const result: Record<string, ContentItem[]> = {}
  array.forEach((item) => {
    const itemValue = item[key]
    const val = (iteratee && itemValue
      ? iteratee(itemValue as string)
      : itemValue) ?? 'No Date'
    if (!result[val]) result[val] = []
    result[val].push(item)
  })
  return Object.keys(result).sort().reverse().map(k => ({ title: k, items: result[k] }))
}

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------------------------------------------------
// deprecated
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Sorted list of all tags used in posts
 */
export async function usePostsTags () {
  const posts = await getPosts()

  const set = new Set<string>()
  posts.forEach((post: any) => {
    const tags = post.tags || []
    tags.forEach((tag: string) => set.add(tag))
  })

  const tags = Array.from(set).sort()

  return {
    tags: computed(() => tags || []),
  }
}

/**
 * Hash of all tags and their counts
 */
export async function useTagCounts () {
  const items = await getPosts()

  const counts: Record<string, number> = {}
  items.forEach((page: any) => {
    const tags = page.tags || []
    tags.forEach((tag: string) => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })

  return {
    counts: computed(() => counts.value || {}),
  }
}
