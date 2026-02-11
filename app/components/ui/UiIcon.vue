<script lang="ts">
export type Icon =
  | 'menu'
  | 'search'
  | 'share'
  | 'share-alt'
  | 'up'
  | 'close'
  | 'tag'
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  icon: Icon
  size?: string | number
  color?: string
}>(), {
  size: 16,
})

const SvgIcon = defineAsyncComponent(() => import(`~/assets/icons/${props.icon}.svg?component`))

const style = computed(() => {
  const { color, size } = props
  return {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    color,
  }
})
</script>

<template>
  <SvgIcon
    class="uiIcon"
    :style="style"
  />
</template>

<style lang="scss">
.uiIcon {
  display: inline-block;
}
</style>
