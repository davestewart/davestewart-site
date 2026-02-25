<template>
  <div id="app" :data-path="route.path">
    <NuxtLayout />
    <Preview ref="preview" />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from '#app'
import { useWindowScroll } from '@vueuse/core'
import { type PreviewComponent, registerPreview } from '~/composables/usePreview'
import { useShortcuts } from '~/composables/useShortcuts'
import { useSmoothScroll } from '~/composables/useSmoothScroll'
import type { Preview } from '#components'

const route = useRoute()
const metaStore = useMetaStore()
const { y } = useWindowScroll()
const preview = ref<PreviewComponent>()

// ensure meta store is initialized on server
// @see https://pinia.vuejs.org/ssr/nuxt.html
await callOnce('items', () => metaStore.loadItems())

// setup keyboard shortcuts
useShortcuts()

// setup smooth scroll to link
useSmoothScroll()

// register preview component
onMounted(() => {
  registerPreview(preview.value!)
})

// toggle scroll classes for scroll-to-top element
watch(y, (scrollY) => {
  if (import.meta.client) {
    const scrollBottom = document.body.offsetHeight - scrollY - window.innerHeight
    document.body.classList.toggle('is-scrolled', scrollY > 60)
    document.body.classList.toggle('is-at-end', scrollBottom < 100)
  }
})
</script>
