import { z } from 'zod'
import { serverQueryContent } from '#content/server'
import type { PageContent } from '@content/types'

const querySchema = z.object({
  path: z.string().optional(),
})

export type PageQuery = z.infer<typeof querySchema>

/**
 * Attempts to load a showcase page, then grab its frontmatter `pages` object
 *
 * These items are used to filter the site to just the showcase items
 */
export default defineEventHandler<{ query: PageQuery }>(async (event) => {
  const { path } = await getValidatedQuery(event, querySchema.parse)
  if (path) {
    const page = await serverQueryContent(event)
      .where({
        $or: [
          { _path: path },
          { permalink: path },
        ],
      })
      .findOne() as PageContent
    if (page) {
      // get page paths
      return Object
        .values(page.pages ?? {})
        .flat()
        .filter(item => typeof item === 'string')
        .map(item => item.replace('https://davestewart.co.uk', ''))
    }
  }
})
