import { computed } from 'vue'
import { getPosts } from './content'

// ---------------------------------------------------------------------------------------------------------------------
// types
// ---------------------------------------------------------------------------------------------------------------------

interface TagGroup {
  title: string
  tags: string[]
}

interface Tag {
  text: string
  count: number
}

// ---------------------------------------------------------------------------------------------------------------------
// store
// ---------------------------------------------------------------------------------------------------------------------

export const useSearchStore = defineStore('search', () => {
  const tagGroups = ref<TagGroup[]>([])

  const tagList = computed(() => {
    return tagGroups.value
      .map(group => group.tags)
      .flat()
      .sort()
  })

  // initializers
  async function initServer () {
    tagGroups.value = await queryTags()
  }

  function initClient () {
    // nothing, for now
  }

  return {
    // values
    tagGroups,
    tagList,

    // initializers
    initServer,
    initClient,
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Query Nuxt Content for tags.json
 */
export async function queryTags (): Promise<TagGroup[]> {
  // grab raw data
  const data = await queryContent('tags')
    .where({ _extension: 'yaml' })
    .findOne()
    .catch((err) => {
      console.error('[queryTags] Error:', err)
      return {} as Record<string, string[]>
    })

  // grab tag data only
  const keys = Object.keys(data)
  const tags = keys.reduce((acc, key) => {
    if (/^[A-Z]/.test(key)) {
      acc[key] = data[key]
    }
    return acc
  }, {} as Record<string, string[]>)

  // return tags with titles, etc
  return Object.entries(tags).map(([title, tags]) => ({ title, tags }))
}

// ---------------------------------------------------------------------------------------------------------------------
// deprecated
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Sorted list of all tags used in posts
 */
export async function usePostsTags () {
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
