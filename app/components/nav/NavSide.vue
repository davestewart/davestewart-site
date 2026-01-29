<template>
  <nav class="navSide">
    <NuxtLink
      v-for="link in side"
      :key="link.path"
      :to="link.path"
      class="navSections__item"
      :class="route.path.startsWith(link.path) ? 'router-link-active' : ''"
      @click="$emit('click')"
    >
      <span class="navSections__text">{{ link.title }}</span>
      <span class="navSections__desc">{{ link.description }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNavStore } from '~/stores/nav'

const route = useRoute()
const visible = ref(false)

watch(() => route.path, () => {
  visible.value = false
})

const { side } = useNavStore()
</script>

<style lang="scss">
@use 'sass:color';

.navSide {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  opacity: .3;
  transition: opacity 2s ease-in-out;

  &:hover {
    opacity: 1;
    transition: opacity .1s ease-in-out;
  }

  a {
    border-left: 4px solid transparent;
  }

  a.router-link-active:not([href="/"]) {
    //background: color.mix($grey-lightest, white, 50%);
    border-left: 4px solid $grey-lighter;
  }

  .navSections__text {
    font-family: $titleFont;
    font-size: 1.1em;
  }
}
</style>
