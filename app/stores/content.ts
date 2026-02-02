import { getParentPath, normalizePath } from '~/utils/content'
import { computed } from 'vue'

// ---------------------------------------------------------------------------------------------------------------------
// types
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Raw data from Content API
 */
interface ContentItemRaw {
  _path?: string
  type: 'folder' | 'post'
  // parentPath: string
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

/**
 * Breadcrumbs for a given path
 */
export type ContentBreadcrumb = {
  path: string
  title: string
  description?: string
}

// ---------------------------------------------------------------------------------------------------------------------
// store
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Content store for managing current page and navigation data
 */
export const useContentStore = defineStore('content', () => {
  // ---------------------------------------------------------------------------------------------------------------------
  // page content
  // ---------------------------------------------------------------------------------------------------------------------

  // page route
  const route = useRoute()

  // page path, but *only* once the page has finished loading (this is later that route navigation)
  const path = ref('/')

  // page object
  const page = ref<ParsedPage | null>(null)

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

  // ---------------------------------------------------------------------------------------------------------------------
  // navigation items
  // ---------------------------------------------------------------------------------------------------------------------

  // all content items (metadata only)
  const items = ref<ContentItem[]>([])

  // computed
  const breadcrumbs = computed(() => {
    return getContentParents(path.value, page.value?.title ?? '')
  })

  const siblings = computed(() => {
    return getContentSiblings(path.value)
  })

  const surround = computed(() => {
    return getContentSurround(path.value)
  })

  // ---------------------------------------------------------------------------------------------------------------------
  // query functions (may move to search store)
  // ---------------------------------------------------------------------------------------------------------------------

  // Computed getters for your navigation functions
  const getItems = computed(() => (path = '/') => {
    return items.value?.filter(item => item.path.startsWith(path)) ?? []
  })

  const getPosts = computed(() => (options = {}) => {
    // Your existing logic
  })

  const getPost = computed(() => (path: string): ContentPage | undefined => {
    return items.value
      ?.filter(item => item.type === 'post')
      .find(item => item.path === path || item.permalink === path) ?? undefined
  })

  // ---------------------------------------------------------------------------------------------------------------------
  // initializers
  // ---------------------------------------------------------------------------------------------------------------------

  async function initServer () {
    path.value = route.path
    items.value = await queryItems()
  }

  function initClient () {
    const nuxtApp = useNuxtApp()
    nuxtApp.hook('page:finish', () => {
      path.value = route.path
    })
  }

  return {
    // current page
    path,
    page,

    // items
    items,
    breadcrumbs,
    siblings,
    surround,

    // methods
    loadPage,
    getItems,
    getPosts,
    getPost,

    // initializers
    initServer,
    initClient,
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// main state and query function
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Makes the required query to the api via queryContent
 */
export async function queryItems (): Promise<(ContentItem[])> {
  const pages = await queryContent()
    .only([
      '_path',
      // 'parentPath',
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
    .find()
    .catch((err) => {
      console.error('[useFolder] Error:', err)
      return []
    }) satisfies ContentItemRaw[]

  // build items
  return pages
    // if an order is defined, sort by order, otherwise, sort by date
    // .sort((a, b) => {
    //   return a._path!.localeCompare(b._path!)
    // })
    .sort((a, b) => {
      const orderA = a.order ?? 9999
      const orderB = b.order ?? 9999
      if (orderA !== orderB) {
        return orderA - orderB
      }
      const dateA = new Date(a.date || 0).getTime()
      const dateB = new Date(b.date || 0).getTime()
      return dateB - dateA
    })
    // .sort((a: any, b: any) => {
    //   const orderA = a.order ?? 9999
    //   const orderB = b.order ?? 9999
    //   return orderA - orderB
    // })
    // .sort((a: any, b: any) => {
    //   const dateA = new Date(a.date || 0).getTime()
    //   const dateB = new Date(b.date || 0).getTime()
    //   return dateB - dateA
    // })
    .sort(sortBySection)

    // convert pages to items
    .map((page) => {
      if (page.type === 'folder') {
        return {
          path: page._path!,
          type: page.type,
          // parentPath: page.parentPath!,
          title: page.title ?? '',
          description: page.description ?? '',
          order: page.order,
          items: [],
        } as ContentFolder
      }
      return {
        path: page._path!,
        type: page.type,
        // parentPath: page.parentPath!,
        permalink: page.permalink,
        title: page.title ?? '',
        shortTitle: page.shortTitle,
        description: page.description ?? '',
        media: {
          thumbnail: page.media?.thumbnail,
        },
        github: page.github,
        order: page.order,
        date: page.date,
        status: page.status,
        tags: page.tags,
      } as ContentPage
    })
}

// ---------------------------------------------------------------------------------------------------------------------
// item functions
// ---------------------------------------------------------------------------------------------------------------------

interface ContentItemOptions {
  limit?: number
  sort?: 'date' | 'path' | 'random'
}

function filterVisible (items: ContentPage[]) {
  return items
    .filter(item => item.status !== 'draft')
    .filter(item => item.status !== 'unlisted')
    .filter(item => item.status !== 'hidden')
    .filter(item => item.date)
}

export function getItems (path = '/'): ContentItem[] {
  // if items not loaded yet, load them
  const { items } = useContentStore()

  // normalise path (adds slash to end)
  const normalizedPath = normalizePath(path)

  // filter
  return items.filter(item => item.path.startsWith(normalizedPath))
}

export function getPosts (options: ContentItemOptions = {}): ContentPage[] {
  // options
  const sort = options.sort
  const limit = options.limit

  // initial posts
  let items: ContentPage[] = getItems()
    .filter(item => item.type === 'post')

  // filter to visible
  items = filterVisible(items)

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
  if (limit) {
    items = items.slice(0, limit)
  }
  return items as ContentPage[]
}

// TODO add a sort by section helper
const sections = [
  'work',
  'products',
  'projects',
  'blog',
  'archive',
]

type HasPath = {
  _path?: string
  path?: string
}

export function sortBySection (a: HasPath, b: HasPath) {
  const aSection = (a._path ?? a.path)?.split('/')[1] || ''
  const bSection = (b._path ?? b.path)?.split('/')[1] || ''
  const aIndex = sections.indexOf(aSection)
  const bIndex = sections.indexOf(bSection)
  return (aIndex < 0 ? 1000 : aIndex) - (bIndex < 0 ? 1000 : bIndex)
}

// ---------------------------------------------------------------------------------------------------------------------
// main functions
// ---------------------------------------------------------------------------------------------------------------------

/**
 * items from root to current page
 */
export function getContentParents (path: string, fallbackTitle = '404'): ContentBreadcrumb[] {
  // variables
  const items = getItems('/')
  const parents: ContentBreadcrumb[] = [{ title: 'Home', path: '/' }]
  let currentPath = '/'

  // build segments
  const segments = path.split('/').filter(Boolean)
  for (const segment of segments) {
    // variables
    currentPath += segment + '/'
    const item = items.find((p) => {
      return p.type === 'folder'
        ? p.path === currentPath
        : p.path === currentPath || p.permalink === currentPath
    })

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
        parents[0] as ContentBreadcrumb,
        { title: fallbackTitle } as ContentBreadcrumb,
      ]
    }
  }

  // return
  return parents
}

/**
 * items at the same level as current page
 */
export function getContentSiblings (path: string): ContentItem[] {
  const parentPath = getParentPath(path)
  const items = getItems(parentPath)
  return items.filter(p => getParentPath(p.path) === parentPath)
}

/**
 * items before and after current page
 */
export function getContentSurround (path: string): Array<ContentPage | undefined> {
  const items = getPosts()
  const index = items.findIndex((p: any) => p.path === path)
  if (index > -1) {
    return [
      items[index - 1],
      items[index + 1],
    ]
  }
  return [undefined, undefined]
}

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
