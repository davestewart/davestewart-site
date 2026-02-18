<template>
  <div id="app" :data-path="path">
    <NuxtLayout />
    <Preview ref="preview" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from '#app'
import { useWindowScroll } from '@vueuse/core'
import { setupPreview } from '~/composables/usePreview'
import { useShortcuts } from '~/composables/useShortcuts'
import { useSmoothScroll } from '~/composables/useSmoothScroll'

const { y } = useWindowScroll()

const route = useRoute()
const path = computed(() => route.path)

const preview = setupPreview()

useShortcuts()
useSmoothScroll()

watch(y, (scrollY) => {
  if (import.meta.client) {
    const scrollBottom = document.body.offsetHeight - scrollY - window.innerHeight
    document.body.classList.toggle('is-scrolled', scrollY > 60)
    document.body.classList.toggle('is-at-end', scrollBottom < 100)
  }
})
</script>
