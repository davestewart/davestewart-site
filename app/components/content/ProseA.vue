<template>
  <NuxtLink v-bind="$attrs" :target="target">
    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
const attrs = useAttrs()

const isLocal = computed(() => {
  const href = String(attrs.href)
  return /^(https?:)/.test(href)
})

const target = computed(() => {
  return isLocal.value ? '_blank' : undefined
})
</script>
