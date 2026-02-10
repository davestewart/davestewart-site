import { computed } from 'vue'
import { getParentPath } from '~/utils/content'
import { type ContentItem } from './content'

export type Link = {
  path: string
  title: string
  description?: string
  class?: string
}

/**
 * Manages site navigation
 */
export const useNavStore = defineStore('nav', () => {
  const content = useContentStore()

  const path = toRef(content, 'path')

  const page = toRef(content, 'page')

  // ---------------------------------------------------------------------------------------------------------------------
  // navigation
  // ---------------------------------------------------------------------------------------------------------------------

  function getItem (path: string) {
    return content.getItems().find(item => item.path === path)
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

  const up = computed<Link>(() => {
    const parents = getContentParents(content.path, 'Up')
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

  // computed
  const surround = computed(() => {
    return getContentSurround(path.value)
  })

  const siblings = computed(() => {
    return getContentSiblings(path.value)
  })

  const breadcrumbs = computed(() => {
    return getContentParents(path.value, page.value?.title ?? '')
  })

  return {
    sections,
    surround,
    siblings,
    breadcrumbs,
    top,
    up,
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * items from root to current page
 */
export function getContentParents (path: string, fallbackTitle = '404'): Link[] {
  // variables
  const items = useContentStore().getItems('/')
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
export function getContentSiblings (path: string): ContentItem[] {
  const parentPath = getParentPath(path)
  const store = useContentStore()
  const items = store.getItems(parentPath)
  return items.filter(p => getParentPath(p.path) === parentPath)
}

/**
 * items before and after current page
 */
export function getContentSurround (path: string) {
  const store = useContentStore()
  const posts = store.getPosts()
  const index = posts.findIndex((p: any) => p.permalink === path || p.path === path)
  if (index > -1) {
    return [
      posts[index - 1],
      posts[index + 1],
    ] as const
  }
  return [undefined, undefined] as const
}
