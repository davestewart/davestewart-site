<template>
  <nav class="navSections">
    <div
      v-for="section in sections"
      :key="section.name"
      class="navSections__section"
      :data-name="section.name.toLowerCase()"
    >
      <div v-if="headers" class="navSections__header">
        {{ section.name }}
      </div>
      <NuxtLink
        v-for="link in section.links"
        :key="link.path"
        :to="link.path"
        class="navSections__item"
        @click="$emit('click')"
      >
        <span class="navSections__text">{{ link.title }}</span>
        <span class="navSections__desc">{{ link.description }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  headers?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()

const { sections } = useNavStore()
</script>

<style lang="scss">
@use 'sass:color';

.navSections {

  display: flex;
  width: 100%;

  @include md-up {
    &__sections {
      display: flex;
    }
  }

  @include sm {
    flex-direction: column;

    &__section {
      border-bottom: 1px solid $grey-lightest;
      padding: .5rem 0;

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
        border: none;
      }
    }
  }

  @include md-up {
    &__section {
      padding: 0 .5rem;
      width: 33.33%;
    }
  }

  &__header {
    padding: .5rem;
    font-weight: bold;
    margin-bottom: .5rem;
    font-size: .9em;

    @include sm {
      display: none;
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // items
  // ---------------------------------------------------------------------------------------------------------------------

  &__item {
    display: block;
    padding: .5rem !important;
    margin: 0 0 .5rem;
    border-radius: 3px;

    @media screen and (max-height: 600px) {
      margin: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: color.mix($grey-lightest, white, 50%);
      text-decoration: none;
    }
  }

  &__text {
    display: block;
    font-family: $titleFont;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
  }

  &__desc {
    font-size: .75em;
    color: $grey;
  }

  a.router-link-exact-active[href="/"] *,
  a.router-link-active:not([href="/"]) * {
    color: $grey-light;
  }

  a span {
    margin: 0;
  }
}
</style>
