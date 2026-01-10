<template>
  <div :class="classes" :data-path="path">
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
    <Preview />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from '#app'
import { useWindowScroll } from '@vueuse/core'

// Logic ported from Global.vue
const route = useRoute()
const { y } = useWindowScroll()

const path = computed(() => route.path)

const layout = ref('page')

const classes = computed(() => ({
  [`layout__${layout.value}`]: true,
}))

const updateHeader = () => {
  if (import.meta.server) return
  const app = document.querySelector('#app')
  const header = document.querySelector('.siteHeader') as HTMLElement
  if (header) {
    const offset = header.offsetHeight + 'px'
    document.body.style.scrollPaddingTop = offset
    if (app) (app as HTMLElement).style.paddingTop = offset
  }
}

watch(path, () => {
  nextTick(() => updateHeader())
})

onMounted(() => {
  window.addEventListener('resize', updateHeader)
  nextTick(() => updateHeader())
  updateHeader()
})

// Scroll effect
watch(y, (scrollY) => {
  if (import.meta.server) return
  const scrollBottom = document.body.offsetHeight - scrollY - window.innerHeight
  document.body.classList.toggle('is-scrolled', scrollY > 60)
  document.body.classList.toggle('is-at-end', scrollBottom < 100)
})
</script>
