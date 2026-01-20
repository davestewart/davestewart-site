<template>
  <div class="fullscreen">
    <!-- inline state -->
    <div v-if="!state.internalShow" ref="inlineEl">
      <slot />
    </div>

    <!-- fullscreen teleport -->
    <Teleport v-if="state.internalShow" to="body">
      <div class="fullscreen__wrapper" :class="{ raised: state.raised }">
        <Transition name="fullscreen__fade">
          <div
            v-if="state.active"
            class="fullscreen__background"
            @mousedown.self="close()"
          />
        </Transition>
        <div ref="offsetEl" class="fullscreen__offset">
          <div ref="containerEl" class="fullscreen__container">
            <slot />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()

const inlineEl = ref<HTMLElement | null>(null)
const offsetEl = ref<HTMLElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)

interface State {
  internalShow: boolean
  active: boolean
  raised: boolean
  transitioning: boolean
}

const state = reactive<State>({
  internalShow: false,
  active: false,
  raised: false,
  transitioning: false,
})

interface Cache {
  bounds: DOMRect | null
  scrollY: number
}

const cache: Cache = {
  bounds: null,
  scrollY: 0,
}

// body class management
watch(() => state.internalShow, (val) => {
  document.body.classList.toggle('modal-active', val)
})

watch(() => state.active, (val) => {
  document.body.classList.toggle('modal-raised', val)
})

// main show/hide logic
watch(() => props.show, (isShowing) => {
  if (isShowing) {
    open()
  }
  else if (state.internalShow) {
    close()
  }
})

function open () {
  if (state.transitioning) return

  // capture measurements from inline element
  const sourceEl = inlineEl.value?.firstElementChild as HTMLElement | undefined
  if (!sourceEl) return

  cache.bounds = sourceEl.getBoundingClientRect()
  cache.scrollY = window.scrollY

  // show fullscreen version
  state.internalShow = true
  state.active = true

  nextTick(() => {
    if (!containerEl.value || !cache.bounds) return

    // position at source location
    Object.assign(containerEl.value.style, {
      left: `${cache.bounds.left}px`,
      top: `${cache.bounds.top}px`,
      width: `${cache.bounds.width}px`,
      height: `${cache.bounds.height}px`,
    })

    if (offsetEl.value) {
      offsetEl.value.style.transform = ''
    }

    // animate to center
    requestAnimationFrame(() => {
      state.transitioning = true
      animateToCenter()
    })
  })
}

function close (immediate = false) {
  if (!state.internalShow) return

  removeListeners()
  state.active = false
  state.raised = false

  if (immediate) {
    state.internalShow = false
    state.transitioning = false
    emit('close')
    return
  }

  // animate back to original position
  if (containerEl.value && cache.bounds) {
    Object.assign(containerEl.value.style, {
      left: `${cache.bounds.left}px`,
      top: `${cache.bounds.top}px`,
      width: `${cache.bounds.width}px`,
      height: `${cache.bounds.height}px`,
    })

    state.transitioning = true
    containerEl.value.addEventListener('transitionend', () => {
      state.internalShow = false
      state.transitioning = false
      emit('close')
    }, { once: true })
  }
}

function animateToCenter () {
  if (!containerEl.value || !cache.bounds) return

  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const safe = {
    width: viewport.width * 0.9,
    height: viewport.height * 0.9,
  }

  // calculate fitted dimensions
  const aspectRatio = cache.bounds.width / cache.bounds.height
  let width = safe.width
  let height = width / aspectRatio

  if (height > safe.height) {
    height = safe.height
    width = height * aspectRatio
  }

  // don't scale up small images
  width = Math.min(width, cache.bounds.width)
  height = Math.min(height, cache.bounds.height)

  // center in viewport
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2

  Object.assign(containerEl.value.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  })

  containerEl.value.addEventListener('transitionend', () => {
    state.transitioning = false
    state.raised = true
    addListeners()
  }, { once: true })
}

function compensateScroll () {
  if (!offsetEl.value) return
  const offset = cache.scrollY - window.scrollY
  offsetEl.value.style.transform = `translateY(${offset}px)`
}

// event handlers
function onKeyup (e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function onKeydown (e: KeyboardEvent) {
  const isNav = e.shiftKey || e.key === 'ArrowLeft' || e.key === 'ArrowRight'
  if (!isNav) {
    e.preventDefault()
    close()
  }
}

function onResize () {
  if (state.raised) {
    animateToCenter()
  }
}

// listener management
let stopListeners = () => {}

function addListeners () {
  const stops = [
    useEventListener('keyup', onKeyup),
    useEventListener('keydown', onKeydown),
    useEventListener('resize', onResize),
    useEventListener('orientationchange', onResize),
    useEventListener('scroll', () => close(), { once: true }),
    useEventListener('scroll', compensateScroll),
    watch(() => router.currentRoute.value.path, () => close(true)),
  ]

  stopListeners = () => stops.forEach(stop => stop())
}

function removeListeners () {
  stopListeners()
  stopListeners = () => {}
}
</script>

<style lang="scss">
.fullscreen {
  &__wrapper {
    position: fixed;
    inset: 0;
    z-index: 500;
  }

  &__background {
    position: absolute;
    inset: 0;
    background: rgba(white, 1);
  }

  &__container {
    position: absolute;
    transition: all 0.35s ease-out;
  }

  &__fullscreen.raised &__container {
    transition: none;
  }

  &__fade-enter-active,
  &__fade-leave-active {
    transition: opacity 0.4s;
  }

  &__fade-enter-from,
  &__fade-leave-to {
    opacity: 0;
  }
}
</style>
