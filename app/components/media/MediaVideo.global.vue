<template>
  <div v-if="url" class="mediaVideo">
    <iframe
      :src="url"
      :style="source.style"
      sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation allow-presentation"
      allowFullScreen
    />
  </div>
</template>

<script setup lang="ts">
import { resolveMedia, useMedia } from '@content/composables/useMedia'
import type { MediaKey, MediaBase, MediaItem } from '@content/types'

// Either a media key, or base media properties
type MediaEmbedProps =
  | { media: MediaKey, src?: never, width?: never, height?: never }
  | { media?: never } & MediaBase

const props = defineProps<MediaEmbedProps>()

const media = props.src
  ? { src: props.src!, width: props.width, height: props.height }
  : resolveMedia(props.media ?? 'video')

const source = useMedia(media) as MediaItem

const url = computed(() => {
  const src = source.src
  if (src) {
    if (/vimeo/.test(src)) {
      return `${src}?title=0&amp;byline=0&amp;portrait=0&amp;color=000000`
    }
    if (/youtube|youtu.be/.test(src)) {
      return `${src}?rel=0&modestbranding=1&autohide=1&showinfo=0`
    }
    return src
  }
  return ''
})
</script>

<style lang="scss">
.mediaVideo {
  margin-bottom: 1rem;
  font-size: 0;
}
</style>
