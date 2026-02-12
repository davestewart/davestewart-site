import { type Ref } from 'vue'
import type { PageContent } from '../types'

interface PageSeoMeta {
  title?: string
  description?: string
}

/**
 * Sets SEO metadata for a page
 * Call this once in each page component
 *
 * @param pageOrMeta - Either a PageContent ref or a plain object with title/description
 */
export function usePageSeo (pageOrMeta?: Ref<PageContent | undefined> | PageContent | PageSeoMeta) {
  // Check if it's a ref (PageContent) or plain object (PageSeoMeta)
  const isRef = pageOrMeta && 'value' in pageOrMeta
  const page = isRef ? pageOrMeta as Ref<PageContent | undefined> : undefined
  const meta = !isRef ? pageOrMeta as PageSeoMeta : undefined

  const route = useRoute()

  const url = `https://davestewart.co.uk${route.path === '/' ? '' : route.path}`

  const type = page?.value?.type === 'post' ? 'article' : 'website'

  const time = page?.value?.date

  const title = computed(() => {
    return meta?.title
      ?? page?.value?.title
      ?? <string>route.meta.title
      ?? ''
  })

  const description = computed(() => {
    return meta?.description
      ?? page?.value?.description
      ?? <string>route.meta.description
      ?? ''
  })

  const image = computed(() => {
    const media = page?.value?.media ?? {}
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

  const payload = {
    ogSiteName: 'Dave Stewart',
    title: title.value,
    ogTitle: title.value,
    description: description.value,
    ogDescription: description.value,
    ogUrl: url,
    ogImage: image.value.url,
    ogImageWidth: image.value.width,
    ogImageHeight: image.value.height,
    twitterCard: 'summary_large_image' as any,
    ogArticlePublishedTime: time,
    ogType: type as any,
  }

  useSeoMeta(payload)
}
