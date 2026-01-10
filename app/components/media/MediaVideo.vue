<template>
  <div v-if="url" class="mediaVideo">
    <pre>{{ { src, source } }}</pre>
    <iframe
      :src="url"
      :style="source.style"
      sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation allow-presentation"
      allowFullScreen
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMedia } from '~/composables/useMedia'

const props = defineProps({
  media: { type: String, default: 'video' },
  src: String,
  width: [String, Number],
  height: [String, Number],
  scale: { type: Boolean, default: false },
  caption: String,
  page: Object,
})

const source = useMedia(props, 'video')

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
