<template>
  <div class="page" :data-path="doc._path">
    <PageHero :page="doc" />
    <h1>{{ doc.title }}</h1>
    <p class="description">
      {{ description }}
    </p>
    <PageInfo v-if="isPost" :doc="doc" />
    <PreviewInfo :doc="doc" />
    <ContentRenderer :value="doc" class="pageContent" />

    <!-- comments -->
    <PageFeedback
      v-if="isPost"
      website-id="6366"
      title="So..."
      :doc="doc"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  doc: ContentItem
}>()

const isPost = computed(() => {
  const ignore = [
    '/bio/',
    '/nuxt-mentor/',
  ]
  return !ignore.some(path => props.doc._path?.startsWith(path))
})

const description = computed(() => props.doc.description)
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
