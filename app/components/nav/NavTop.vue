<template>
  <nav class="navTop">
    <NuxtLink class="navTop__icon" to="/">
      <SiteIcon size="20" />
    </NuxtLink>
    <div class="navTop__sections">
      <section v-for="section in top" :key="section.name" class="navTop__section">
        <template v-for="link in section.links" :key="link.title">
          <transition name="fade">
            <div v-if="!link.class?.includes('hidden')">
              <NuxtLink
                :to="link.path"
                class="navTop__link"
                :class="[
                  link.class,
                  route.path.startsWith(link.path) ? 'router-link-active' : '',
                ]"
                :title="link.description"
              >{{ link.title }}
              </NuxtLink>
            </div>
          </transition>
        </template>
      </section>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const { top } = storeToRefs(useMetaStore())
</script>

<style lang="scss">
@use 'sass:color';

.navTop {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__sections {
    display: flex;
    flex-grow: 1;
    width: 100%;
    justify-content: space-between;
  }

  &__section {
    display: flex;
    flex-direction: row;
  }

  &__link {
    display: inline-block;
    padding: 1.2rem 1rem;
    font-family: $titleFont;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
    color: $grey !important;
    transition: all 0.2s ease-in-out; //, opacity 0.5s ease-in-out;
    opacity: 1;

    &.hidden {
      //opacity: 0;
    }

    &:hover {
      text-decoration: none;
      transform: scale(1.1);
      color: $textColor !important;
    }

    &.router-link-active:not([href="/"]):not(.up) {
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
    padding: 1rem 1.1rem;

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
