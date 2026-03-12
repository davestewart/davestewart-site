<template>
  <div class="layout__page" :data-path="page._path">
    <PageHero :page="page" />
    <h1>{{ page.title }}</h1>
    <p class="description">
      {{ page.description }}
    </p>
    <PageInfo v-if="isPost" :page="page" />
    <ContentRendererMarkdown :value="page" class="pageContent" />

    <!-- comments -->
    <PageFeedback v-if="isPost && !store.isShowcase" />

    <!-- prev / next -->
    <NavSurround />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageFeedback from '../page/PageFeedback.vue'

const props = defineProps<{
  page: PageContent
  info?: boolean
}>()

const store = useMetaStore()

const isPost = computed(() => {
  const ignore = [
    '/bio/',
    '/nuxt-mentor/',
  ]
  return !ignore.some(path => props.page._path?.startsWith(path))
})
</script>

<style lang="scss">
.layout__inner:has(.pageContent) {
  padding-bottom: 0;
}
</style>
