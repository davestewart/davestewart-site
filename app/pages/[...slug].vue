<template>
  <component
    :is="getViewComponent(data)"
    v-if="data"
    :page="data"
  />
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
const { data } = await useAsyncData(`page-${route.path}`, () => {
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

const getViewComponent = (data: ParsedPage | undefined) => {
  if (!data) {
    return NotFound
  }

  switch (data.type) {
    case 'folder':
      return FolderView
    case 'post':
    default:
      return PageView
  }
}
</script>
