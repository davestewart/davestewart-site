<template>
  <a v-bind="$attrs" :target="target">
    <slot />
  </a>
</template>

<script lang="ts" setup>
const attrs = useAttrs()

const target = computed(() => {
  const href = String(attrs.href)
  return /^(https?:)/.test(href) ? '_blank' : undefined
})
</script>
