import { queryItems } from './api'
import { getParentPath, normalizePath } from '~/utils/content'

// ---------------------------------------------------------------------------------------------------------------------
// types
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Raw data from Content API
 */
export interface ContentItemRaw {
  _path?: string
  type: 'folder' | 'post' | 'home' | 'showcase'
  title?: string
  shortTitle?: string
  description?: string
  permalink?: string
  media?: {
    thumbnail?: string
  }
  order?: number
  date?: string
  status?: string
  tags?: string[]
}

/**
 * Filtered data for either folder or post item
 */
export type ContentItem = ContentFolder | ContentPage

/**
 * Filtered data for folder item
 */
export interface ContentFolder {
  type: 'folder'
  path: string
  title: string
  description?: string
  items: ContentItem[]
}

/**
 * Filtered data for post item
 */
export interface ContentPage {
  type: 'post'
  date: string
  path: string
  permalink?: string
  title: string
  shortTitle?: string
  description?: string
  status?: string
  github?: string
  tags: string[]
  media: {
    thumbnail?: string
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// store
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Manages:
 *
 * - all metadata
 * - current page
 */
export const useContentStore = defineStore('content', () => {
  // page route
  const route = useRoute()

  // page path, but *only* once the page has finished loading (this is later that route navigation)
  const path = ref('/')

  // page object
  const page = ref<ParsedPage | null>(null)

  // all content items (metadata only)
  const items = ref<ContentItem[]>([])

  // load the current page
  async function loadPage (path: string) {
    page.value = await queryContent<ParsedPage>()
      .where({
        $or: [
          { _path: path },
          { permalink: path },
        ],
      })
      .findOne()
    return page.value
  }

  async function initServer () {
    path.value = route.path
    items.value = await queryItems() // process.env.NODE_ENV as any
  }

  function initClient () {
    const nuxtApp = useNuxtApp()
    nuxtApp.hook('page:finish', () => {
      path.value = route.path
    })
  }

  return {
    path,
    page,
    items,
    loadPage,
    initServer,
    initClient,
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// item functions
// ---------------------------------------------------------------------------------------------------------------------

interface ContentItemOptions {
  limit?: number
  sort?: 'date' | 'path' | 'random'
}

/**
 * Get all items from the target path down
 *
 * @param path
 */
export function getItems (path = '/'): ContentItem[] {
  // if items not loaded yet, load them
  const { items } = useContentStore()

  // normalise path (adds slash to end)
  const normalizedPath = normalizePath(path)

  // filter
  return items.filter(item => item.path.startsWith(normalizedPath))
}

/**
 * Get posts with a few filtering options
 *
 * @param options
 */
export function getPosts (options: ContentItemOptions = {}): ContentPage[] {
  // options
  const { sort, limit } = options

  // initial posts
  let items: ContentPage[] = getItems().filter(item => item.type === 'post')

  // options
  if (sort) {
    if (sort === 'date' || sort === 'path') {
      items = items.sort((a, b) => {
        const aValue = (sort in a) ? a[sort] : 0
        const bValue = (sort in b) ? b[sort] : 0
        return aValue < bValue ? 1 : -1
      })
    }
    else if (sort === 'random') {
      items = items.sort(() => Math.random() > 0.5 ? 1 : -1)
    }
  }

  // finally, slice if limit is set
  if (limit) {
    items = items.slice(0, limit)
  }

  // return
  return items as ContentPage[]
}

// ---------------------------------------------------------------------------------------------------------------------
// main functions
// ---------------------------------------------------------------------------------------------------------------------

/**
 * items from the target path down
 */
export function getContentTree (path: string) {
  const items = getItems(path)
  const tree = makeTree(items, path)

  // Build headers for TOC (folder structure)
  const currentPage = items.find(p => p.path === path)
  const rootTitle = currentPage?.title || 'Untitled Folder'
  const headers = makeHeaders(tree, rootTitle)

  return { tree, pages: items, headers }
}

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Logic to generate section headers from nested items
 *
 * @param items       An array of potentially nested items
 * @param rootTitle
 */
export function makeHeaders (items: ContentItem[], rootTitle: string) {
  type Header = {
    level: number
    title: string
    slug: string
  }

  function process (item: ContentItem, level = 1) {
    if (item.type === 'folder' || level === 0) { // level 0 is root wrapper
      if (level > 0) {
        output.push({
          level,
          title: item.title,
          slug: slugify(item.title),
        })
      }
      if ('items' in item) {
        item.items.forEach(p => process(p, level + 1))
      }
    }
  }

  const output: Header[] = []
  process({ type: 'folder', title: rootTitle, items, path: '/' }, 0)
  return output
}

/**
 * Replicate legacy tree building logic adapted for Nuxt Content documents
 * @param nodes
 * @param rootPath
 */
export function makeTree (nodes: (ContentFolder | ContentPage)[], rootPath: string): ContentItem[] {
  // Filter and clone so we don't affect originals
  const validNodes = nodes
    .filter(n => n.path !== rootPath && n.path.startsWith(rootPath))
    .map((p) => {
      return clone(p)
    })

  // Create a map for lookup
  const map: Record<string, ContentItem> = {}
  for (const n of validNodes) {
    map[n.path] = n
  }

  const tree: ContentItem[] = []

  validNodes.forEach((node: ContentItem) => {
    // Find parent logic
    const parentPath = getParentPath(node.path)

    // Check if directly under root path
    if (parentPath === rootPath) {
      tree.push(node)
    }
    else {
      if (map[parentPath]) {
        const parent = map[parentPath] as ContentFolder
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
  function pruneEmptyFolders (nodes: ContentItem[]): ContentItem[] {
    return nodes
      .filter((node: ContentItem) => {
        if (node.type === 'folder') {
          const folder = node as ContentFolder
          folder.items = pruneEmptyFolders(folder.items)
          return folder.items.length > 0
        }
        return true
      })
  }

  return pruneEmptyFolders(tree)
}
