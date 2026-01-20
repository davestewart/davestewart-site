<template>
  <div class="page-home">
    <HomeView v-if="data" :page="data" />
  </div>
</template>

<script setup lang="ts">
import HomeView from '~/components/views/HomeView.vue'

const { data } = await useAsyncData('home', () => {
  return queryContent<ParsedPage>('/').findOne()
})

provideContent(data)

usePageSeo(data)
</script>
