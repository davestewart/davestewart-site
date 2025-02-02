<template>
  <div class="scrollTop" @click="onClick">
    <span class="scrollTop__inner">
      <svg xmlns="http://www.w3.org/2000/svg"
           height="21"
           viewBox="0 0 34 21">
        <path fill="current"
              fill-rule="nonzero"
              d="M.976 16.848c0-.892.356-1.747.986-2.372l12.59-12.613a3.346 3.346 0 014.886 0L32.02 14.468c.64.626 1 1.481 1.004 2.385a3.342 3.342 0 01-.998 2.37 3.336 3.336 0 01-2.36.973 3.338 3.338 0 01-2.36-.975L17.046 8.963 6.683 19.223a3.336 3.336 0 01-2.36.973 3.346 3.346 0 01-3.348-3.348z"/>
      </svg>
    </span>
  </div>
</template>

<script>
import { throttle } from 'throttle-debounce'

const elements = {
  footerOuter: null,
  footerInner: null,
  target: null,
}

// size of graphic
const size = 90

/**
 * NavScrollTop uses a combination of position:sticky and JS to position itself
 *
 * position:sticky ensures it sticks to the bottom of the main content, and JS
 * pushes it above the bottom navigation when the page is narrow.
 */
export default {
  mounted () {
    // elements
    Object.assign(elements, {
      footerOuter: document.querySelector('.siteFooter'),
      footerInner: document.querySelector('.pageSiblings'),
      target: document.querySelector('.scrollTop__inner'),
    })

    // handlers
    window.addEventListener('scroll', this.onEvent.bind(this))
    window.addEventListener('resize', this.onEvent.bind(this))

    // update
    this.update()
  },

  methods: {
    update () {
      // whether the graphic will overlap the footer navigation
      const isNarrow = window.innerWidth < 900 + size + size

      // offset
      let offset = 0

      // offset the top of the scroll to top graphic if the page is narrow
      if (isNarrow) {
        // y value of scroll
        const y = window.scrollY + window.innerHeight

        // y value of footer
        const b = elements.footerOuter.offsetTop

        // height of the footer navigation
        const h = elements.footerInner.offsetHeight

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
    },

    onEvent: throttle(10, function () {
      this.update()
    }),

    onClick () {
      // scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // disable / reset styles etc
      const classList = this.$el.classList
      classList.add('disabled')
      setTimeout(() => classList.remove('disabled'), 1300)
    },
  },
}
</script>

<style lang="scss">
@import "../../styles/variables";

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
