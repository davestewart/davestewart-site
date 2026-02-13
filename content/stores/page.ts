import { ref, defineStore, queryContent, useNuxtApp, useRoute } from '#imports'
import { metaItemsToToc } from '../utils'
import type { LocationQuery } from 'vue-router'

/**
 * # Page Store
 *
 * Loads and manages raw content from the Content API.
 *
 * The main thing to know about this store is that it tracks separately:
 *
 * - settled page
 * - settled path and query
 *
 * The path and query update only *once* the page has finished loading, which is always
 * later that route navigation. This allows computed properties in the Meta store to
 * visually update *only* when the page "appears" loaded.
 *
 * If the update was triggered instead by the router path, then the page's navigation,
 * such as surround, parent, etc. would visually update *before* the page had finished
 * unloading, so things like related links would be wrong for a few 10ths of a second,
 * when clicking on links, etc.
 */
export const usePageStore = defineStore('page', () => {
  // ---------------------------------------------------------------------------------------------------------------------
  // properties
  // ---------------------------------------------------------------------------------------------------------------------

  // page route
  const route = useRoute()

  // settled page path
  const path = ref('/')

  // settled page query
  const query = ref<LocationQuery>()

  // page object
  const page = ref<PageContent | null>(null)

  // the page's children (0-length for posts)
  const children = ref<MetaItem[]>([])

  /**
   * Load a page from the content api
   */
  async function loadPage (path: string) {
    // page
    const content = await queryContent<PageContent>()
      .where({
        $or: [
          { _path: path },
          { permalink: path },
        ],
      })
      .findOne()

    // children and toc
    if (content.type === 'folder') {
      const items = useMetaStore().search({
        ...query.value,
        path,
        group: 'path',
      }).items
      children.value = items
      if (content.body) {
        content.body.toc = metaItemsToToc(items)
      }
    }
    else {
      children.value = []
    }

    // set page
    page.value = content

    // return the page
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

    // content
    children,

    // initialisation
    initServer,
    initClient,
  }
})
