<template>
  <div class="columns" :class="{ equal }" :style="{ gap }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  gap?: string
  equal?: boolean | string | number
}>(), {
  gap: '1rem',
})
</script>

<style lang="scss">
.columns {
  display: flex;
}

.columns.equal > .columns__column {
  flex: 1;
}

@media (max-width: 600px) {
  .columns {
    flex-direction: column;
  }
}
</style>
