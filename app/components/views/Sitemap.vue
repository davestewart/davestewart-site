<template>
  <div class="layout__sitemap">
    <h1>Sitemap</h1>
    <PageTree :items="data?.tree" format="text" :depth="0" />
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('sitemap', () => getNavTree('/'))
</script>
