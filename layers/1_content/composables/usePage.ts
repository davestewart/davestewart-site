import { provide, queryContent, readonly, useAsyncData, useRoute } from '#imports'
import { useMetaStore } from '../stores/meta'
import { metaItemsToToc } from '../utils'
import type { PageContent } from '../types'

interface UsePageOptions {
  path?: string
  noTitle?: boolean
}

/**
 * Load content, provide it, and update seo
 */
export function usePage (options: UsePageOptions = {}) {
  const route = useRoute()
  const pagePath = options.path ?? route.path
  const noTitle = options.noTitle ?? false

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

    // strip title
    if (noTitle) {
      const elements = content.body?.children || []
      const index = elements.findIndex(element => element.tag === 'h1' && !element?.props?.className)
      if (index > -1) {
        elements.splice(index, 1)
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
