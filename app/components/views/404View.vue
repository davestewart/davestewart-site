<template>
  <div class="layout__page">
    <h1>404</h1>
    <p class="description">
      That link goes nowhere...
    </p>
    <div class="pageContent">
      <h3>But you have options!</h3>

      <section>
        <p>Try these links:</p>
        <ul>
          <li>
            <NuxtLink :to="`/search/?text=${path}`">
              Search for: "{{ path }}"
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="parent">
              The parent page
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/">
              Home page
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/bio/">
              Bio
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section style="margin-top: 2rem">
        <p>Or pick a random project!</p>
        <ClientOnly>
          <ThumbnailWall v-if="pages" :pages="pages" />
        </ClientOnly>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pages = computed(() => {
  return getPosts({
    sort: 'random',
    limit: 3,
  })
})

const parent = computed(() => {
  return getParentPath(route.path)
})

const path = computed(() => {
  return route.path.substring(1)
})
</script>
