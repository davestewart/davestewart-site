<template>
  <div class="mediaFeatured">
    <MediaImage :source="source" class="mediaFeatured__image" />
    <div v-if="source.text" class="mediaFeatured__text">
      {{ source.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMedia } from '~/composables/useMedia'
import MediaImage from './MediaImage'

const props = withDefaults(defineProps<{
  page: ContentItem
  media?: 'featured' | 'gallery' | 'video'
}>(), {
  media: 'featured',
})
const source = useMedia(props, 'featured')
</script>

<style lang="scss">
.mediaFeatured {
  width: 100%;
  font-size: 0;

  &__image {
    width: 100% !important;
  }

  &__text {
    padding: 1rem;
    text-align: center;
    font-size: 1rem;
  }
}
</style>
