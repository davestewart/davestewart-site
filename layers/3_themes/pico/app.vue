<template>
  <div id="app">
    <main class="container">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const store = useMetaStore()
await callOnce('items', () => store.loadItems())

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css' },
  ],
  style: [
    'body { font-size: 16px; }',
  ],
})
</script>

<style>
body {
  padding: .5rem;
  font-family: sans-serif;
  font-weight: 300;
}
</style>
