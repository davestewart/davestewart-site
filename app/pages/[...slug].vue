<template>
  <component :is="getViewComponent(doc)" :doc="doc" />
</template>

<script setup lang="ts">
import Folder from '~/components/views/Folder.vue'
import Page from '~/components/views/Page.vue'
import NotFound from '~/components/views/NotFound.vue'

const route = useRoute()

const { data: doc } = await useAsyncData(`page-${route.path}`, () => {
  return queryContent()
    .where({
      $or: [
        { _path: route.path },
        { permalink: route.path },
      ],
    })
    .findOne()
})

provideContent(doc)

const getViewComponent = (doc: any) => {
  // If no doc found, show 404
  if (!doc) {
    return NotFound
  }

  const layout = doc.layout || doc.meta?.layout || (doc.home ? 'home' : 'page')

  // Views are strictly standard layouts
  switch (layout.toLowerCase()) {
    case 'folder':
      return Folder
    case 'page':
    default:
      return Page
  }
}
</script>
