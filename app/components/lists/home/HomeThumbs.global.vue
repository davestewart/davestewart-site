<template>
  <div class="homeThumbs">
    <ThumbnailWall v-if="data" :pages="data.items" />
  </div>
</template>

<script setup lang="ts">
import { parseQuery, type SearchQuery } from '@content/stores/search'

const route = useRoute()

function searchFeatured (query: Partial<SearchQuery>, randomize = false) {
  return searchContent({
    ...query,
    sort: 'date',
    randomize,
    searchPaths: ['/products/', '/projects/', '/work/', '/blog/'],
    excludeDrafts: true,
    hasThumbnail: true,
    limit: 6,
  })
}

const { data } = await useAsyncData('home-thumbs', async () => {
  // user clicked a link
  if (route.hash.length) {
    const query = parseQuery(route.hash)
    return searchFeatured(query)
  }
  // default options
  return searchFeatured({
    tags: ['featured'],
  }, true)
}, {
  watch: [() => route.hash],
})
</script>

<style lang="scss">
.homeThumbs {
  .thumbnailWall {
    margin: 3rem 0;
  }
}
</style>
