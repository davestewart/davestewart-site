<template>
  <div class="mediaEmbed">
    <iframe :src="source.src" :style="source.style" @load="onLoad" />
  </div>
</template>

<script setup lang="ts">
import { resolveMedia, useMedia } from '@content/composables/useMedia'
import type { MediaBase, MediaItem, MediaKey } from '@content/types'

// Either a media key, or base media properties
type MediaEmbedProps =
  | { media: MediaKey, src?: never, width?: never, height?: never }
  | { media?: never } & MediaBase

const props = defineProps<MediaEmbedProps>()

const media = props.src
  ? { src: props.src!, width: props.width, height: props.height }
  : resolveMedia(props.media ?? 'embed')

const source = useMedia(media) as MediaItem

function onLoad (event: Event) {
  (event.target as HTMLElement).style.opacity = '1'
}
</script>

<style lang="scss">
.mediaEmbed {
  display: flex;
  width: 100%;
  border: none;

  @include striped(#EEE, #FFF);

  iframe {
    overflow: hidden;
    transition: .5s opacity;
    opacity: 0;
  }
}
</style>
