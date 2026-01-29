<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { CSSProperties, VNodeChild } from 'vue'

interface EmitsPayload {
  height: number
  scroll: number
  delta: number
  offset: number
  progress: number
  visible: boolean
}

interface SlotProps {
  height: number
  scroll: number
  delta: number
  offset: number
  progress: number
  visible: boolean
  style: CSSProperties
}

interface Props {
  mode?: 'slide' | 'fade' | 'height' | 'slide-trigger' | 'fade-trigger' | 'height-trigger'
  heightUp?: number
  heightDown?: number
  scrollDownThreshold?: number
  scrollUpThreshold?: number
  scrollDownScalar?: number
  scrollUpScalar?: number
  transitionDownDuration?: number
  transitionUpDuration?: number
  navigationThreshold?: number
  navigationDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'slide',
  scrollDownThreshold: 0,
  scrollUpThreshold: 0,
  scrollDownScalar: 1,
  scrollUpScalar: 1,
  transitionDownDuration: 1000,
  transitionUpDuration: 500,
  navigationThreshold: 640,
  navigationDuration: 500,
})

const emit = defineEmits<{
  change: [payload: EmitsPayload]
}>()

defineSlots<{
  // eslint-disable-next-line no-unused-vars
  default(props: SlotProps): VNodeChild
}>()

const header = ref<HTMLElement | null>(null)
const height = ref(props.heightUp ?? 64)
const scroll = ref(0)
const delta = ref(0)
const offset = ref(0)

let lastScrollY = 0
let scrollAccumulator = 0
let animationFrameId: number | null = null

const isTrigger = computed(() => props.mode.includes('-trigger'))

const isVisible = computed(() => offset.value === 0)

const progress = computed(() => offset.value / height.value)

const style = computed(() => {
  // variables
  const mode = props.mode

  // scroll-triggered
  if (isTrigger.value) {
    const duration = scrollAccumulator > 0
      ? props.transitionDownDuration
      : props.transitionUpDuration

    if (mode === 'slide-trigger') {
      return {
        transform: `translateY(-${isVisible.value ? 0 : height.value}px)`,
        transition: `transform ${duration}ms ease`,
        pointerEvents: isVisible.value ? 'auto' : 'none',
      }
    }

    if (mode === 'fade-trigger') {
      return {
        opacity: isVisible.value ? 1 : 0,
        transition: `opacity ${duration}ms ease`,
        pointerEvents: isVisible.value ? 'auto' : 'none',
      }
    }

    if (mode === 'height-trigger') {
      const up = props.heightUp ?? 60
      const down = props.heightDown ?? 30
      return {
        height: isVisible.value ? `${up}px` : `${down}px`,
        transition: `height ${duration}ms ease`,
      }
    }
  }

  // scroll-driven
  if (mode === 'slide') {
    return {
      transform: `translateY(-${offset.value}px)`,
    }
  }

  if (mode === 'fade') {
    return {
      opacity: 1 - progress.value,
    }
  }

  if (mode === 'height') {
    {
      const up = props.heightUp ?? 60
      const down = props.heightDown ?? 30
      const diff = up - down
      const scale = 1 - progress.value
      return {
        height: `${(up - diff) + (diff * scale)}px`,
      }
    }
  }

  return {}
})

watch(() => progress, () => {
  emitChange()
})

function emitChange () {
  emit('change', {
    scroll: scroll.value,
    delta: delta.value,
    height: height.value,
    offset: offset.value,
    progress: progress.value,
    visible: isVisible.value,
  })
}

function updateHeight () {
  if (!props.heightUp) {
    const child = header.value?.firstElementChild
    const value = child
      ? (child as HTMLElement).offsetHeight
      : 64
    height.value = value
    return value
  }
  return height.value
}

function animateOffsetToZero () {
  const startOffset = offset.value
  const startTime = performance.now()
  const duration = props.navigationDuration

  function animate (currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // easing function (ease-out)
    const eased = 1 - Math.pow(1 - progress, 3)

    offset.value = startOffset * (1 - eased)

    animationFrameId = progress < 1
      ? requestAnimationFrame(animate)
      : null
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  animationFrameId = requestAnimationFrame(animate)
}

function throttle (fn: Function, duration = 10, lazy = false) {
  let lastCall = 0

  if (lazy) {
    let timeoutId: number | null = null

    return function (...args: any[]) {
      const now = Date.now()
      if (now - lastCall >= duration) {
        lastCall = now
        if (timeoutId !== null) {
          return
        }
        timeoutId = setTimeout(() => {
          fn(...args)
          timeoutId = null
        }, duration) as unknown as number
      }
    }
  }
  else {
    return function (...args: any[]) {
      const now = Date.now()
      if (now - lastCall >= duration) {
        lastCall = now
        fn(...args)
      }
    }
  }
}

function onScroll () {
  // base variables
  const headerHeight = updateHeight()
  const scrollY = window.scrollY

  // scale scroll offset
  delta.value = scrollY - lastScrollY
  const scrollScalar = delta.value > 0
    ? props.scrollDownScalar
    : props.scrollUpScalar
  const deltaScaled = delta.value * scrollScalar

  // scrolling down
  if (delta.value > 0) {
    // reset accumulator if direction changed
    if (scrollAccumulator < 0) {
      scrollAccumulator = 0
    }
    scrollAccumulator += deltaScaled

    // calculate whether we should start hiding
    let shouldHide = false

    // near top: only hide after scrolling past the threshold point
    if (scrollY < props.scrollDownThreshold) {
      const effectiveThreshold = props.scrollDownThreshold - scrollY + scrollAccumulator
      shouldHide = scrollAccumulator > effectiveThreshold
    }

    // past threshold: hide immediately
    else {
      shouldHide = true
    }

    if (shouldHide) {
      offset.value = Math.min(offset.value + deltaScaled, headerHeight)
    }
  }

  // scrolling up
  else {
    // reset accumulator if direction changed
    if (scrollAccumulator > 0) {
      scrollAccumulator = 0
    }
    scrollAccumulator += deltaScaled // delta is negative

    const isHidden = offset.value >= headerHeight
    const shouldShow = scrollY > props.scrollUpThreshold / deltaScaled
    // const threshold = isTrigger.value
    //   ? props.scrollUpThreshold
    //   :

    // smooth transition on navigation
    if (scrollY === 0 && delta < -props.navigationThreshold && props.navigationDuration > 0) {
      animateOffsetToZero()
      return
    }

    if (isHidden && shouldShow) {
      if (Math.abs(scrollAccumulator) > props.scrollUpThreshold) {
        offset.value = Math.max(offset.value + deltaScaled, 0)
      }
    }
    else {
      offset.value = Math.max(offset.value + deltaScaled, 0)
    }
  }

  // update values
  height.value = headerHeight
  scroll.value = scrollY
  lastScrollY = scrollY
}

const throttled = throttle(onScroll, 10, true)

onMounted(() => {
  lastScrollY = window.scrollY
  updateHeight()
  window.addEventListener('scroll', throttled, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttled)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div ref="header" class="vue-smart-header" :style="`--progress: ${progress}; --visible: ${isVisible ? 1 : 0}; --value: ${isVisible ? progress : 0};`">
    <slot
      :height="height"
      :offset="offset"
      :scroll="scroll"
      :progress="progress"
      :delta="delta"
      :visible="isVisible"
      :style="style"
    />
  </div>
</template>
