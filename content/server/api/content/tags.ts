import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  // grab content data
  const data = await serverQueryContent(event, 'tags')
    .where({ _extension: 'yaml' })
    .findOne()

  // filter tag data only
  const keys = Object.keys(data)
  const tags = keys.reduce((acc, key) => {
    if (!/^_/.test(key) && Array.isArray(data[key])) {
      acc[key] = data[key]
    }
    return acc
  }, {} as Record<string, string[]>)

  // return tags with titles, etc
  return Object
    .entries(tags)
    .map(([title, tags]) => ({ title, tags }))
})
