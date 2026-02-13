<template>
  <div class="homeThumbs">
    <ThumbnailWall v-if="data" :pages="data.items" />
  </div>
</template>

<script setup lang="ts">
import { parseQuery } from '@content/stores/search'
import type { SearchQuery } from '@content/types'

const route = useRoute()

function searchFeatured (query: Partial<SearchQuery>) {
  return useMetaStore().search({
    ...query,
    sort: 'date',
    searchPaths: ['/products/', '/projects/', '/work/', '/blog/'],
    excludeDrafts: true,
    hasThumbnail: true,
    limit: 6,
  })
}

const { data } = await useAsyncData('home-thumbs', async () => {
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
}, {
  watch: [() => route.query],
})
</script>

<style lang="scss">
.homeThumbs {
  .thumbnailWall {
    margin: 3rem 0;
  }
}
</style>
