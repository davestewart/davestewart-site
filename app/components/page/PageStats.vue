<template>
  <div v-if="minutes" class="pageStats">
    <span class="pageStats__text" :title="`${words} words`">{{ Math.ceil(minutes) }} minute read</span>
  </div>
</template>

<script>
export default {
  props: {
    minutes: {
      type: Number,
    },
    words: {
      type: Number,
    },
  },
}
</script>

<style lang="scss">
.pageStats__text {
  display: inline-block;
  padding: .3em .5em;
  white-space: nowrap;
  color: black !important;
}
</style>
