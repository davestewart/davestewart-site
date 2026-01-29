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
import type { ParsedPage } from '#shared/types/content'

const route = useRoute()

/**
 * All content pages
 */
const { data, error } = await useAsyncData(`page-${route.path}`, () => {
  // @see https://v2.content.nuxt.com/usage/typescript#type-augmentation
  return queryContent<ParsedPage>()
    .where({
      $or: [
        { _path: route.path },
        { permalink: route.path },
      ],
    })
    .findOne()
})

provideContent(data)
usePageSeo(data)

const getViewComponent = (content: ParsedPage | undefined) => {
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
