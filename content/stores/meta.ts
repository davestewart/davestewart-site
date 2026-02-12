import { computed, defineStore, toRef } from '#imports'
import { getParentPath, getPath } from '../utils'
import { queryItems, queryTags } from './api'
import { useContentStore } from './content'

import type { MetaItem } from '../types'

export type Link = {
  path: string
  title: string
  description?: string
  class?: string
}

/**
 * Manages site navigation
 */
export const useMetaStore = defineStore('meta', () => {
  // ---------------------------------------------------------------------------------------------------------------------
  // dependencies
  // ---------------------------------------------------------------------------------------------------------------------

  const content = useContentStore()

  const path = toRef(content, 'path')

  const page = toRef(content, 'page')

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

  // ---------------------------------------------------------------------------------------------------------------------
  // initialisation
  // ---------------------------------------------------------------------------------------------------------------------

  async function initServer () {
    const results = await Promise.all([
      // Can't have more than one await @see https://www.youtube.com/watch?v=ofuKRZLtOdY
      queryItems(), // process.env.NODE_ENV as any
      queryTags(),
    ])
    items.value = results[0]
    tagGroups.value = results[1]
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // navigation
  // ---------------------------------------------------------------------------------------------------------------------

  function getItem (path: string) {
    return items.value.find(item => item.path === path)
  }

  function createLink (path: string, title: string, description = '', cssClass = ''): Link {
    return {
      path,
      title,
      description: description || getItem(path)?.description || '',
      class: cssClass,
    }
  }

  function createSection (name: string, links: Link[]) {
    return { name, links }
  }

  // entries
  const home = createLink('/', 'Home', 'Home page')
  const sitemap = createLink('/sitemap/', 'Sitemap', 'Full list of everything on the site')
  const search = createLink('/search/', 'Search', 'Search portfolio')
  const work = createLink('/work/', 'Work')
  const products = createLink('/products/', 'Products')
  const projects = createLink('/projects/', 'Projects')
  const archive = createLink('/archive/', 'Archive')
  const info = createLink('https://github.com/davestewart/davestewart-site', 'Site', 'Info and site source code')
  const blog = createLink('/blog/', 'Blog')

  // main sections
  const sections = [
    createSection('Navigation', [
      home,
      sitemap,
      search,
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

  // computed
  const surround = computed(() => {
    return getMetaSurround(getPosts(), path.value)
  })

  const siblings = computed(() => {
    const parentPath = getParentPath(path.value)
    const items = getItems(parentPath)
    return getMetaSiblings(items, parentPath)
  })

  const breadcrumbs = computed(() => {
    return getMetaParents(items.value, path.value, page.value?.title ?? '')
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
      work, products, projects, blog,
      { ...archive, class: content.path.startsWith('/archive/') ? '' : 'hidden' },
    ]

    const right: Link[] = [up.value, search]

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
 * items from root to current page
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
 * items at the same level as current page
 */
export function getMetaSiblings (items: MetaItem[], parentPath: string): MetaItem[] {
  return items.filter(p => getParentPath(p.path) === parentPath)
}

/**
 * items before and after current page
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
