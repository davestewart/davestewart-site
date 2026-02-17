import type { PageContent } from '../types'

/**
 * Sets SEO metadata for a page
 * Call this once in each page component
 *
 * @param page - Either PageContent or a plain object with title/description
 */
export function usePageSeo (page: Partial<PageContent> | undefined) {
  const route = useRoute()

  const url = `https://davestewart.co.uk${route.path === '/' ? '' : route.path}`

  const type = page?.type === 'post' ? 'article' : 'website'

  const time = page?.date

  const title = computed(() => {
    return page?.title
      ?? <string>route.meta.title
      ?? ''
  })

  const description = computed(() => {
    return page?.description
      ?? <string>route.meta.description
      ?? ''
  })

  const image = computed(() => {
    const media = page?.media ?? {}
    const { opengraph, featured } = media
    const img = opengraph
      ?? (featured && (typeof featured === 'string') ? featured : undefined) // featured may also be a gallery or embed
      ?? <string>route.meta.image
      ?? '/assets/img/site-preview.png'
    const src = typeof img === 'string' ? img : img?.src
    const url = new URL(src ?? '', 'https://davestewart.co.uk')
    return {
      width: url.searchParams.get('width') ?? 1280,
      height: url.searchParams.get('height') ?? 720,
      url: `https://davestewart.co.uk${url.pathname}`,
    }
  })

  useHead({
    title,
    link: [
      { rel: 'canonical', href: url },
    ],
  })

  useSeoMeta({
    // basic
    title: title.value,
    description: description.value,

    // open graph
    ogTitle: title.value,
    ogDescription: description.value,
    ogSiteName: 'Dave Stewart',
    ogImage: image.value.url,
    ogImageWidth: image.value.width,
    ogImageHeight: image.value.height,
    ogType: type,
    ogUrl: url,

    // twitter
    twitterTitle: title.value,
    twitterDescription: description.value,
    twitterImage: image.value.url,
    twitterCard: 'summary_large_image',

    // article
    articlePublishedTime: time,
    articleAuthor: ['Dave Stewart'],
  })
}
