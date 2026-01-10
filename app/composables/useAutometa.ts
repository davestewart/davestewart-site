import { useSeoMeta } from '#imports'

export function useAutometa (page: any) {
  if (!page) return

  const { title, description, image, date, cover, author } = page

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogImage: image?.src || cover?.src,
    ogType: 'article',
    // twitterCard: 'summary_large_image', // defaulted by Nuxt usually or add explicit
  })

  // TODO: Add more advanced logic from metatags.js if needed (e.g. author, canonical)
}
