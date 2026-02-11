import { queryContent, defineStore, useRoute, useNuxtApp } from '#imports'
import { computed, ref } from 'vue'
import type { LocationQuery } from 'vue-router'
import { queryItems, queryTags } from './api'
import { normalizePath } from '../utils/content'

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

export interface TagGroup {
  title: string
  tags: string[]
}

export interface Tag {
  text: string
  count: number
}

// ---------------------------------------------------------------------------------------------------------------------
// store
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Raw content store
 *
 * Loads and manages raw content from the Content API, including:
 *
 * - all metadata items
 * - resolved path
 * - resolved page
 */
export const useContentStore = defineStore('content', () => {
  // ---------------------------------------------------------------------------------------------------------------------
  // properties
  // ---------------------------------------------------------------------------------------------------------------------

  // page route
  const route = useRoute()

  // page path, but *only* once the page has finished loading (this is later that route navigation)
  const path = ref('/')

  // page query, but *only* once the page has finished loading (this is later that route navigation)
  const query = ref<LocationQuery>()

  // page object
  const page = ref<ParsedPage | null>(null)

  // all content items (metadata only)
  const items = ref<ContentItem[]>([])

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
  function getItems (path = '/'): ContentItem[] {
    const normalizedPath = normalizePath(path)
    return items.value.filter(item => item.path.startsWith(normalizedPath))
  }

  /**
   * Get all posts from the target path down
   */
  function getPosts (path = '/'): ContentPage[] {
    return getItems(path).filter(p => p.type === 'post')
  }

  /**
   * Load a page from the content api
   */
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
  // initialisation
  // ---------------------------------------------------------------------------------------------------------------------

  async function initServer () {
    // set initial path value
    path.value = route.path
    query.value = route.query

    // load all data
    const results = await Promise.all([
      // Can't have more than one await @see https://www.youtube.com/watch?v=ofuKRZLtOdY
      queryItems(), // process.env.NODE_ENV as any
      queryTags(),
    ])
    items.value = results[0]
    tagGroups.value = results[1]
  }

  function initClient () {
    // update path when page resolves
    useNuxtApp().hook('page:finish', () => {
      path.value = route.path
      query.value = route.query
    })
  }

  return {
    // route
    path,
    query,

    // tags
    tagGroups,
    tagList,

    // items
    items,
    getItems,
    getPosts,

    // page
    page,
    loadPage,

    // initialisation
    initServer,
    initClient,
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// deprecated
// ---------------------------------------------------------------------------------------------------------------------

type Header = {
  level: number
  title: string
  slug: string
}

/**
 * Logic to generate a flat array of section headers from nested items
 *
 * @param items       An array of potentially nested items
 * @param rootTitle
 */
export function makeHeaders (items: ContentItem[], rootTitle: string): Header[] {
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
 * Sorted list of all tags used in posts
 */
export async function usePostsTags () {
  const store = useContentStore()
  const posts = store.getPosts()

  const set = new Set<string>()
  posts.forEach((post: any) => {
    const tags = post.tags || []
    tags.forEach((tag: string) => set.add(tag))
  })

  const tags = Array.from(set).sort()

  return {
    tags: computed(() => tags || []),
  }
}

/**
 * Hash of all tags and their counts
 */
export async function useTagCounts () {
  const store = useContentStore()
  const items = store.getPosts()

  const counts: Record<string, number> = {}
  items.forEach((page: any) => {
    const tags = page.tags || []
    tags.forEach((tag: string) => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })

  return {
    counts: computed(() => counts.value || {}),
  }
}
