<template>
  <div class="page-home">
    <HomeView
      v-if="data"
      :page="data"
    />
  </div>
</template>

<script setup lang="ts">
import HomeView from '~/components/views/HomeView.vue'

const store = useContentStore()

const { data } = await useAsyncData('home', async () => {
  return await store.loadPage('/')
})

provideContent(data.value)
usePageSeo(data.value)
</script>
