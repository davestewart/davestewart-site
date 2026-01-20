<template>
  <div class="page-sitemap">
    <h1>Sitemap</h1>
    <PageTree :items="data?.tree" format="text" :depth="0" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Sitemap',
})

const data = computed(() => getContentTree('/'))
</script>
