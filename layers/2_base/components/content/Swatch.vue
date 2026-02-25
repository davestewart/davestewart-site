<script setup lang="ts">
defineProps<{
  color: string
  label: string
}>()
</script>

<template>
  <div class="swatch">
    <span class="swatch__color" :style="{ backgroundColor: color }" />
    <span class="swatch__label">{{ label }}</span>
  </div>
</template>

<style lang="scss">
.swatch__color {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  margin-right: .5em;
  vertical-align: text-bottom;
  border-radius: 4px;
  background: #CCCCCC;
}
</style>
