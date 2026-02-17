import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event): Promise<PageContent | null> => {
  const path = getQuery(event).path as string | undefined
  const skip = {
    $not: {
      $or: [
        { status: 'draft' },
        { status: 'scheduled' },
      ],
    },
  }

  // page
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
