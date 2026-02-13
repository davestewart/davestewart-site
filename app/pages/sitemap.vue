<template>
  <div class="page-sitemap">
    <div class="pageContent">
      <h1>Sitemap</h1>
      <PageTree :items="items" format="text" :depth="0" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Sitemap',
})

const { items } = useMetaStore().search({
  path: '/',
  group: 'path',
})
</script>
