<template>
  <div class="homeThumbs">
    <ThumbnailCarousel v-if="data" v-model="carouselIndex" :pages="data" />
  </div>
</template>

<script setup lang="ts">
import { parseQuery } from '@content/stores/search'
import type { SearchQuery } from '@content/types'

const route = useRoute()

function searchFeatured (query: Partial<SearchQuery>) {
  return useMetaStore().search({
    ...query,
    // sort: 'date',
    searchPaths: ['/products/', '/projects/', '/work/', '/blog/'],
    excludeDrafts: true,
    hasThumbnail: true,
    randomize: true,
    // limit: 6,
  })
}

const carouselIndex = useState('home-thumbs-carousel-index', () => 0)

const queryKey = computed(() => JSON.stringify(route.query))

const { data: result } = await useAsyncData(
  () => `home-thumbs-${queryKey.value}`,
  async () => {
    // user clicked a link
    if (route.fullPath.includes('?')) {
      const query = parseQuery(route.fullPath.slice(2))
      return searchFeatured(query)
    }
    // default options
    return searchFeatured({
      tags: ['featured'],
      randomize: true,
    })
  },
  {
    getCachedData: (key) => {
      return useNuxtApp().static.data[key] || useNuxtApp().payload.data[key]
    },
  },
)

const data = computed(() => result.value?.items || [])
</script>

<style lang="scss">
.homeThumbs {
  .thumbnailCarousel {
    margin: 2rem 0;
  }
}
</style>
