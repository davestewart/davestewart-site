<template>
  <div class="page">
    <template v-if="data">
      <PageHero :page="data" class="page-hero" />
      <ContentRenderer :value="data" />
    </template>
    <div v-else>
      <h1>Page not found</h1>
      <p>Sorry about that.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHero from '../../main/components/page/PageHero.vue'

const { data } = await usePage()
</script>

<style>
.page-hero {
}
</style>
