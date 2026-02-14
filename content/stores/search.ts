import { getParentPath } from '../utils'
import type { MetaFolder, MetaItem, MetaPost, SearchFilters, SearchOptions, SearchQuery } from '../types'

// ---------------------------------------------------------------------------------------------------------------------
// defaults
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

/**
 * Default search filters
 */
const DEFAULT_FILTERS: Required<SearchFilters> = {
  text: '',
  tags: [],
  textOp: 'and',
  tagsOp: 'and',
  group: 'path',
  path: '',
  sort: 'date',
  randomize: false,
  limit: 0,
}

/**
 * Default search options
 */
const DEFAULT_OPTIONS: SearchOptions = {
  format: 'image',
  tagsFilter: undefined,
  searchPaths: DEFAULT_SEARCH_PATHS,
  excludeDrafts: true,
  hasThumbnail: false,
}

/**
 * Create a default search filters object
 */
export function makeSearchFilters (): Required<SearchFilters> {
  return { ...DEFAULT_FILTERS }
}

/**
 * Create a default search options object
 */
export function makeSearchOptions (): SearchOptions {
  return { ...DEFAULT_OPTIONS }
}

// ---------------------------------------------------------------------------------------------------------------------
// query utilities
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Check if the query has any filtering applied (text or tags)
 */
export function isSearchFiltered (query: Partial<SearchQuery>): boolean {
  return !!(query.text || (query.tags && query.tags.length > 0))
}

/**
 * Check if query can be reset (has non-default filter values)
 */
export function canResetSearch (query: Partial<SearchQuery>): boolean {
  return !!(query.text && query.text !== '') || !!(query.tags && query.tags.length > 0)
}

/**
 * Parse query from URL query params or hash
 * Supports both `route.query` and URLSearchParams format
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

  // Parse tags (can be an array or single value)
  if (params.tags) {
    query.tags = Array.isArray(params.tags)
      ? params.tags
      : [params.tags]
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

  if (params.limit !== undefined) {
    const limit = Number(params.limit)
    if (limit > 0) {
      query.limit = limit
    }
  }

  return query
}

/**
 * Clean query by removing default values and undefined/empty values
 */
export function cleanQuery (query: Partial<SearchQuery>): Partial<SearchQuery> {
  const cleaned: Record<string, any> = {}
  const defaults = { ...DEFAULT_FILTERS, ...DEFAULT_OPTIONS }

  for (const key in query) {
    const queryKey = key as keyof SearchQuery
    const value = query[queryKey]
    const defaultValue = defaults[queryKey]

    // Skip undefined, null, or empty string values
    if (value === undefined || value === null || value === '') {
      continue
    }

    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) {
      continue
    }

    // Skip if value matches default
    if (String(value) === String(defaultValue)) {
      continue
    }

    cleaned[key] = value
  }

  return cleaned
}

// ---------------------------------------------------------------------------------------------------------------------
// search functionality
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Search and filter content based on query parameters
 */
export function queryItems (items: MetaItem[], query: SearchQuery = {}) {
  const {
    searchPaths = DEFAULT_SEARCH_PATHS,
    excludeDrafts = true,
    hasThumbnail = false,
    limit,
  } = query

  // Get all posts
  let posts = items.filter(item => item.type === 'post')

  // Filter drafts
  if (excludeDrafts) {
    posts = posts.filter((item) => {
      return !('draft' in item) || !(item as any).draft
    })
  }

  // Filter by path - use query.path if specified, otherwise use options.paths
  const pathsToSearch = query.path ? [query.path] : searchPaths
  if (pathsToSearch.length > 0) {
    posts = posts.filter((item) => {
      return pathsToSearch.some(p => item.path === p || item.path.startsWith(p))
    })
  }

  // Filter by thumbnail
  if (hasThumbnail) {
    posts = posts.filter((item) => {
      return item.type === 'post' && item.media?.thumbnail
    })
  }

  // Apply query filters
  if (query.tags && query.tags.length > 0) {
    posts = posts.filter(makeTagsFilter(query.tags, query.tagsOp === 'or'))
  }

  // Match on text, but also test tags for text
  if (query.text) {
    const tags = query.text.toLowerCase().match(/\S+/g) ?? []
    const matchingPaths = new Set([
      ...posts.filter(makeTextFilter(query.text, query.textOp === 'or')).map(p => p.path),
      ...posts.filter(makeTagsFilter(tags, query.tagsOp === 'or')).map(p => p.path),
    ])
    posts = posts.filter(p => matchingPaths.has(p.path))
  }

  if (query.randomize) {
    posts = posts.slice().sort(() => Math.random() - 0.5)
  }

  // Apply limit
  if (limit && limit > 0) {
    posts = posts.slice(0, limit)
  }

  // Sort by date (items pre-sorted by path)
  if (query.sort === 'date' && query.group !== 'path') {
    posts.sort((a, b) => {
      const da = a.type === 'post' && a.date ? new Date(a.date).getTime() : 0
      const db = b.type === 'post' && b.date ? new Date(b.date).getTime() : 0
      return db - da
    })
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // results
  // ---------------------------------------------------------------------------------------------------------------------

  let results: MetaItem[] = posts

  // collate tags
  const tags = posts.reduce((tags, item) => {
    if (item.tags) {
      item.tags.forEach(tag => tags.add(tag))
    }
    return tags
  }, new Set<string>())

  // group by date
  if (query.group === 'date') {
    const grouped = groupPosts(posts, item => item.date ? item.date.substring(0, 4) : 'none')
    results = Object.values(grouped).map((folder) => {
      const { key, items } = folder
      return {
        type: 'folder',
        title: key === 'none' ? 'No Date' : key,
        description: '',
        slug: `year-${key}`,
        path: '',
        items,
      }
    })
  }

  // group by path
  if (query.group === 'path') {
    // collate all parent paths
    const paths = new Set<string>()
    for (const item of posts) {
      // traverse up parent path
      const segments = item.path.split('/').filter(Boolean)
      let currentPath = '/'
      for (const segment of segments) {
        currentPath = `${currentPath}${segment}/`
        paths.add(currentPath)
      }
    }
    const nested = items.filter(item => paths.has(item.path))
    results = makeTree(nested, query.path || '/')
  }

  return {
    total: posts.length,
    items: results,
    tags: Array.from(tags),
    query,
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Create a text filter function
 */
function makeTextFilter (text: string, useOr = true) {
  text = text.trim()
  if (text === '') {
    return () => true
  }
  // filter on tokens
  const matches = text.toLowerCase().match(/\S+/g) || []

  // predicates
  const predicates = matches.map((m) => {
    // filter on path
    if (m.includes('/')) {
      return (item: MetaItem) => {
        return item.path && item.path.includes(m)
      }
    }

    // filter on text
    return (item: MetaItem) => {
      return `${item.title || ''} ${item.description || ''}`.toLowerCase().includes(m)
    }
  })

  // return
  return useOr
    ? (item: MetaItem) => predicates.some(fn => fn(item))
    : (item: MetaItem) => predicates.every(fn => fn(item))
}

/**
 * Create a tag filter function
 */
function makeTagsFilter (tags: string[], useOr = false) {
  const orQuery = (page: MetaPost) => {
    return (page.tags ?? []).some((tag: string) => tags.includes(tag))
  }
  const andQuery = (page: MetaPost) => {
    const pageTags = (page.tags ?? [])
    return tags.every((tag: string) => pageTags.includes(tag))
  }
  const query = useOr ? orQuery : andQuery
  return (item: MetaItem) => {
    return item.type === 'folder' || query(item)
  }
}

function groupPosts<T extends MetaPost, K extends keyof T> (
  pages: T[],
  // eslint-disable-next-line
  key: K | ((item: T) => string),
) {
  const result: Record<any, MetaPost[]> = {}
  pages.forEach((item) => {
    const groupKey = typeof key === 'function'
      ? key(item)
      : key
    if (groupKey && !result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
  })
  return Object
    .keys(result)
    .sort()
    .reverse()
    .map(key => ({
      key,
      items: result[key] ?? [],
    }))
}

// ---------------------------------------------------------------------------------------------------------------------
// tree functionality
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Build tree from filtered items
 *
 * Note that parent folders must be pre-filtered for the function to work!
 *
 * @param nodes
 * @param rootPath
 */
function makeTree (nodes: (MetaFolder | MetaPost)[], rootPath: string): MetaItem[] {
  // Filter and clone so we don't affect originals
  const validNodes = nodes
    .filter(n => n.path !== rootPath && n.path.startsWith(rootPath))
    .map((p) => {
      return clone(p)
    })

  // Create a map for lookup
  const map: Record<string, MetaItem> = {}
  for (const n of validNodes) {
    map[n.path] = n
  }

  const tree: MetaItem[] = []

  validNodes.forEach((node: MetaItem) => {
    // Find parent logic
    const parentPath = getParentPath(node.path)

    // Check if directly under root path
    if (parentPath === rootPath) {
      tree.push(node)
    }
    else {
      if (map[parentPath]) {
        const parent = map[parentPath] as MetaFolder
        if (!parent.items) {
          parent.items = []
        }
        parent.items.push(node)
      }
    }
  })

  return tree
}
