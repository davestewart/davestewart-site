// ---------------------------------------------------------------------------------------------------------------------
// types
// ---------------------------------------------------------------------------------------------------------------------

import { getParentPath, normalizePath } from '~/utils/content'

/**
 * Raw data from Content API
 */
interface NavItemRaw {
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
export type NavItem = NavFolder | NavPage

/**
 * Filtered data for folder item
 */
export interface NavFolder {
  type: 'folder'
  path: string
  title: string
  description?: string
  pages: NavItem[]
}

/**
 * Filtered data for post item
 */
export interface NavPage {
  type: 'post'
  path: string
  permalink?: string
  title: string
  shortTitle?: string
  description?: string
  media: {
    thumbnail?: string
  }
  date: string
  status: string
  tags: string[]
}

/**
 * Breadcrumbs for a given path
 */
type NavBreadcrumb = {
  path: string
  title: string
  description?: string
}

// ---------------------------------------------------------------------------------------------------------------------
// main state and query function
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Global reactive state for all navigation items.
 */
function useNavItems () {
  return useState<NavItem[] | null>('nav-items', () => null)
}

/**
 * Makes the required query to the api via queryContent
 */
export async function queryItems (): Promise<(NavItem[])> {
  const items = useNavItems()
  if (items.value) {
    return items.value
  }

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
    ])
    .where({
      _extension: 'md',
    })
    .find()
    .catch((err) => {
      console.error('[useFolder] Error:', err)
      return []
    }) satisfies NavItemRaw[]

  // build items
  const mapped = pages
    // if an order is defined, sort by order, otherwise, sort by date
    .sort((a: any, b: any) => {
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
    // .sort((a, b) => {
    //   return a.parentPath.localeCompare(b.parentPath)
    // })

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
          pages: [],
        } as NavFolder
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
        order: page.order,
        date: page.date,
        status: page.status,
        tags: page.tags,
      } as NavPage
    })

  items.value = mapped
  return mapped
}

// ---------------------------------------------------------------------------------------------------------------------
// item functions
// ---------------------------------------------------------------------------------------------------------------------

interface NavItemOptions {
  limit?: number
  random?: boolean
  sorted?: boolean
}

export async function getItems (path = '/'): Promise<NavItem[]> {
  // if items not loaded yet, load them
  const items = await queryItems()

  // normalise path
  // const normalizedPath = path.endsWith('/') && path !== '/'
  //   ? path.slice(0, -1)
  //   : path
  const normalizedPath = normalizePath(path)

  // filter
  return items.filter(item => item.path.startsWith(normalizedPath))
}

export async function getPosts (options: NavItemOptions = {}): Promise<NavPage[]> {
  // initial posts
  let items = await getItems()
  items = items
    .filter(item => item.type === 'post')
    .filter(item => item.date)
    .filter(item => item.status !== 'draft')
    .filter(item => item.status !== 'unlisted')
    .filter(item => item.media?.thumbnail)
    .filter(item => !item.path.startsWith('/archive/'))
    .filter(item => !item.path.startsWith('/blog/'))

  // options
  if (options.sorted) {
    items = items.sort((a, b) => {
      const aDate = ('date' in a) ? new Date(a.date) : 0
      const bDate = ('date' in b) ? new Date(b.date) : 0
      return aDate < bDate ? 1 : -1
    })
  }
  if (options.random) {
    items = items.sort(() => Math.random() > 0.5 ? 1 : -1)
  }
  if (options.limit) {
    items = items.slice(0, options.limit)
  }
  return items as NavPage[]
}

// ---------------------------------------------------------------------------------------------------------------------
// main functions
// ---------------------------------------------------------------------------------------------------------------------

/**
 * items from root to current page
 */
export async function getNavParents (path: string): Promise<NavBreadcrumb[]> {
  // variables
  const items = await getItems('/')
  const parents: NavBreadcrumb[] = [{ title: 'Home', path: '/' }]
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
        parents[0] as NavBreadcrumb,
        { title: '404' } as NavBreadcrumb,
      ]
    }
  }

  // return
  return parents
}

/**
 * items at the same level as current page
 */
export async function getNavSiblings (path: string): Promise<NavItem[]> {
  const parentPath = getParentPath(path)
  const items = await getItems(parentPath)
  return items.filter(p => getParentPath(p.path) === parentPath)
}

/**
 * items before and after current page
 */
export async function getNavSurround (path: string): Promise<Array<NavPage | undefined>> {
  const items = await getPosts()
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
export async function getNavTree (path: string) {
  const items = await getItems(path)
  const tree = makeTree(items, path)

  // Build headers for TOC (folder structure)
  const currentPage = items.find((p: any) => p.path === path)
  const rootTitle = currentPage?.title || 'Untitled Folder'
  const headers = makeHeaders(tree, rootTitle)

  return { tree, pages: items, headers }
}

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Logic to generate headers from tree
 *
 * @param tree
 * @param rootTitle
 */
export function makeHeaders (tree: any[], rootTitle: string) {
  const output: any[] = []

  function process (item: any, level = 1) {
    if (item.type === 'folder' || level === 0) { // level 0 is root wrapper
      if (level > 0) {
        output.push({
          level,
          title: item.title,
          slug: item.title.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, ''),
        })
      }
      if (item.pages) {
        item.pages.forEach((p: any) => process(p, level + 1))
      }
    }
  }

  // Wrap tree in a root node to match legacy signature if needed, or just iterate tree
  process({ type: 'folder', title: rootTitle, pages: tree }, 0)
  return output
}

/**
 * Replicate legacy tree building logic adapted for Nuxt Content documents
 * @param pages
 * @param rootPath
 */
export function makeTree (pages: (NavFolder | NavPage)[], rootPath: string): NavItem[] {
  // Deep copy to allow mutation (nesting)
  // v3 items have 'stem', 'extension', 'meta', 'body', etc. mapped to top level properties usually
  // v2 items have path
  const nodes = pages.map((p) => {
    return { ...p }
  })

  const validNodes = nodes.filter(n => n.path !== rootPath && n.path.startsWith(rootPath))

  // Create a map for lookup
  const map: Record<string, NavItem> = {}
  for (const n of validNodes) {
    map[n.path] = n
  }

  const tree: NavItem[] = []

  validNodes.forEach((node: NavItem) => {
    // Find parent logic
    const parentPath = getParentPath(node.path)

    // Check if directly under root path
    if (parentPath === rootPath) {
      tree.push(node)
    }
    else {
      if (map[parentPath]) {
        const parent = map[parentPath] as NavFolder
        if (!parent.pages) {
          parent.pages = []
        }
        parent.pages.push(node)
        // Auto-promote to folder if it has children
        if (map[parentPath].type !== 'folder') {
          // map[parentPath].type = 'folder'
        }
      }
    }
  })

  return tree
}
