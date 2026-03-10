import { serverQueryContent } from '#content/server'
import type { PageContent } from '../../../types'
import { z } from 'zod'

const querySchema = z.object({
  path: z.string().optional(),
  noTitle: z.coerce.boolean().optional(),
})

export type PageQuery = z.infer<typeof querySchema>

export default defineEventHandler<{ query: PageQuery }>(async (event): Promise<PageContent | null> => {
  const { path } = await getValidatedQuery(event, querySchema.parse)
  const skip = {
    $not: {
      $or: [
        { status: 'draft' },
        { status: 'scheduled' },
      ],
    },
  }

  return await serverQueryContent(event)
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
})
