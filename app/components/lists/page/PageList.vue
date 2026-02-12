<template>
  <ul class="pageList">
    <PageItem
      v-for="page in pages"
      :key="page.path"
      :page="page"
    />
  </ul>
</template>

<script setup lang="ts">
import PageItem from './PageItem.vue'

defineProps<{
  pages: PageContent[]
}>()
</script>

<style lang="scss">
.pageList {
  margin: 0 0 0 2rem;
  padding: 0;
  list-style: none;
}
</style>
