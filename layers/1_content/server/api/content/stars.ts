import { serverQueryContent } from '#content/server'

export default defineCachedEventHandler(async (event) => {
  const token = useRuntimeConfig().githubToken

  // get items with github links
  const items = await serverQueryContent(event)
    .only([
      '_path',
      'github',
    ])
    .where({
      _extension: 'md',
      github: { $exists: true },
    })
    .find()

  // query github api
  const results = await Promise.all(
    items.map(async (item) => {
      const { _path, github } = item
      const data = await $fetch(`https://api.github.com/repos/${github}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) as any
      return {
        path: _path,
        stars: data?.stargazers_count || 0,
      }
    }),
  )

  // return as a lookup object
  return {
    cachedAt: new Date().toISOString(),
    data: Object.fromEntries(
      results.map(r => [r.path, r.stars]),
    ),
  }
}, {
  maxAge: 60 * 60 * 24, // 1 day
})
