import { useAsyncData } from '#imports'

/**
 * Fetch page content
 *
 * This is a shared handler, used in both the app and middleware.
 *
 * The reason for this is that Nuxt requires a *single* handler
 * function for useAsyncData(), or else you get a warning:
 *
 * ```
 * [nuxt] [useAsyncData] Incompatible options detected for "page-/projects/open-source/spaceman/" (used at <middleware location>):
 * You can use a different key or move the call to a composable to ensure the options are shared across calls.
 * ```
 *
 * Note that useAsyncData()'s response is cached in the first call
 * (the middleware) so in the page call, we already have the data.
 */
export function fetchPage (path: string) {
  return useAsyncData(`page-${path}`, async () => {
    return await $fetch('/api/content/page', {
      query: { path },
    })
  })
}
