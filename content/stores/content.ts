import { defineStore, queryContent, useNuxtApp, useRoute } from '#imports'
import { computed, ref } from 'vue'
import { normalizePath } from '../utils'
import { queryItems, queryTags } from './api'
import type { LocationQuery } from 'vue-router'
import type { MetaItem, MetaPost, TagGroup } from '../types'

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
  const page = ref<PageContent | null>(null)

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
   * Load a page from the content api
   */
  async function loadPage (path: string) {
    page.value = await queryContent<PageContent>()
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
