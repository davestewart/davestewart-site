<template>
  <div class="page-search">
    <SearchView />
  </div>
</template>

<script setup lang="ts">
import SearchView from '~/components/views/SearchView.vue'

definePageMeta({
  title: 'Search',
  description: 'Search results',
})

usePageSeo()
</script>
