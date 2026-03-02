<template>
  <div class="layout__folder">
    <h1>{{ page.title }}</h1>
    <p class="description">
      {{ page.description }}
    </p>
    <div class="pageContent">
      <ContentRenderer v-if="page.body?.children.length" :value="page" class="pageContent__intro" />
      <PageTree :items="items" :format="options.format" />
    </div>
    <NavSurround />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'
import useAnchor from '@base/composables/useAnchor'

defineProps<{
  page: PageContent
}>()

const route = useRoute()
const metaStore = useMetaStore()

const options = computed<Partial<SearchOptions>>(() => {
  return {
    mode: 'tree',
    format: 'image',
    ...route.query,
  }
})

// extract child folders and pages
const items = computed(() => {
  return metaStore.search({
    ...options.value,
    path: route.path,
    group: 'path',
  }).items
})

// provide folders to any child components
provide('folders', items.value)

onMounted(() => {
  useAnchor()
})
</script>

<style lang="scss">
.layout__folder {

  & > .pageContent {
    .pageContent__intro {
      @include introText;

      p {
        margin: .75em 0;
      }
    }

    & > .pageTree {
      margin-top: 2rem;
    }
  }
}
</style>
