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
  // the path from which to search from
  path?: string
  // any text from title and description to match
  text?: string
  // any tags to match
  tags?: string[]
  // match all or some text fragments
  textOp?: 'and' | 'or'
  // match all or some text tags
  tagsOp?: 'and' | 'or'
  // group by path (default) or date (year)
  group?: 'path' | 'date'
  // sort by path (default) or date
  sort?: 'path' | 'date'
  // whether to randomize results once filtered and sorted
  random?: boolean
  // limit the number of results returned
  limit?: number

  /// perhaps these should be in search options?

  // format to display results in - image (default) or text
  format?: 'image' | 'text'
  // whether to show the tags filter
  tagsFilter?: 'off' | 'list' | 'groups'
  // page anchor to scroll to once filtered
  show?: string
}

export interface SearchOptions {
  // which paths to include in the search
  paths?: string[]
  // whether to exclude drafts from results
  excludeDrafts?: boolean
  // whether to include only items with thumbnails
  hasThumbnail?: boolean
  // limit the number of results returned
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
    sort: 'date',
    show: '',
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

  // Parse sort
  if (params.sort) {
    query.sort = params.sort
  }

  // Parse other query fields
  if (params.tagsFilter) {
    query.tagsFilter = params.tagsFilter
  }

  if (params.textOp) {
    query.textOp = params.textOp
  }

  if (params.tagsOp) {
    query.tagsOp = params.tagsOp
  }

  if (params.group) {
    query.group = params.group
  }

  if (params.format) {
    query.format = params.format
  }

  if (params.limit) {
    query.limit = Number(params.limit)
  }

  // Parse show
  if (params.show) {
    query.show = params.show
  }

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

  if (query.random) {
    items = items.slice().sort(() => Math.random() - 0.5)
  }

  // Apply limit
  if (limit) {
    items = items.slice(0, limit)
  }

  // Sort by date (items already sorted by path)
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
  const predicates = matches.map((m) => {
    if (m.includes('/')) {
      return (item: ContentItem) => {
        return item.path && item.path.includes(m)
      }
    }
    return (item: ContentItem) => {
      return `${item.title || ''} ${item.description || ''}`.toLowerCase().includes(m)
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
  const orQuery = (page: ContentPage) => {
    return (page.tags ?? []).some((tag: string) => tags.includes(tag))
  }
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
 * Group items by a key
 */
export function groupBy (array: ContentPage[], key: keyof ContentPage, iteratee?: (val: string) => string) {
  const result: Record<string, ContentPage[]> = {}
  array.forEach((item) => {
    const itemValue = item[key]
    const val = (iteratee && itemValue
      ? iteratee(itemValue as string)
      : itemValue) ?? 'No Date'
    if (!result[val]) {
      result[val] = []
    }
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
