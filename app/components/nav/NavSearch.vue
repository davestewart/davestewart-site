<template>
  <nav class="siteSearch">
    <NuxtLink v-if="!isOnSearchPage" to="/search/">
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 20 20"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="currentColor"
          fill-rule="evenodd"
        >
          <polygon id="handle" transform="translate(15.666905, 15.666905) rotate(-315.000000) translate(-15.666905, -15.666905) " points="11.6669048 14.0669048 19.6669048 14.0669048 19.6669048 17.2669048 11.6669048 17.2669048" />
          <path id="Oval-2" d="M8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 C3.581722,16 0,12.418278 0,8 C0,3.581722 3.581722,0 8,0 Z M8,2.35294118 C4.88121553,2.35294118 2.35294118,4.88121553 2.35294118,8 C2.35294118,11.1187845 4.88121553,13.6470588 8,13.6470588 C11.1187845,13.6470588 13.6470588,11.1187845 13.6470588,8 C13.6470588,4.88121553 11.1187845,2.35294118 8,2.35294118 Z" />
        </g>
      </svg>
    </NuxtLink>

    <NuxtLink
      v-else
      href="#"
      class="dimmed"
      @click.prevent="close"
    >
      Exit
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'
// Use absolute or correct relative path. Since we are in app/components/nav, ../../utils is correct.
import { isModifier, isInput } from '../../utils/events'

const route = useRoute()
const router = useRouter()

const isOnSearchPage = computed(() => route.path.startsWith('/search'))

function search (value = '') {
  const path = '/search/'
  const query = value
    ? `?text=${value.replace('/', '')}`
    : ''
  router.push(path + query).catch(() => {})
}

function close () {
  history.back()
}

onKeyStroke('k', (e: KeyboardEvent) => {
  // skip if on search page or input
  if (isOnSearchPage.value || isInput(e)) {
    return
  }

  // skip if modal is showing
  if (document.body.classList.contains('modal-active')) {
    return
  }

  // open search if keyboard combo hit
  if (isModifier(e)) {
    e.preventDefault()
    search()
  }
})
</script>

<style lang="scss">
.siteSearch {
  display: flex;
  align-items: center;
  height: 100%;

  a {
    padding: .5rem .75rem;
    color: $grey-light !important;
    &:hover {
      color: $accentColor !important;
    }
  }

  svg {
    transform: translateY(2px);
  }
}
</style>
