<template>
  <div class="homeThumbs">
    <ThumbnailWall :pages="pages" />
  </div>
</template>

<script setup lang="ts">
import { parseQuery, searchFeatured } from '~/stores/search'

const route = useRoute()

const { data: pages } = await useAsyncData('home-thumbs', async () => {
  if (route.hash.length) {
    const query = parseQuery(route.hash)
    return searchFeatured(query)
  }
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
