<template>
  <div class="columns" :class="{ equal, loose }" :style="{ gap }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  gap?: string
  equal?: boolean | string | number
  loose?: boolean | string | number
}>(), {
  gap: '2rem',
})
</script>

<style lang="scss">
.columns {
  display: flex;
  margin: 1rem 0;
}

.columns.equal > .columns__column {
  flex: 1;
}

@media (max-width: 600px) {
  .columns {
    flex-direction: column;
  }
}

@media print {
  .columns.loose > .columns__column {
    p {
      line-height: 1.6;
    }
  }
}
</style>
