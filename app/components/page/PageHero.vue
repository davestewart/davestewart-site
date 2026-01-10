<template>
  <div v-if="component" class="pageHero">
    <component
      :is="component"
      :page="page"
      scale
      :captions="false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MediaEmbed from '../media/MediaEmbed.vue'
import MediaVideo from '../media/MediaVideo.vue'
import MediaGallery from '../media/MediaGallery.vue'
import MediaFeatured from '../media/MediaFeatured.vue'
import { isImage, isPlainObject, isVideo } from '~/utils/assert'

const props = withDefaults(defineProps<{
  page: ContentItem
  media?: string
}>(), {
  media: 'gallery',
})

// Computed
const preferred = computed(() => {
  const { media, hero } = props.page
  if (media) {
    return media[hero] || media[props.media] || media.gallery || media.video || media.featured
  }
  return null
})

const component = computed(() => {
  const source = preferred.value
  if (!source) {
    return null
  }

  if (Array.isArray(source)) {
    return MediaGallery
  }

  // single type
  const src = isPlainObject(source)
    ? source.src || source.path
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
