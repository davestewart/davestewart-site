<template>
  <component :is="component" v-if="data" :page="data" />
  <NotFound v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageView from '~/components/views/PageView.vue'
import FolderView from '~/components/views/FolderView.vue'
import NotFound from '~/components/views/404View.vue'

const { data, error } = await usePage()

if (data.value) {
  usePageSeo(data.value)
}

const component = computed(() => {
  if (error.value || !data.value) {
    console.warn('Not Found', {
      error: error.value,
      data: data.value,
    })
    return NotFound
  }

  switch (data.value.type) {
    case 'folder':
      return FolderView
    case 'post':
      return PageView
    default:
      return PageView
  }
})
</script>
