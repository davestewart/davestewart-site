<template>
  <div class="page-home">
    <HomeView v-if="data" :page="data" />
  </div>
</template>

<script setup lang="ts">
import HomeView from '../components/views/HomeView.vue'

const showcase = useState('showcase', () => '')
const path = showcase.value ? `/${showcase.value}/` : '/'

const { data } = await usePage({ path })
</script>
