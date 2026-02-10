<template>
  <div class="layout__folder">
    <h1>{{ page.title }}</h1>
    <p class="description">
      {{ page.description }}
    </p>
    <div class="pageContent">
      <ContentRenderer v-if="page.body?.children.length" :value="page" />
      <PageTree :items="data.items" :format="options.format" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  page: ParsedPage
}>()

const { path, query } = storeToRefs(useContentStore())

// Options
const options = computed<Partial<SearchOptions>>(() => {
  return {
    mode: 'tree',
    format: 'image',
    ...query.value,
  }
})

const data = computed(() => {
  return searchContent({
    ...options.value,
    path: path.value,
    group: 'path',
  })
})
</script>
