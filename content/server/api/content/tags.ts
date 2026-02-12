import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  // grab raw data
  const data = await serverQueryContent(event, 'tags')
    .where({ _extension: 'yaml' })
    .findOne()
    .catch((err) => {
      console.error('[queryTags] Error:', err)
      return {} as Record<string, string[]>
    })

  // grab tag data only
  const keys = Object.keys(data)
  const tags = keys.reduce((acc, key) => {
    if (/^[A-Z]/.test(key)) {
      acc[key] = data[key]
    }
    return acc
  }, {} as Record<string, string[]>)

  // return tags with titles, etc
  return Object
    .entries(tags)
    .map(([title, tags]) => ({ title, tags }))
})
