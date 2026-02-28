import { serverQueryContent } from '#content/server'
import type { PageContent } from '../../../types'
import { z } from 'zod'

const querySchema = z.object({
  path: z.string().optional(),
  noTitle: z.coerce.boolean().optional(),
})

export type PageQuery = z.infer<typeof querySchema>

export default defineEventHandler<{ query: PageQuery }>(async (event): Promise<PageContent | null> => {
  const { path, noTitle } = await getValidatedQuery(event, querySchema.parse)
  const skip = {
    $not: {
      $or: [
        { status: 'draft' },
        { status: 'scheduled' },
      ],
    },
  }

  // page
  const page = await serverQueryContent(event)
    .where({
      $or: [
        { _path: path },
        { permalink: path },
      ],
      ...process.env.NODE_ENV === 'production'
        ? skip
        : {},
    })
    .findOne() as PageContent

  // optionally strip h1 tag from page
  if (page && noTitle) {
    const elements = page.body?.children || []
    const index = elements.findIndex((element: any) => element.tag === 'h1' && !element.props.className)
    if (index > -1) {
      elements.splice(index, 1)
    }
  }

  // return
  return page
})
