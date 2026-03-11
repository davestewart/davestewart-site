export default defineNuxtRouteMiddleware(async () => {
  const headers = useRequestHeaders()
  const host = headers['host'] ?? ''
  const match = host.match(/^([^.]+)\.(davestewart\.io|localhost)/)
  const showcase = match?.[1] ?? null

  if (showcase) {
    const data = await $fetch('/api/content/page', {
      query: { path: `/${showcase}/` },
    }) ?? null

    if (!data) {
      navigateTo('https://davestewart.co.uk', {
        external: true,
      })
    }
  }

  useState('showcase', () => showcase)
})
