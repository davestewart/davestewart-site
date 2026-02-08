<template>
  <nav class="navSurround">
    <div v-if="prev || next" class="layout__inner">
      <!-- prev -->
      <NuxtLink v-if="prev" :to="getPath(prev)" class="navSurround__link navSurround__prev">
        <span class="navSurround__arrow" />
        <div class="navSurround__text">
          {{ getTitle(prev) }}
        </div>
      </NuxtLink>
      <span v-else />

      <!-- next -->
      <NuxtLink v-if="next" :to="getPath(next)" class="navSurround__link navSurround__next">
        <div class="navSurround__text">
          {{ getTitle(next) }}
        </div>
        <span class="navSurround__arrow" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#app'
import { onKeyStroke } from '@vueuse/core'
import { getPath, getTitle } from '~/utils/content'

const route = useRoute()
const router = useRouter()
const { surround: posts } = storeToRefs(useContentStore())

const prev = computed(() => posts?.value.at(0))
const next = computed(() => posts?.value.at(1))

// Keyboard navigation
onKeyStroke('ArrowLeft', (e) => {
  if (e.shiftKey && prev.value) {
    router.push(getPath(prev.value))
  }
})

onKeyStroke('ArrowRight', (e) => {
  if (e.shiftKey && next.value) {
    router.push(getPath(next.value))
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (e.shiftKey) {
    router.push(getParentPath(route.path))
  }
})
</script>

<style lang="scss">
@mixin arrow {
  content: ' ';
  display: block;
  width: 10px;
  height: 18px;
  margin: 0 2px;
  background: url('~/assets/breadcrumb-arrow.svg') no-repeat;
}

.navSurround {
  line-height: 1.4em;
  vertical-align: top;

  .layout__inner {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    border-top: 1px solid $grey-lightest;
    padding: 0 1rem;
  }

  &__link {
    display: flex;
    padding: 1.5rem 0;
    align-items: center;
    gap: 8px;
    font-family: $titleFont;
    font-size: 1.1rem;
    letter-spacing: 0.02em;
  }

  $scale: 1.7;

  &__prev {
    span:before {
      @include arrow;
      transform: scale(-$scale, $scale) translateY(2px);
    }
  }

  &__next {
    text-align: right;
    span:after {
      @include arrow;
      transform: scale($scale, $scale) translateY(2px);
    }
  }
}
</style>
