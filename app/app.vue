<template>
  <div id="app" :class="classes" :data-path="path">
    <!-- header -->
    <SiteHeader />

    <!-- main -->
    <main class="siteMain">
      <!-- content -->
      <div class="layout__inner">
        <NuxtPage />
      </div>

      <!-- prev / next -->
      <NavSurround />

      <!-- scroll to top -->
      <ClientOnly>
        <NavScrollTop />
      </ClientOnly>
    </main>

    <!-- control space promo -->
    <ClientOnly>
      <CsPromo />
    </ClientOnly>

    <!-- lower area -->
    <div class="layout__bottom">
      <!-- footer -->
      <SiteFooter />
    </div>

    <!-- preview modal -->
    <Preview ref="preview" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#app'
import { useWindowScroll } from '@vueuse/core'
import { setupPreview } from '~/composables/usePreview'

const { y } = useWindowScroll()

const route = useRoute()
const path = computed(() => route.path)

const layout = ref('page')

const classes = computed(() => ({
  [`layout__${layout.value}`]: true,
}))

const preview = setupPreview()

watch(y, (scrollY) => {
  if (import.meta.client) {
    const scrollBottom = document.body.offsetHeight - scrollY - window.innerHeight
    document.body.classList.toggle('is-scrolled', scrollY > 60)
    document.body.classList.toggle('is-at-end', scrollBottom < 100)
  }
})
</script>
