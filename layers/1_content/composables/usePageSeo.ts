import type { PageMedia } from '../types'

export function parseMedia (media: PageMedia = {}) {
  let candidate = media.opengraph ?? media.featured ?? media.gallery

  // candidate is an array
  if (Array.isArray(candidate)) {
    candidate = candidate[0]
  }

  // no candidate
  if (!candidate) {
    candidate = { src: '/assets/img/site-preview.png' }
  }

  // string; convert to media source
  else if (typeof candidate === 'string') {
    candidate = { src: candidate }
  }

  // process media source
  const domain = 'https://davestewart.co.uk'
  const url = new URL(candidate.src, domain)
  return {
    width: url.searchParams.get('width') ?? 1280,
    height: url.searchParams.get('height') ?? 720,
    url: `${domain}${url.pathname}`,
  }
}

/**
 * Sets SEO metadata for a page
 * Call this once in each page component
 *
 * @param page - Either PageContent or a plain object with title/description
 */
export function usePageSeo (page?: Partial<PageContent>) {
  const route = useRoute()

  const url = `https://davestewart.co.uk${route.path === '/' ? '' : route.path}`

  const type = page?.type === 'post' ? 'article' : 'website'

  const time = page?.date

  const title = page?.title
    ?? <string>route.meta.title
    ?? ''

  const description = page?.description
    ?? <string>route.meta.description
    ?? ''

  const image = parseMedia(page?.media)

  useHead({
    title,
    link: [
      { rel: 'canonical', href: url },
    ],
  })

  useSeoMeta({
    // basic
    title,
    description,

    // open graph
    ogTitle: title,
    ogDescription: description,
    ogSiteName: 'Dave Stewart',
    ogImage: image.url,
    ogImageWidth: image.width,
    ogImageHeight: image.height,
    ogType: type,
    ogUrl: url,

    // twitter
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image.url,
    twitterCard: 'summary_large_image',

    // article
    articlePublishedTime: time,
    articleAuthor: ['Dave Stewart'],
  })
}
