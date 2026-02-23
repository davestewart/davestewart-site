import { provide, queryContent, readonly, useAsyncData, useRoute } from '#imports'
import { useMetaStore } from '../stores/meta'
import { metaItemsToToc } from '../utils'
import type { PageContent } from '../types'

export function usePage (path?: string) {
  const route = useRoute()
  const pagePath = path ?? route.path

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

    // folder toc
    if (content.type === 'folder') {
      const items = useMetaStore().search({
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

  // provide to children synchronously before awaiting in callers
  provide('page', readonly(res.data))

  return res
}
