<template>
  <ThumbnailWall :pages="pages" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { parseQuery, searchFeatured } from '~/stores/search'

// const props = defineProps<{
//   featured: ContentItem[]
// }>()

const { data: featured } = await useAsyncData('home-thumbs', async () => {
  return await searchFeatured({
    tags: ['featured'],
  }, true)
})

const route = useRoute()
const pages = ref<ContentItem[]>(featured.value ?? [])

watch(
  () => route.hash,
  () => {
    const query = parseQuery(route.hash)
    pages.value = searchFeatured(query)
  },
)
</script>

<style lang="scss">
.homeThumbs {

  .thumbnailWall {
    margin: 3rem 0;
  }

  a {
    color: $grey-lighter;
    //text-decoration: underline;
  }

  a.active {
    color: $accentColor;
    //text-decoration: none;

    &:after {
      //content: "*";
    }
  }

  a:not(.active):not(:hover) {
    text-decoration: underline;
    text-decoration-style: dotted;
  }
}
</style>
