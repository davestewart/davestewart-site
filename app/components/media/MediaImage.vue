<script setup lang="ts">
defineProps<{
  source: MediaItem
}>()
</script>

<template>
  <img
    :src="source.src"
    :alt="source.text"
    :style="source.style"
    draggable="false"
  >
</template>
