<template>
  <div ref="el" class="scrollTop" @click="onClick">
    <span class="scrollTop__inner">
      <UiIcon icon="arrow-up" size="50" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { throttle } from 'throttle-debounce'

// size of graphic
const size = 90

const el = ref<HTMLElement>()

interface Elements {
  footerOuter: HTMLElement | null
  footerInner: HTMLElement | null
  target: HTMLElement | null
}

const elements: Elements = {
  footerOuter: null,
  footerInner: null,
  target: null,
}

function assignElements () {
  Object.assign(elements, {
    footerOuter: document.querySelector('.siteFooter'),
    footerInner: document.querySelector('.navSurround'),
    target: document.querySelector('.scrollTop__inner'),
  })
}

/**
 * NavScrollTop uses a combination of position:sticky and JS to position itself
 *
 * position:sticky ensures it sticks to the bottom of the main content, and JS
 * pushes it above the bottom .navSurround when the page is narrow.
 */

function update () {
  if (!elements.target) {
    return
  }

  // whether the graphic will overlap the footer navigation
  const isNarrow = window.innerWidth < 900 + size + size

  // offset
  let offset = 0

  // offset the top of the scroll to top graphic if the page is narrow
  if (isNarrow && elements.footerOuter) {
    // y value of scroll
    const y = window.scrollY + window.innerHeight

    // y value of footer (will be 0 when hidden in showcase mode)
    const b = elements.footerOuter.offsetTop || document.body.offsetHeight

    // height of the footer navigation
    const h = elements.footerInner?.offsetHeight ?? 40

    // y value of limiting element
    const yMax = isNarrow
      ? b - h
      : b

    // is the navigation visible?
    const atTarget = y > yMax

    // value will only ever be between 0 and height of footer navigation
    offset = atTarget && isNarrow
      ? Math.min(h, y - yMax)
      : 0
  }

  // apply
  elements.target.style.bottom = offset + 'px'
}

const onEvent = throttle(10, (event) => {
  if (event.type === 'resize') {
    assignElements()
  }
  update()
})

function onClick () {
  if (!el.value) return

  // scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // disable / reset styles etc
  const classList = el.value.classList
  classList.add('disabled')
  setTimeout(() => classList.remove('disabled'), 1300)
}

onMounted(() => {
  assignElements()
  window.addEventListener('scroll', onEvent)
  window.addEventListener('resize', onEvent)
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onEvent)
  window.removeEventListener('resize', onEvent)
})
</script>

<style lang="scss">
.scrollTop {
  position: sticky;
  height: 0;
  bottom: 0;
  display: flex;
  justify-content: right;
  transition: .6s all;
  cursor: default;
  font-size: 12px;
  opacity: 0;
  z-index: 100;

  &__inner {
    position: relative;
    margin-top: -90px;
  }

  svg {
    fill: $textColor;
    opacity: .25;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    width: 50px;
    height: 50px;
    border-radius: 25px;

    &:hover svg {
      fill: $accentColor;
      opacity: 1;
    }
  }

  body.is-scrolled & {
    cursor: pointer;
    transition: .3s all;
    opacity: 1;
  }
}

.scrollTop.disabled {
  opacity: 0 !important;
  cursor: default !important;
  pointer-events: none;

  svg {
    fill: $textColor !important;
  }
}
</style>
