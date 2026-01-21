<template>
  <nav class="navSurround">
    <div v-if="prev || next" class="layout__inner">
      <!-- prev -->
      <div v-if="prev" class="navSurround__prev">
        <span class="arrow"></span>
        <NuxtLink :to="prev.path">
          {{ getTitle(prev) }}
        </NuxtLink>
      </div>
      <span v-else></span>

      <!-- next -->
      <div v-if="next" class="navSurround__next">
        <NuxtLink :to="next.path">
          {{ getTitle(next) }}
        </NuxtLink>
        <span class="arrow"></span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#app'
import { onKeyStroke } from '@vueuse/core'
import { getTitle } from '~/utils/content'

const route = useRoute()
const router = useRouter()
const { surround: posts } = storeToRefs(useContentStore())

const prev = computed(() => posts?.value.at(0))
const next = computed(() => posts?.value.at(1))

// Keyboard navigation
onKeyStroke('ArrowLeft', (e) => {
  if (e.shiftKey && prev.value?.path) router.push(prev.value.path)
})

onKeyStroke('ArrowRight', (e) => {
  if (e.shiftKey && next.value?.path) router.push(next.value.path)
})

onKeyStroke('ArrowUp', (e) => {
  if (e.shiftKey) router.push(getParentPath(route.path))
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
  }

  a,
  span {
    display: block;
  }

  &__prev {
    display: flex;
    padding-right: .5rem;

    span:before {
      @include arrow;
      transform: scale(-1.4, 1.4) translate(5px, 3px);
    }
  }

  &__next {
    display: flex;
    padding-left: .5rem;
    text-align: right;

    span:after {
      @include arrow;
      transform: scale(1.4, 1.4) translate(5px, 3px);
    }
  }
}
</style>
