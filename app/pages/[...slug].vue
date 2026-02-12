<template>
  <component
    :is="getViewComponent(data)"
    v-if="data"
    :page="data"
  />
  <NotFound v-else />
</template>

<script setup lang="ts">
import PageView from '~/components/views/PageView.vue'
import FolderView from '~/components/views/FolderView.vue'
import NotFound from '~/components/views/404View.vue'

const route = useRoute()
const store = useContentStore()

/**
 * All content pages
 */
const { data, error } = await useAsyncData(`page-${route.path}`, () => {
  return store.loadPage(route.path)
})

usePageSeo(data)

const getViewComponent = (content: PageContent | undefined) => {
  if (error.value || !content) {
    return NotFound
  }

  switch (content.type) {
    case 'folder':
      return FolderView
    case 'post':
      return PageView
    default:
      return PageView
  }
}
</script>
