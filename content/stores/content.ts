import { defineStore, queryContent, useNuxtApp, useRoute } from '#imports'
import { ref } from 'vue'
import type { LocationQuery } from 'vue-router'

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
    path.value = route.path
    query.value = route.query
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

    // page
    page,
    loadPage,

    // initialisation
    initServer,
    initClient,
  }
})
