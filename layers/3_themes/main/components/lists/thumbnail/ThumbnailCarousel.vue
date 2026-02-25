<template>
  <div class="thumbnailCarousel">
    <transition name="fade-fast">
      <button
        v-if="canGoPrev"
        class="thumbnailCarousel__button thumbnailCarousel__button--prev"
        aria-label="Previous"
        @click="scrollPrev"
      >
        <UiIcon size="48" icon="arrow-left" />
      </button>
    </transition>

    <div ref="trackRef" class="thumbnailCarousel__track">
      <div class="thumbnailCarousel__grid">
        <div v-for="page in displayPages" :key="page?.path" class="thumbnailCarousel__item">
          <ThumbnailItem v-if="page" :page="page" />
        </div>
      </div>
    </div>

    <transition name="fade-fast">
      <button
        v-if="canGoNext"
        class="thumbnailCarousel__button thumbnailCarousel__button--next"
        aria-label="Next"
        @click="scrollNext"
      >
        <UiIcon size="48" icon="arrow-right" />
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  pages: MetaPost[]
  modelValue?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const trackRef = ref<HTMLElement>()
const currentIndex = ref(props.modelValue ?? 0)
const visibleCount = ref(3)
const isMobile = ref(false)
const isDesktop = ref(true)

const displayPages = computed(() => {
  if (isDesktop.value) {
    return props.pages
  }
  // md: 4 items, sm: 3 items
  return props.pages.slice(0, isMobile.value ? 3 : 4)
})

// Sync with v-model
watch(() => props.modelValue, (value) => {
  if (value !== undefined && value !== currentIndex.value) {
    currentIndex.value = value
    scrollToIndex()
  }
})

watch(currentIndex, (value) => {
  emit('update:modelValue', value)
})

watch(() => props.pages, () => {
  currentIndex.value = 0
  scrollToIndex()
})

const updateVisibleCount = () => {
  if (!trackRef.value) return

  const width = trackRef.value.clientWidth
  if (width <= 430) {
    visibleCount.value = 1
    isMobile.value = true
    isDesktop.value = false
  }
  else if (width <= 740) {
    visibleCount.value = 2
    isMobile.value = false
    isDesktop.value = false
  }
  else {
    visibleCount.value = 3
    isMobile.value = false
    isDesktop.value = true
  }
}

const canGoPrev = computed(() => isDesktop.value && currentIndex.value > 0)
const canGoNext = computed(() => isDesktop.value && currentIndex.value + visibleCount.value < props.pages.length)

const scrollPrev = () => {
  currentIndex.value = Math.max(0, currentIndex.value - visibleCount.value)
  scrollToIndex()
}

const scrollNext = () => {
  currentIndex.value = Math.min(props.pages.length - visibleCount.value, currentIndex.value + visibleCount.value)
  scrollToIndex()
}

const scrollToIndex = (animate = true) => {
  if (!trackRef.value) return

  const grid = trackRef.value.querySelector('.thumbnailCarousel__grid') as HTMLElement
  if (!grid) return

  const items = grid.querySelectorAll('.thumbnailCarousel__item')
  if (items.length === 0) return

  const firstItem = items[0] as HTMLElement
  const itemWidth = firstItem.offsetWidth
  const gap = 20
  const translateX = -(currentIndex.value * (itemWidth + gap))

  if (!animate) {
    grid.style.transition = 'none'
  }
  grid.style.transform = `translateX(${translateX}px)`
  if (!animate) {
    // Force reflow
    grid.offsetHeight
    grid.style.transition = ''
  }
}

const updateButtonPosition = () => {
  if (!trackRef.value) return

  const carousel = trackRef.value.parentElement as HTMLElement
  if (!carousel) return

  const image = trackRef.value.querySelector('.thumbnailItem__image') as HTMLElement
  if (!image) return

  const trackTop = trackRef.value.offsetTop
  const imageHeight = image.offsetHeight
  const buttonTop = trackTop + imageHeight / 2

  carousel.style.setProperty('--button-top', `${buttonTop + 20}px`)
}

onMounted(() => {
  updateVisibleCount()
  updateButtonPosition()
  window.addEventListener('resize', updateVisibleCount)
  window.addEventListener('resize', updateButtonPosition)
  scrollToIndex(false)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleCount)
  window.removeEventListener('resize', updateButtonPosition)
})
</script>

<style lang="scss">
.thumbnailCarousel {
  position: relative;
  margin-top: 1rem;
  margin-bottom: 20px;
  container-type: inline-size;

  &__button {
    position: absolute;
    top: var(--button-top, 50%);
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    color: $grey-light;

    &:hover {
      color: $accentColor;
    }

    &--prev {
      left: -72px;
    }

    &--next {
      right: -72px;
    }

    @container (max-width: 430px) {
      display: none;
    }
  }

  &__track {
    overflow: hidden;
    padding: 1rem 15px 1rem 15px;
    margin: 0 -20px;

    @container (max-width: 740px) {
      padding: 0;
      margin: 0;
    }
  }

  &__grid {
    display: grid;
    column-gap: 20px;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 40px) / 3);
    transition: transform 0.3s ease;

    // md: static 2x2 grid
    @container (max-width: 740px) {
      grid-auto-flow: row;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 20px;
      transform: none !important;
    }

    // sm: static column
    @container (max-width: 430px) {
      grid-template-columns: 1fr;
    }
  }

  &__item {
    break-inside: avoid;
  }

  .thumbnailItem {
    margin-bottom: 0;
  }
}
</style>
