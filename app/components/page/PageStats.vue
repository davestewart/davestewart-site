<template>
  <div v-if="text" class="pageStats">
    <span
      class="pageStats__text"
      :title="`${words} words`"
    >{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
  words?: number
}>()
</script>

<style lang="scss">
.pageStats__text {
  display: inline-block;
  padding: .3em .5em;
  white-space: nowrap;
  color: black !important;
}
</style>
