import { provide, queryContent, readonly, useAsyncData, useRoute, useNuxtApp } from '#imports'
import { useMetaStore } from '../stores/meta'
import { metaItemsToToc } from '../utils'
import type { PageContent } from '../types'

/**
 * Load content, provide it, and update seo
 *
 * @param path Optional page path (defaults to current route)
 * @returns Async data object
 */
export function usePage(path?: string) {
  const route = useRoute()
  const pagePath = path ?? route.path

  const nuxtApp = useNuxtApp()
  const metaStore = useMetaStore()

  // fetch page data
  const res = useAsyncData(`page-${pagePath}`, async () => {
    const skip = {
      $not: {
        $or: [
          { status: 'draft' },
          { status: 'scheduled' },
        ],
      },
    }

    // page
    const content = await queryContent<PageContent>()
      .where({
        $or: [
          { _path: pagePath },
          { permalink: pagePath },
        ],
        ...process.env.NODE_ENV === 'production'
          ? skip
          : {},
      })
      .findOne()

    // During Nuxt static generation, nitro worker resets Pinia state but does not rerun plugins.
    // We restore it here, preserving the scoped context for relative $fetch capabilities
    if (process.server && metaStore.items.length === 0) {
      await nuxtApp.runWithContext(() => metaStore.initServer())
    }

    // update folders with child folder toc
    if (content && content.type === 'folder') {
      const items = metaStore.search({
        ...route.query,
        path: pagePath,
        group: 'path',
      }).items

      if (content.body) {
        content.body.toc = metaItemsToToc(items)
      }
    }

    return content
  })

  // provide reactive data to children synchronously before awaiting in callers
  provide('page', readonly(res.data))

  // update seo when loaded
  watchEffect(() => {
    const content = res.data.value
    if (res.data.value) {
      usePageSeo(res.data.value)
      if (content && content.type === 'folder') {
        const items = metaStore.search({
          ...route.query,
          path: pagePath,
          group: 'path',
        }).items

        if (content.body) {
          content.body.toc = metaItemsToToc(items)
        }
      }
    }
  })

  // return the async data object
  return res
}
