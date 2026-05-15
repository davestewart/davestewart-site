<script lang="ts" setup>
const props = defineProps<{
  path: string
}>()

const isUrl = computed(() => props.path?.startsWith('http'))

const href = computed(() => {
  return (isUrl.value
    ? props.path
    : `davestewart.co.uk${props.path}`).replace('https://', '')
})
</script>

<template>
  <NuxtLink :to="path" :target="isUrl ? '_blank' : undefined">
    <slot />
  </NuxtLink>
  <!--
  <p style="font-size: .7rem; font-weight: normal; word-break: break-all;">
    {{ href }}
  </p>
  -->
</template>

<style lang="scss">

</style>
