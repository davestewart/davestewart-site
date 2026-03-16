<template>
  <div class="page-home">
    <component :is="showcase ? ShowcaseView : HomeView" v-if="data" :page="data" />
  </div>
</template>

<script setup lang="ts">
import { HomeView, ShowcaseView } from '#components'

const showcase = useState('showcase', () => '')
const path = showcase.value ? `/${showcase.value}/` : '/'

const { data } = await usePage({ path })

useHead({
  titleTemplate: 'Dave Stewart - %s',
})
</script>
