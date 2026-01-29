<template>
  <div class="layout__folder">
    <h1>{{ page.title }}</h1>
    <p class="description">
      {{ page.description }}
    </p>

    <!-- content -->
    <div class="pageContent">
      <!-- text -->
      <ContentRenderer v-if="page.body?.children.length" :value="page" />

      <!-- folders -->
      <PageTree v-if="options.mode === 'tree'" :items="tree" :format="options.format" />
      <template v-else>
        <ThumbnailWall v-if="options.format === 'image'" :pages="listPages" />
        <PageList v-else :pages="listPages" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { makeHeaders } from '~/stores/content'

const props = defineProps<{
  page: ParsedPage
}>()

const route = useRoute()

// Options
const options = computed(() => {
  return {
    mode: 'tree',
    format: 'image',
    sort: 'date',
    order: 'desc',
    ...route.query,
  }
})

// Data
// const { tree, pages, headers } = await useNavTree(route.path)

const data = computed(() => getContentTree(props.page._path!))

// const { data } = await useFolder()
const tree = computed(() => data.value?.tree || [])
const pages = computed(() => data.value?.pages || [])

const headers = computed(() => makeHeaders(tree.value, props.page.title))
const toc = computed(() => props.page.toc)

// Filtered pages for list view (legacy: pages not tree)
// useFolder returns { tree, pages } where pages is the flat list of descendants.
// Legacy `pages` computed property:
// .filter(page => page.regularPath !== regularPath)
// .filter(page => !page.frontmatter.layout) // exclude layouts?
// .sort(...)
// We should probably refine `pages` usage here.
// ThumbnailWall expects a list of pages.
const listPages = computed(() => {
  // Filter out folders or specific items if needed
  // Return flat list
  return pages.value.filter((p: any) => p.path !== props.page._path && p.layout !== 'folder')
})
</script>
