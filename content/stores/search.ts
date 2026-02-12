import { useContentStore } from './content'
import { getParentPath } from '../utils'
import type { MetaFolder, MetaItem, MetaPost } from '../types'

// ---------------------------------------------------------------------------------------------------------------------
// types
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Options to filter the search
 *
 * @public
 */
export interface SearchFilters {
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
  // whether to pick random items (different from sort, as items can still be sorted)
  randomize?: boolean
  // limit the number of results returned
  limit?: number
  // sort by path (default) or date
  sort?: 'path' | 'date' | 'random'
}

/**
 * Options to control search behaviour and display
 *
 * @internal
 */
export interface SearchOptions {
  // which paths to include in the search
  searchPaths?: string[]
  // whether to exclude drafts from results
  excludeDrafts?: boolean
  // whether to include only items with thumbnails
  hasThumbnail?: boolean
  // whether to show the tag filter
  tagsFilter?: 'off' | 'list' | 'groups'
  // format to display results in - image (default) or text
  format?: 'image' | 'text'
}

/**
 * Combined type for overall search query
 */
export type SearchQuery = SearchFilters & SearchOptions

// ---------------------------------------------------------------------------------------------------------------------
// query utilities
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
 * Create a default search query
 */
export function makeSearchFilters (): Required<SearchFilters> {
  return {
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
}

export function makeSearchOptions (): Required<SearchOptions> {
  return {
    format: 'image',
    tagsFilter: 'off',
    searchPaths: DEFAULT_SEARCH_PATHS,
    excludeDrafts: true,
    hasThumbnail: false,
  }
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
 * Clean query by removing default values
 */
export function cleanQuery (query: SearchQuery): Partial<SearchQuery> {
  const cleaned: Record<string, any> = {}
  const defaults = makeSearchFilters()

  for (const key in query) {
    const queryKey = key as keyof SearchQuery
    // @ts-ignore
    if (String(query[queryKey]) !== String(defaults[queryKey])) {
      cleaned[key] = query[queryKey]
    }
  }

  return cleaned
}

// ---------------------------------------------------------------------------------------------------------------------
// search functionality
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Search and filter content based on query parameters
 */
export function searchContent (query: SearchQuery = {}) {
  const {
    searchPaths = DEFAULT_SEARCH_PATHS,
    excludeDrafts = true,
    hasThumbnail = false,
    limit,
  } = query

  // Get all pages
  const store = useContentStore()
  const allItems = store.getItems('/')
  let posts = allItems.filter(item => item.type === 'post')

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

  if (query.text) {
    posts = posts.filter(makeTextFilter(query.text, query.textOp === 'or'))
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

  let items: MetaItem[] = posts

  // collate tags
  const tags = posts.reduce((tags, item) => {
    if (item.tags) {
      item.tags.forEach(tag => tags.add(tag))
    }
    return tags
  }, new Set<string>())

  // group by date
  if (query.group === 'date') {
    items = groupBy(posts, item => item.date && item.date.substring(0, 4))
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
    const nested = allItems.filter(item => paths.has(item.path))
    items = makeTree(nested, query.path || '/')
  }

  return {
    total: posts.length,
    query,
    tags: Array.from(tags),
    items,
  }
}

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

function groupBy<T extends MetaPost, K extends keyof T> (
  pages: T[],
  // eslint-disable-next-line
  key: K | ((item: T) => string),
): MetaFolder[] {
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
      type: 'folder',
      path: '',
      title: key,
      description: '',
      items: result[key] ?? [],
    }))
}

// ---------------------------------------------------------------------------------------------------------------------
// tree functionality
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Replicate legacy tree building logic adapted for Nuxt Content documents
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
        // Auto-promote to folder if it has children
        if (map[parentPath].type !== 'folder') {
          // map[parentPath].type = 'folder'
        }
      }
    }
  })

  // depth-first search where we remove folders with no items
  // TODO we shouldn't need this when the filtering is correct
  function pruneEmptyFolders (nodes: MetaItem[]): MetaItem[] {
    return nodes
      .filter((node: MetaItem) => {
        if (node.type === 'folder') {
          const folder = node as MetaFolder
          folder.items = pruneEmptyFolders(folder.items)
          return folder.items.length > 0
        }
        return true
      })
  }

  return pruneEmptyFolders(tree)
}
