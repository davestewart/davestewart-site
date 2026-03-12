<script lang="ts" setup>
import type { Icon } from '../ui/UiIcon.vue'

type AlertType = 'tip' | 'info' | 'note' | 'warning' | 'important' | 'caution'

defineEmits<{
  (e: 'close'): void
}>()

const props = withDefaults(defineProps<{
  type?: AlertType
  icon?: Icon
  title?: string
  text?: string
  inline?: boolean
}>(), {
  type: 'note',
})

const icons: Record<AlertType, Icon> = {
  tip: 'tip',
  note: 'note',
  info: 'info',
  warning: 'warning',
  important: 'fire',
  caution: 'caution',
}

const title = computed(() => {
  return props.title
    ? props.title
    : capitalize(props.type)
})

const icon = computed(() => {
  return props.icon
    ? props.icon.toLowerCase()
    : props.type
      ? icons[props.type.toLowerCase() as keyof typeof icons]
      : 'note'
})

const slots = useSlots()

const layout = computed(() => {
  return props.inline || !slots.default
    ? 'inline'
    : 'block'
})
</script>

<template>
  <div
    class="uiAlert"
    :data-type="type"
    :data-layout="layout"
  >
    <UiIcon
      v-if="type"
      :icon="icon"
      :size="inline ? 22 : 28"
      class="uiAlert__icon"
    />
    <div v-if="title && !inline" class="uiAlert__title">
      <div>{{ title }}</div>
      <UiIcon
        v-if="getCurrentInstance()?.vnode.props?.onClose"
        size="20"
        icon="close"
        class="uiAlert__close"
        @click="$emit('close')"
      />
    </div>
    <div v-if="$slots.default || text" class="uiAlert__text">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<style lang="scss">
@use 'sass:color';

.uiAlert {
  border-left: 5px solid $accentColor;
  //font-weight: 600;

  &[data-layout="block"] {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    row-gap: 10px;
    padding: 1.5rem;
    padding-left: 1rem;
    margin: 1.5rem .25rem;
  }

  &[data-layout="inline"] {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 0.5rem .75rem;
    margin: 1rem .25rem;

    .uiAlert__icon {
      margin-top: 2.5px;
    }
  }

  .uiAlert__icon,
  .uiAlert__title {
    color: $accentColor;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-family: $titleFont;
    align-self: center;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;

    span {
      color: black;
      font-weight: 400;
    }
  }

  &__close {
    cursor: pointer;
    color: $grey-lighter;
    transition: color 0.2s ease;
    &:hover {
      color: black;
    }
  }

  &__text {
    grid-row: 2;
    grid-column: 2;

    @include sm {
      grid-column: 1 / -1;
      font-size: 0.9em;
    }

    p {
      margin: 0.4rem 0;
    }

    *:first-child {
      margin-top: 0 !important;
    }

    *:last-child {
      margin-bottom: 0 !important;
    }

    code {
      background: $grey-lightest;
    }
  }

}
</style>
