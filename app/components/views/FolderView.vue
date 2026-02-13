<template>
  <div class="layout__folder">
    <h1>{{ page.title }}</h1>
    <p class="description">
      {{ page.description }}
    </p>
    <div class="pageContent">
      <ContentRenderer
        v-if="page.body?.children.length"
        :value="page"
        class="pageContent__intro"
      />
      <PageTree :items="data.items" :format="options.format" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  page: PageContent
}>()

const store = usePageStore()

const options = computed<Partial<SearchOptions>>(() => {
  return {
    mode: 'tree',
    format: 'image',
    ...store.query,
  }
})

const data = computed(() => {
  return useMetaStore().search({
    ...options.value,
    path: store.path,
    group: 'path',
  })
})
</script>

<style lang="scss">
.layout__folder > .pageContent {
  .pageContent__intro {
    @include introText;

    font-size: 1.4em;
    p {
      margin: .75em 0;
    }
  }

  & > .pageTree {
    margin-top: 3.5rem;
  }
}
</style>
