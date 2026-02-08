<template>
  <div class="uiInput">
    <input
      ref="el"
      v-model="input"
      class="uiInput__text"
      type="text"
      autocomplete="off"
      :placeholder="placeholder"
    >
    <span
      v-if="input"
      class="uiInput__clear"
      @click="input = ''"
    >&times;</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const el = ref<HTMLElement | null>()

const input = computed({
  get: () => props.modelValue || '',
  set: val => emit('update:modelValue', val),
})

function focus () {
  el.value?.focus()
}

defineExpose({ focus })
</script>

<style lang="scss">
.uiInput {
  position: relative;
  display: flex;
  color: $textColor;
  font-size: 14px;
  line-height: 1;

  &__text {
    width: 100%;
    min-width: 50px;
  }

  &__clear {
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    bottom: 0;
    width: 30px;
    line-height: 1 !important;
    font-size: 1.7rem;
    font-weight: 600;
    vertical-align: middle;
    text-align: center;
    color: $grey-light;
    cursor: default;

    &:hover {
      color: unset;
    }
  }

  @include md-down {
    &__text[type="text"] {
      font-size: 1.2rem;
      padding: .5rem;
    }

    &__clear {
      width: 40px;
      font-size: 250%;
    }
  }
}
</style>
