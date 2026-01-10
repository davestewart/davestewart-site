<template>
  <div class="mediaEmbed">
    <iframe :src="source.src" :style="source.style" @load="onLoad"></iframe>
  </div>
</template>

<script setup lang="ts">
import { useMedia } from '~/composables/useMedia'

const props = defineProps({
  media: { type: String, default: 'featured' },
  src: String,
  width: [String, Number],
  height: [String, Number],
  scale: { type: Boolean, default: false },
  caption: String,
  page: Object,
})

const source = useMedia(props, 'featured')

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
