import { computed, defineStore } from '#imports'
import { getParentPath } from '../utils'
import { queryItems } from './search'
import type { MetaItem, MetaPost, SearchQuery, TagGroup } from '../types'

export type Link = {
  path: string
  title: string
  description?: string
  class?: string
}

/**
 * # Meta Store
 *
 * Loads and manages metadata from all folders and posts in the Content API
 *
 * This allows the site to build navigation, related links, and other metadata-driven
 * features at site load, rather than having to wait for individual page loads.
 *
 * It also allows search to be instant, via `useMetaStore().search()`.
 */
export const useMetaStore = defineStore('meta', () => {
  // ---------------------------------------------------------------------------------------------------------------------
  // properties
  // ---------------------------------------------------------------------------------------------------------------------

  // all content items (metadata only)
  const items = ref<MetaItem[]>([])

  // tag groups from json
  const tagGroups = ref<TagGroup[]>([])

  // flattened tag list
  const tagList = computed(() => {
    return tagGroups.value
      .map(group => group.tags)
      .flat()
      .sort()
  })

  // ---------------------------------------------------------------------------------------------------------------------
  // actions
  // ---------------------------------------------------------------------------------------------------------------------

  /**
   * Get all folder and posts from the target path down
   */
  function getItems (path = '/'): MetaItem[] {
    const normalizedPath = normalizePath(path)
    return items.value.filter(item => item.path.startsWith(normalizedPath))
  }

  /**
   * Get all posts from the target path down
   */
  function getPosts (path = '/'): MetaPost[] {
    return getItems(path).filter(p => p.type === 'post')
  }

  /**
   * Search, sort, and structure all posts
   */
  function search (query: SearchQuery) {
    return queryItems(items.value, query)
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // initialisation
  // ---------------------------------------------------------------------------------------------------------------------

  async function initServer () {
    // Can't have more than one await
    // @see https://www.youtube.com/watch?v=ofuKRZLtOdY
    const results = await Promise.all([
      $fetch('/api/content/meta'),
      $fetch('/api/content/tags'),
    ])
    items.value = results[0] || []
    tagGroups.value = results[1] || []
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // navigation computed
  // ---------------------------------------------------------------------------------------------------------------------

  function createLink (path: string, title: string, description = '', cssClass = ''): Link {
    return {
      path,
      title,
      get description () {
        return description || items.value.find(item => item.path === path)?.description || '...'
      },
      class: cssClass,
    }
  }

  function createSection (name: string, links: Link[]) {
    return { name, links }
  }

  // entries
  const home = createLink('/', 'Home', 'Home page')
  const sitemap = createLink('/sitemap/', 'Sitemap', 'Full list of everything on the site')
  const siteSearch = createLink('/search/', 'Search', 'Search portfolio')
  const work = createLink('/work/', 'Work')
  const products = createLink('/products/', 'Products')
  const projects = createLink('/projects/', 'Projects')
  const archive = createLink('/archive/', 'Archive')
  const info = createLink('https://github.com/davestewart/davestewart-site', 'Site', 'Info and site source code')
  const blog = createLink('/blog/', 'Blog')

  // main sections
  const sections = computed(() => {
    return [
      createSection('Navigation', [
        home,
        sitemap,
        siteSearch,
      ]),
      createSection('Creation', [
        work,
        products,
        projects,
        archive,
      ]),
      createSection('Ideation', [
        blog,
        info,
      ]),
    ]
  })

  // ---------------------------------------------------------------------------------------------------------------------
  // navigation actions
  // ---------------------------------------------------------------------------------------------------------------------

  function getSurround (path: string) {
    const posts = getPosts()
      .filter(p => p.status !== 'draft' && p.status !== 'unlisted')
    return getMetaSurround(posts, path)
  }

  function getSiblings (path: string) {
    const parentPath = getParentPath(path)
    const posts = getPosts(parentPath)
      .filter(p => p.status !== 'draft' && p.status !== 'unlisted')
    return getMetaSiblings(posts, parentPath)
  }

  function getBreadcrumbs (path: string, fallbackTitle = '') {
    return getMetaParents(items.value, path, fallbackTitle)
  }

  function getUp (path: string): Link {
    const parents = getMetaParents(items.value, path, 'Up')
    const parent = parents.at(-2) ?? parents.at(0)!
    return {
      title: 'Up',
      path: parent.path,
      description: `Go up to ${parent?.title}`,
      class: `up ${parents.length > 1 ? '' : 'hidden'}`,
    } satisfies Link
  }

  function getTop (path: string) {
    const left: Link[] = [
      // main entries
      work, products, projects, blog,
      // only show archive if in archive path
      { ...archive, class: path.startsWith('/archive/') ? '' : 'hidden' },
    ]

    const right: Link[] = [getUp(path), siteSearch]

    return [
      createSection('Content', left),
      createSection('Navigation', right),
    ]
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // return
  // ---------------------------------------------------------------------------------------------------------------------

  return {
    // items
    items,
    getItems,
    getPosts,
    search,

    // tags
    tagGroups,
    tagList,

    // navigation
    sections,
    getSurround,
    getSiblings,
    getBreadcrumbs,
    getTop,
    getUp,

    // initialisation
    initServer,
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Ancestor items from the root to the current page
 */
export function getMetaParents (items: MetaItem[], path: string, fallbackTitle = '404'): Link[] {
  // variables
  const parents: Link[] = [{ path: '/', title: 'Home' }]
  let currentPath = '/'

  // resolve any permalinks
  const candidatePath = items
    .find((item) => {
      const p = item.type === 'post'
        ? item.permalink ?? item.path
        : item.path
      return p === path
    })?.path ?? path

  // build segments
  const segments = candidatePath.split('/').filter(Boolean)
  for (const segment of segments) {
    // variables
    currentPath += segment + '/'
    const item = items.find(p => p.path === currentPath)

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
        parents[0] as Link,
        { title: fallbackTitle } as Link,
      ]
    }
  }

  // return
  return parents
}

/**
 * Sibling items in the same folder level as the current page
 */
export function getMetaSiblings (items: MetaPost[], parentPath: string): MetaItem[] {
  return items.filter(p => getParentPath(p.path) === parentPath)
}

/**
 * Related items before and after the current page
 */
export function getMetaSurround (posts: MetaPost[], path: string) {
  const index = posts.findIndex(p => p.permalink === path || p.path === path)
  if (index > -1) {
    return [
      posts[index - 1],
      posts[index + 1],
    ] as const
  }
  return [undefined, undefined] as const
}
