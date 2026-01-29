<template>
  <div v-if="component" class="pageHero">
    <component
      :is="component"
      :media="preferred"
      width="100%"
      scale
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isImage, isPlainObject, isVideo } from '~/utils/assert'
import { MediaEmbed, MediaGallery, MediaFeatured, MediaVideo } from '#components'

const props = defineProps<{
  page: ParsedPage
}>()

// Computed
const preferred = computed(() => {
  const { media, hero } = props.page
  if (media) {
    if (hero && media[hero]) {
      return hero
    }
    if (media.featured) {
      return 'featured'
    }
    if (media.gallery) {
      return 'gallery'
    }
    if (media.video) {
      return 'video'
    }
  }
  return ''
})

const component = computed(() => {
  // key
  const key = preferred.value
  if (!key) {
    return null
  }

  // source
  const source = props.page.media?.[key]

  // gallery
  if (Array.isArray(source)) {
    return MediaGallery
  }

  // single type
  const src = isPlainObject(source)
    ? source.src
    : typeof source === 'string'
      ? source
      : ''

  if (isImage(src)) {
    return MediaFeatured
  }

  if (isVideo(src)) {
    return MediaVideo
  }

  return MediaEmbed
})
</script>

<style lang="scss">
.pageHero {
  margin-bottom: 3rem;

  @include sm {
    margin-bottom: 2rem;
  }
}
</style>
