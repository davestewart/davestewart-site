export default defineNuxtRouteMiddleware(async () => {
  const redirect = () => navigateTo('https://davestewart.co.uk', { external: true })
  const headers = useRequestHeaders()
  const host = headers['host'] ?? ''

  // always redirect from top-level davestewart.io
  if (host === 'davestewart.io') {
    return redirect()
  }

  // otherwise, check for subdomain and validate it
  // this only works on davestewart.io and localhost
  const match = host.match(/^([^.]+)\.(davestewart\.io|localhost)/)
  const showcase = match?.[1] ?? null
  if (showcase) {
    const data = await $fetch('/api/content/page', {
      query: { path: `/${showcase}/` },
    })

    // if subdomain but no data, redirect
    if (!data) {
      return redirect()
    }
  }

  // finally, set showcase or null state
  useState('showcase', () => showcase)
})
