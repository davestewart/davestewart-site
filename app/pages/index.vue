<template>
  <div class="page-home">
    <Home v-if="doc" :doc="doc" />
  </div>
</template>

<script setup lang="ts">
import Home from '~/components/views/Home.vue'

const { data: doc } = await useAsyncData('home', () => {
  return queryContent('/').findOne()
})

provideContent(doc)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Home page not found' })
}
</script>
