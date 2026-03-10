import { provide, readonly, shallowRef, useAsyncData, useRoute } from '#imports'

import type { PageQuery as PageOptions } from '@content/server/api/content/page'

export async function usePage (options: PageOptions = {}) {
  const route = useRoute()
  const nuxtApp = useNuxtApp()
  const path = options.path ?? route.path
  const page = shallowRef()

  // provide synchronously during setup so descendants can inject on SSR
  provide('page', readonly(page))

  // fetch raw page
  const res = await fetchPage(path)

  // optionally strip h1 tag from page
  if (res.data.value && options.noTitle) {
    const elements = res.data.value.body?.children || []
    const index = elements.findIndex((element: any) => element.tag === 'h1' && !element.props.className)
    if (index > -1) {
      elements.splice(index, 1)
    }
  }

  // set page
  page.value = res.data.value

  // update seo
  await nuxtApp.runWithContext(() => usePageSeo(res.data.value || undefined))

  // return response
  return res
}
