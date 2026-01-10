<template>
  <div class="layout__folder">
    <h1>{{ doc.title }}</h1>
    <p class="description">
      {{ doc.description }}
    </p>

    <!-- content -->
    <div class="pageContent">
      <!-- text -->
      <ContentRenderer v-if="doc.body.children.length" :value="doc" />

      <!-- navigation -->
      <NavToc v-if="toc" :headers="headers" :level="toc" />

      <!-- folders -->
      <PageTree v-if="options.mode === 'tree'" :items="tree" :format="options.format" />
      <template v-else>
        <ThumbnailWall v-if="options.format === 'image'" :pages="listPages" />
        <PageList v-else :pages="listPages" />
      </template>

      <!-- after -->
      <!-- <Content slot-key="after" class="pageContent pageContent--bottom"/> -->
      <!-- Nuxt Content 3 doesn't support slots like this easily without MDC components or slots in MD.
           Assuming 'after' was a slot in the markdown file?
           If standard markdown, it's just content. If specific slot, we need a way to target it.
           Legacy VuePress slot-key="after" implies named slot content.
           We might skip for now or use a custom component logic. -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { makeHeaders } from '~/composables/useNavigation'

const props = defineProps<{
  doc: any
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

const { data } = useAsyncData(`folder-${route.path}`, () => {
  return getNavTree(route.path)
})

// const { data } = await useFolder()
const tree = computed(() => data.value?.tree || [])
const pages = computed(() => data.value?.pages || [])

const headers = computed(() => makeHeaders(tree.value, props.doc.title))
const toc = computed(() => props.doc.toc)

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
  return pages.value.filter((p: any) => p.path !== route.path && p.layout !== 'folder')
})
</script>
