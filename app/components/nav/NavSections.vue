<template>
  <nav class="navSections">
    <div
      v-for="section in sections"
      :key="section.name"
      class="navSections__section"
      :data-name="section.name.toLowerCase()"
    >
      <div class="navSections__items">
        <NuxtLink
          v-for="link in section.links"
          :key="link.path"
          :to="link.path"
          :target="link.path.startsWith('http') ? '_blank' : undefined"
          class="navSections__item"
          @click="$emit('click')"
        >
          <span class="navSections__text">{{ link.title }}</span>
          <span class="navSections__desc">{{ link.description }}</span>
        </NuxtLink>
      </div>
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

const { sections } = useMetaStore()
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
      min-width: 25%;

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

  &__items {
    display: flex;
    flex-direction: column;

    @include sm {
      gap: .5rem;
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // items
  // ---------------------------------------------------------------------------------------------------------------------

  &__item {
    display: block;
    padding: .5rem !important;
    border-radius: 3px;

    @media screen and (max-height: 600px) {
      margin: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: color.mix($grey-lightest, white, 75%);
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
    display: block;
    margin-top: .25rem;
    font-size: .8rem;
    line-height: 1.3;
    color: $grey;

    @include sm {
      font-size: .9rem;
    }
  }

  a.router-link-exact-active[href="/"],
  a.router-link-active:not([href="/"]) {
    pointer-events: none;
    * {
      color: $grey;
    }

  }

  a span {
    //margin: 0;
  }
}
</style>
