<template>
  <div class="page" :data-path="page._path">
    <PageHero :page="page" />
    <h1>{{ page.title }}</h1>
    <p class="description">
      {{ page.description }}
    </p>
    <PageInfo v-if="isPost" :page="page" />
    <PreviewInfo :page="page" />
    <ContentRendererMarkdown
      :value="page"
      class="pageContent"
    />

    <!-- comments -->
    <PageFeedback v-if="isPost" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageFeedback from '../page/PageFeedback.vue'

const props = defineProps<{
  page: ParsedPage
  info?: boolean
}>()

const isPost = computed(() => {
  const ignore = [
    '/bio/',
    '/nuxt-mentor/',
  ]
  return !ignore.some(path => props.page._path?.startsWith(path))
})
</script>

<style lang="scss">
.pageContent.is-scheduled {
  position: relative;
  height: 500px;
  overflow: hidden;

  &:after {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    bottom: 0;
    content: " ";
    background: linear-gradient(0deg, white, transparent);
  }
}
</style>
