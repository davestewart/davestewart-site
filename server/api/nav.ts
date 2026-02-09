import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const docs = await serverQueryContent(event)
    .sort({ _path: 1 })
    .find()

  return docs.map(doc => doc._path)
})
