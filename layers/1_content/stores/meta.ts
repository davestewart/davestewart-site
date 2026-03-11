import { computed, defineStore, getPath } from '#imports'
import { getMetaParents, getMetaSiblings, getMetaSurround, getParentPath } from '../utils'
import { queryItems } from '../utils/search'
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

  // whether we're filtering by showcase
  const isShowcase = ref(false)

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
   * Get a single item by path
   */
  function getItem (path: string): MetaItem | undefined {
    return items.value.find(item => getPath(item) === path || item.path === path)
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

  async function loadItems (showcase = '') {
    // showcase
    isShowcase.value = !!showcase

    // Can't have more than one await
    // @see https://www.youtube.com/watch?v=ofuKRZLtOdY
    const results = await Promise.all([
      $fetch('/api/content/meta', { query: { showcase } }),
      $fetch('/api/content/tags'),
    ])

    // set items
    const [_items, _tagGroups] = results
    items.value = _items

    // get used tags
    const allTags = new Set<string>()
    for (const item of items.value) {
      if (item.type === 'post' && item.tags) {
        for (const tag of item.tags) {
          allTags.add(tag)
        }
      }
    }

    // filter tag groups
    if (_tagGroups) {
      for (const tagGroup of _tagGroups) {
        tagGroup.tags = tagGroup.tags.filter(tag => allTags.has(tag))
      }

      // assign filtered tags
      tagGroups.value = _tagGroups.filter(tagGroup => tagGroup.tags.length > 0)
    }
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
  const info = createLink('/projects/personal/dave-stewart/', 'Site', 'Info and site source code')
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
    const items = (isShowcase.value ? getPosts() : getItems())
      .filter(p => p.type === 'post'
        ? p.status !== 'draft' && p.status !== 'unlisted'
        : true)
    return getMetaSurround(items, path)
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
    // the real path (path might be a permalink)
    const realPath = getItem(path)?.path ?? '/'

    // showcase posts are clipped to a depth of 1
    const maxDepth = isShowcase.value ? 1 : undefined

    // get parent
    const parentPath = getParentPath(realPath, maxDepth)
    const parent = getItem(parentPath)

    // return something the UI can use
    return {
      title: 'Up',
      path: parent?.path ?? '/',
      description: `Go up to ${parent?.title}`,
      class: `up ${parent?.path === realPath ? 'hidden' : ''}`,
    } satisfies Link
  }

  function getTop (path: string) {
    const left: Link[] = [
      // main entries
      work, products, projects, blog,
      // only show archive if in archive path
      { ...archive, class: path.startsWith('/archive/') ? '' : 'hidden' },
    ]

    const right: Link[] = [
      getUp(path),
      siteSearch,
    ]

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
    getItem,
    search,

    // showcase
    isShowcase,

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
    loadItems,
  }
})
