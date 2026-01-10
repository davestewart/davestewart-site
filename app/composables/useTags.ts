import { getPosts } from './useNavigation'

/**
 * Sorted list of all tags used in posts
 */
export async function useTags () {
  const posts = await getPosts()

  const set = new Set<string>()
  posts.forEach((post: any) => {
    const tags = post.tags || []
    tags.forEach((tag: string) => set.add(tag))
  })

  const tags = Array.from(set).sort()

  return {
    tags: computed(() => tags || []),
  }
}

/**
 * Hash of all tags and their counts
 */
export async function useTagCounts () {
  const items = await getPosts()

  const counts: Record<string, number> = {}
  items.forEach((page: any) => {
    const tags = page.tags || []
    tags.forEach((tag: string) => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })

  return {
    counts: computed(() => counts.value || {}),
  }
}
