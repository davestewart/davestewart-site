<template>
  <div class="mediaFeatured">
    <MediaImage :source="source" class="mediaFeatured__image" />
    <div v-if="source.text" class="mediaFeatured__text">
      {{ source.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveMedia, useMedia } from '../../composables/useMedia'
import type { MediaBase, MediaKey, MediaItem } from '../../composables/useMedia'

// Either a media key, or base media properties
type MediaFeaturedProps =
  | { media: MediaKey, src?: never, width?: never, height?: never, text?: never }
  | { media?: never } & MediaBase & { text: string }

const props = defineProps<MediaFeaturedProps>()

const media = props.src
  ? { src: props.src!, width: props.width, height: props.height }
  : resolveMedia(props.media ?? 'featured')

const source = useMedia(media) as MediaItem
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
