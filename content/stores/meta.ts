import { computed, defineStore } from '#imports'
import { getParentPath, getPath } from '../utils'
import { usePageStore } from './page'
import { queryItems } from './search'
import type { MetaItem, SearchQuery } from '../types'

export type Link = {
  path: string
  title: string
  description?: string | ComputedRef<string>
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
  // dependencies
  // ---------------------------------------------------------------------------------------------------------------------

  const content = usePageStore()

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
    items.value = results[0]
    tagGroups.value = results[1]
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // navigation
  // ---------------------------------------------------------------------------------------------------------------------

  function createLink (path: string, title: string, description = '', cssClass = ''): Link {
    return {
      path,
      title,
      description: description
        ? description
        : computed(() => items.value.find(item => item.path === path)?.description || '...'), // items aren't yet loaded when store is initialised
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

  // computed
  const surround = computed(() => {
    return getMetaSurround(getPosts(), content.path)
  })

  const siblings = computed(() => {
    const parentPath = getParentPath(content.path)
    const items = getItems(parentPath)
    return getMetaSiblings(items, parentPath)
  })

  const breadcrumbs = computed(() => {
    return getMetaParents(items.value, content.path, content.page?.title ?? '')
  })

  const up = computed<Link>(() => {
    const parents = getMetaParents(items.value, content.path, 'Up')
    return {
      title: 'Up',
      path: getParentPath(content.path),
      description: `Go up to ${parents.at(-2)?.title}`,
      class: `up ${parents.length > 2 ? '' : 'hidden'}`,
    } satisfies Link
  })

  const top = computed(() => {
    const left: Link[] = [
      // main entries
      work, products, projects, blog,
      // only show archive if in archive path
      { ...archive, class: content.path.startsWith('/archive/') ? '' : 'hidden' },
    ]

    const right: Link[] = [up.value, siteSearch]

    return [
      createSection('Content', left),
      createSection('Navigation', right),
    ]
  })

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
    surround,
    siblings,
    breadcrumbs,
    top,
    up,

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
  const parents: Link[] = [{ title: 'Home', path: '/' }]
  let currentPath = '/'

  // build segments
  const segments = path.split('/').filter(Boolean)
  for (const segment of segments) {
    // variables
    currentPath += segment + '/'
    const item = items.find((p) => {
      return p.type === 'folder'
        ? p.path === currentPath
        : getPath(p) === currentPath
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
export function getMetaSiblings (items: MetaItem[], parentPath: string): MetaItem[] {
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
