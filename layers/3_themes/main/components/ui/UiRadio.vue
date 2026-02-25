<template>
  <div class="uiRadio">
    <label
      v-if="label"
      class="uiRadio__label"
      :data-count="count || undefined"
      :data-count-state="countState"
    >
      {{ label }}:
    </label>
    <div>
      <span
        v-for="option in options"
        :key="option"
        class="uiRadio__option"
      ><a
        :href="`/search/?${name}=${option}`"
        :class="{ selected: option === modelValue }"
        @click.prevent="click(option)"
      >{{ capitalize(option) }}</a>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  name?: string
  options?: string[]
  modelValue?: string
  count?: number | string
  countState?: number | string
  toggleable?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const click = (option: string) => {
  const { toggleable, modelValue } = props
  const value = toggleable && option === modelValue
    ? ''
    : option
  emit('update:modelValue', value)
}
</script>

<style lang="scss">
.uiRadio {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-family: $titleFont;
  font-size: 15px;
  color: $textColor;
  line-height: 1;

  @include md-down {
    flex-direction: column;
    align-items: flex-start;

    label {
      font-weight: 600;
    }
  }

  &__label {
    position: relative;
    padding: .5em;
    font-size: 12px;
    font-weight: 600;

    @include md-down {
      display: block;
      padding: 0 8px 10px 6px;
    }

    &[data-count]:after {
      position: absolute;
      content: attr(data-count);
      font-size: .8em;
      padding: 2px 4px;
      border-radius: 4px;
      top: -5px;
      right: -4px;
    }

    &[data-count][data-count-state="1"]:after {
      background: $accentColor;
      color: white;
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
      padding: 3px 7px;
      color: $grey-light;
      text-transform: capitalize !important;
      &.selected {
        color: $accentColor;
      }
    }
  }
}
</style>
