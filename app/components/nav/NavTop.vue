<template>
  <nav class="navTop">
    <NuxtLink class="navTop__icon" to="/">
      <SiteIcon size="20" />
    </NuxtLink>
    <section v-for="section in top" :key="section.name" class="navTop__section">
      <NuxtLink
        v-for="link in section.links"
        :key="link.path"
        :to="link.path"
        class="navTop__link"
        :class="route.path.startsWith(link.path) ? 'router-link-active' : ''"
        @click="$emit('click')"
      >{{ link.title }}
      </NuxtLink>
    </section>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useNavStore } from '~/stores/nav'

const route = useRoute()
const { top } = storeToRefs(useNavStore())
</script>

<style lang="scss">
@use 'sass:color';

.navTop {
  position: relative;
  display: flex;
  align-items: center;
  //justify-content: center;
  flex-direction: row;
  flex-grow: 1;
  width: 100%;
  height: 100%;

  &__section {
    display: flex;
    flex-direction: row;
  }

  &__link {
    display: inline-block;
    padding: 1.2rem 1rem;
    font-family: $titleFont;
    font-size: 1.1rem;
    //font-weight: 600;
    letter-spacing: 0.05em;
    color: $grey !important;
    transition: all 0.2s ease-in-out;

    &:hover {
      text-decoration: none;
      transform: scale(1.1);
      color: $textColor !important;
    }

    &.router-link-active:not([href="/"]) {
      transform: scale(1.1);
      color: $accentColor !important;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    aspect-ratio: 1/1;
    border-right: 1px solid $grey-lightest;
    margin-right: .5rem;
    padding-right: .4rem;

    .siteIcon {
      fill: color.mix($grey, $grey-lightest, 50%);
      transition: all 0.2s ease-in-out;
    }

    &.router-link-exact-active .siteIcon {
      fill: $accentColor !important;
      transform: scale(1.1);
    }

    &:hover .siteIcon {
      fill: $textColor;
      transform: scale(1.1);
    }
  }

}
</style>
