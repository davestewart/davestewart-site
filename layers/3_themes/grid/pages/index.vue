<template>
  <div class="page-home">
    <pre>{{ items }}</pre>
  </div>
</template>

<script setup lang="ts">
const store = useMetaStore()
const items = store.getPosts()
</script>
