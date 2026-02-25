<template>
  <div class="columns__column">
    <div class="columns__label">
      {{ label }}
    </div>
    <div class="columns__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
}>()
</script>

<style lang="scss" scoped>
.columns {
  &__column {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__label {
    text-align: center;
    padding: .25em .5em;
    font-weight: 700;
    font-family: $titleFont;
    color: $accentColor;
    vertical-align: middle;
    border-bottom: 1px solid $grey-lightest;
  }

  &__content {
    margin: 0.6rem 0.4rem;
  }
}
</style>
