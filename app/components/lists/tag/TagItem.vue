<template>
  <NuxtLink
    class="tagList__tag"
    :to="`/search/?tags=${props.tag}`"
    :class="{ selected, valid }"
    @click.capture="onClick"
  >{{ tag.replace(/-/g, ' ') }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  tag: string
  selected?: boolean
  valid?: boolean
}>()

// eslint-disable-next-line
const injected = inject<((tag: string, toggle: boolean) => void) | null>('handleTagClick', null)

// report when a child of TagMatrix
function onClick (event: MouseEvent) {
  if (injected) {
    event.preventDefault()
    injected(props.tag, event.shiftKey)
  }
}
</script>

<style lang="scss">
.tagList {
  display: flex;
  flex-wrap: wrap;

  &__tag {
    display: inline-block;
    padding: .3em .5em;
    vertical-align: middle;
    white-space: nowrap;

    &.selected {
      background: var(--theme);
      color: white !important;
      border-radius: 4px;
      text-decoration: none !important;
    }
  }
}

.showValid a.tagList__tag {
  color: $grey-light;

  &.valid {
    color: $accentColor;
  }
}
</style>
