export default defineNuxtRouteMiddleware(async () => {
  const host = useRequestHeaders(['host'])['host'] ?? ''
  const match = host.match(/^([^.]+)\.(davestewart\.io|localhost)/)
  const showcase = match?.[1] ?? null
  if (showcase) {
    const { data } = await fetchPage(`/${showcase}/`)
    if (!data.value) {
      navigateTo('https://davestewart.co.uk', {
        external: true,
      })
    }
  }
  useState('showcase', () => showcase)
})
