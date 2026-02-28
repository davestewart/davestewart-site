import { provide, readonly, useAsyncData, useRoute } from '#imports'

import type { PageQuery as PageOptions } from '@content/server/api/content/page'

/**
 * Load content, provide it, and update seo
 */
export function usePage (options: PageOptions = {}) {
  const route = useRoute()
  const nuxtApp = useNuxtApp()

  const path = options.path ?? route.path

  // fetch page data
  const res = useAsyncData(`page-${path}`, async () => {
    const content = await $fetch('/api/content/page', {
      query: {
        path,
        ...options,
      } satisfies PageOptions,
    })

    // update seo on server
    await nuxtApp.runWithContext(() => {
      return usePageSeo(content)
    })

    // return
    return content
  })

  // update seo in client (not sure why we need to do this twice)
  usePageSeo(res.data.value)

  // provide reactive page data to children
  provide('page', readonly(res.data))

  // return the async data object
  return res
}
