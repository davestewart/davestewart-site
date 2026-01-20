<template>
  <div v-show="visible" class="preview" :class="{ active, raised }">
    <transition name="preview__fade">
      <div
        v-if="active"
        class="preview__background"
        @mousedown.self="onMouseDown"
      />
    </transition>
    <div ref="offset" class="preview__offset">
      <div ref="container" class="preview__container" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getKeys, isEscape, onTransitionEnd, stopEvent } from '~/utils/events'
import { copyLayout, setElementBounds } from '~/utils/dom'
import { fitRect, getRect } from '~/utils/geom'

const noop = () => {}

const els = {
  offset: null,
  container: null,
  placeholder: null,
  source: null,
}

// refs
const offset = ref(null)
const container = ref(null)

// state
const active = ref(false)
const visible = ref(false)
const raised = ref(false)
const isTransitioning = ref(false)
const size = ref(null)
const scrollY = ref(0)

// router
const router = useRouter()

// watch
watch(visible, (value) => {
  document.body.classList.toggle('modal-active', value)
})

watch(active, (value) => {
  document.body.classList.toggle('modal-raised', value)
})

// methods
let removeListenersFn = noop

function show (source) {
  // bail if already transitioning
  if (isTransitioning.value) {
    return
  }

  // hide if shown
  if (visible.value) {
    return hide()
  }

  // create placeholder
  const placeholder = document.createElement('div')
  placeholder.id = 'placeholder'

  // cache elements so we can return them
  els.offset = offset.value
  els.container = container.value
  els.placeholder = placeholder
  els.source = source

  // get source size
  size.value = source.getBoundingClientRect()

  // set placeholder size (use % and padding to attempt to keep aspect ratio)
  // this won't be perfect, because the gallery component doesn't keep its aspect
  // ratio when it scales, due to the pagination controls on the bottom
  copyLayout(source, placeholder)

  // replace source with placeholder
  source.parentElement.insertBefore(placeholder, source)
  els.container.appendChild(source)

  // set container bounds
  setElementBounds(els.container, size.value)
  requestAnimationFrame(() => {
    updateContainerBounds()
  })

  // show and add listeners
  visible.value = true
  active.value = true

  // set up movement data
  els.offset.style.transform = ''
  scrollY.value = window.scrollY

  // begin the transition
  isTransitioning.value = true
  onTransitionEnd(els.container, () => {
    addListeners()
    isTransitioning.value = false
    raised.value = true
  })
}

function hide (immediate) {
  // sanity check
  if (immediate instanceof Event) {
    console.warn('Invalid Parameter "immediate"; Boolean expected but received:', immediate)
  }

  // remove listeners
  removeListenersFn()

  // replace placeholder with source
  const { container, placeholder, source } = els
  const parentElement = placeholder.parentElement

  // set bounds
  setElementBounds(container, placeholder.getBoundingClientRect())

  // change state
  active.value = false
  raised.value = false

  // route change
  if (immediate) {
    window.removeEventListener('scroll', onPageScroll)
    container.innerHTML = ''
    visible.value = false
  }

  // scroll
  else {
    isTransitioning.value = true
    onTransitionEnd(els.container, () => {
      // remove final listener
      window.removeEventListener('scroll', onPageScroll)

      // update element
      if (parentElement) {
        parentElement.insertBefore(source, placeholder)
        parentElement.removeChild(placeholder)
      }

      // update
      isTransitioning.value = false
      visible.value = false
    })
  }
}

function updateContainerBounds () {
  // variables
  const containerEl = els.container
  const el = offset.value.parentElement

  // determine window bounds
  const viewport = getRect(el.offsetWidth, el.offsetHeight)
  const safe = getRect(viewport.width * 0.9, viewport.height * 0.9)
  const content = fitRect(size.value, safe)

  // adjust for small images
  const { width, height } = size.value
  if (width < content.width) {
    // content.width = width + 10
  }
  if (height < content.height) {
    // content.height = height + 10
  }

  // set container bounds
  content.x = (viewport.width - content.width) / 2
  content.y = (viewport.height - content.height) / 2
  setElementBounds(containerEl, content)
}

function addListeners () {
  // main listeners
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('scroll', onInitialScroll)
  const unwatch = watch(() => router.currentRoute.value.path, onRoute)

  // additional listener to keep track of scrolling when the user has cancelled
  window.addEventListener('scroll', onPageScroll)

  // set up remove
  removeListenersFn = function () {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', onResize)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('scroll', onInitialScroll)
    unwatch()
  }
}

function onMouseDown () {
  hide()
}

function onResize () {
  updateContainerBounds()
}

function onRoute () {
  hide(true)
}

function onKeyUp (event) {
  if (isEscape(event)) {
    hide()
  }
}

function onKeyDown (event) {
  stopEvent(event)
  const { shift, left, right } = getKeys(event)
  if (!shift && !left && !right) {
    hide()
  }
}

function onInitialScroll () {
  hide()
}

function onPageScroll () {
  // keep track of page scrolling so we can fake the position of the container if the user scrolls
  els.offset.style.transform = `translateY(${scrollY.value - window.scrollY}px)`
}

// expose methods for external composable
defineExpose({
  show,
  hide,
})
</script>

<style lang="scss">
.preview {
  position: fixed;
  overflow-y: visible;
  @include fit;

  &.active {
    z-index: 500;
  }

  &__background {
    @include fit;
    position: absolute;
    background: rgba(white, 1); // .95
    pointer-events: fill;
  }

  &__container {
    position: absolute;
    transition: .35s all;
  }

  // don't animate when raised; otherwise weird things happen when resizing
  &.raised .preview__container {
    transition: none;
  }

  &__fade-enter-active,
  &__fade-leave-active {
    transition: opacity .4s;
  }

  &__fade-enter,
  &__fade-leave-to {
    opacity: 0;
  }
}

#placeholder {
  //outline: 1px dashed $grey-lightest;
  //outline: 5px dashed red;
}
</style>
