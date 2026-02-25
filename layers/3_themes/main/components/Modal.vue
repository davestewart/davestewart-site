<template>
  <div class="modal" :class="classes">
    <div class="modal__background"></div>
    <div ref="container" class="modal__container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const classes = computed(() => ({
  visible: props.visible,
}))
</script>

<style lang="scss">
.modal {
  position: fixed;
  display: none;
  @include fit;
  z-index: 1000;
  align-items: center;
  justify-content: center;

  &.visible {
    display: flex;
  }

  &__background {
    position: absolute;
    @include fit;
    z-index: 1;
    pointer-events: none;
    background: rgba(white, .95);
    transition: .5s all linear;
  }

  &__container {
    z-index: 2;
  }
}
</style>
