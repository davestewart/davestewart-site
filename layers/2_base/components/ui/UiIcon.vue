<script lang="ts">
export type Icon =
  // arrows
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'

  // alerts
  | 'alert'
  | 'caution'
  | 'warning'

  // actions
  | 'menu'
  | 'close'
  | 'search'
  | 'tag'
  | 'share'

  // objects
  | 'tip'
  | 'fire'
  | 'bolt'
  | 'comment'
  | 'book'
  | 'box'
  | 'tv'
  | 'note'
  | 'smile'
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  icon: Icon
  size?: string | number
  color?: string
}>(), {
  size: 24,
})

const SvgIcon = defineAsyncComponent(() => import(`~/assets/icons/${props.icon}.svg?component`))

const attrs = computed(() => {
  const { color, size } = props
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    style: { color },
  }
})
</script>

<template>
  <SvgIcon
    class="uiIcon"
    v-bind="attrs"
  />
</template>

<style lang="scss">
.uiIcon {
  display: inline-block;
  flex-shrink: 0;
  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
