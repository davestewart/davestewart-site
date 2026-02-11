import { inject, type InjectionKey, provide, type Ref } from 'vue'
import type { ParsedPage } from '@content/types/page'

const ContentKey: InjectionKey<ParsedPage | undefined> = Symbol('Content')

/**
 * Provides page content to descendant components
 */
export const provideContent = (content: ParsedPage | undefined) => {
  provide(ContentKey, content)
}

interface PageSeoMeta {
  title?: string
  description?: string
}

/**
 * Sets SEO metadata for a page
 * Call this once in each page component
 *
 * @param pageOrMeta - Either a ParsedPage ref or a plain object with title/description
 */
export function usePageSeo (pageOrMeta?: Ref<ParsedPage | undefined> | ParsedPage | PageSeoMeta) {
  // Check if it's a ref (ParsedPage) or plain object (PageSeoMeta)
  const isRef = pageOrMeta && 'value' in pageOrMeta
  const page = isRef ? pageOrMeta as Ref<ParsedPage | undefined> : undefined
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

/**
 * Composable for accessing page content and metadata
 * Use this in descendant components to access page data
 */
export function usePage () {
  const route = useRoute()
  const page = inject(ContentKey, undefined)

  const title = computed(() => {
    return page?.value?.title ?? <string>route.meta.title ?? ''
  })

  const description = computed(() => {
    return page?.value?.description ?? <string>route.meta.description ?? ''
  })

  return {
    page,
    title,
    description,
  }
}
