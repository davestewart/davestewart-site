<template>
  <div class="layout__folder">
    <h1>{{ page.title }}</h1>
    <p class="description">
      {{ page.description }}
    </p>
    <div class="pageContent">
      <ContentRenderer v-if="page.body?.children.length" :value="page" class="pageContent__intro" />
      <PageTree :items="data.items" :format="options.format" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'
import useAnchor from '~/composables/useAnchor'

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

const data = computed(() => {
  return metaStore.search({
    ...options.value,
    path: route.path,
    group: 'path',
  })
})

onMounted(() => {
  useAnchor()
})
</script>

<style lang="scss">
.layout__folder > .pageContent {
  .pageContent__intro {
    @include introText;

    p {
      margin: .75em 0;
    }
  }

  & > .pageTree {
    margin-top: 3.5rem;
  }
}
</style>
