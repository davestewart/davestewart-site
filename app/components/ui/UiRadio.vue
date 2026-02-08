<template>
  <div class="uiRadio">
    <UiIcon
      v-if="icon"
      :size="20"
      :icon="icon"
      style="transform: translateY(1px)"
    />
    <label
      v-if="label"
      class="uiRadio__label"
      :data-count="count"
      :data-count-state="countState"
    >
      {{ label }}:
    </label>
    <span
      v-for="option in options"
      :key="option"
      class="uiRadio__option"
    ><a
      :href="`/search/?${name}=${option}`"
      :class="{ selected: option === modelValue }"
      @click.prevent="click(option)"
    >{{ option }}</a>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Icon } from '~/components/ui/UiIcon.vue'

defineProps<{
  label?: string
  icon?: Icon
  name?: string
  options?: string[]
  modelValue?: string
  count?: number | string
  countState?: number | string
}>()

const emit = defineEmits(['update:modelValue'])

const click = (val: string) => {
  emit('update:modelValue', val)
}
</script>

<style lang="scss">
.uiRadio {
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: $textColor;
  font-size: 14px;
  text-transform: capitalize;
  line-height: 1;

  &__label {
    position: relative;
    padding: .5em;
    font-weight: 600;

    &[data-count]:after {
      position: absolute;
      content: attr(data-count);
      font-size: .8em;
      color: $accentColor;
      top: 1px;
      right: -1px;
    }

    &[data-count][data-count-state="0"]:after {
      color: $grey-light;
    }

    &[data-count=""]:after {
      color: white !important;
    }
  }

  &__option {

    a {
      color: $grey-light;
      padding: 3px 7px;
      &.selected {
        color: $accentColor;
      }
    }
  }
}
</style>
