<template>
  <header ref="el" class="siteHeader">
    <transition name="fade">
      <div v-if="scroll < 50 ? true : delta <= 0" class="siteHeader__el">
        <div class="siteHeader__background">
          <div class="layout__inner">
            <div class="siteHeader__left">
              <NavSite />
              <NavBreadcrumbs />
            </div>
            <div class="siteHeader__right">
              <NavSearch />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const router = useRouter()

// show or hide the header depending on the scroll direction
const scroll = ref(0)
const delta = ref(0)
const { y: scrollY } = useWindowScroll({
  onScroll: () => {
    delta.value = scrollY.value - scroll.value
    scroll.value = scrollY.value
  },
})

// pad the body and app scrolling depending on the header height
const offset = ref(40)
useHead({
  style: computed(() => {
    const value = `${offset.value}px`
    return [`
      body {
        scroll-padding-top: ${value};
      }
      #app {
        padding-top: ${value};
      }
    `]
  }),
})

function updateHeader () {
  offset.value = el.value?.offsetHeight || 40
}

const { width } = useWindowSize()
watch(width, updateHeader)

router.afterEach(updateHeader)

onMounted(() => {
  updateHeader()
  nextTick(() => updateHeader())
})
</script>

<style lang="scss">
#app {
  padding-top: 40px;
}

// header and footer
.siteHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.siteHeader {
  font-family: $titleFont;
  user-select: none;

  &__el {
    border-bottom: 1px solid $borderColor;
    background: white;
  }

  // used to give all items reasonable outline padding
  a, .breadcrumb__text {
    padding: 2px 6px;
  }

  .layout__inner {
    // pull in padding because breadcrumbs already contain bottom margin
    padding: 0;
  }

  @include full {
    &__left {
      margin-left: -.75rem;
    }

    &__right {
      margin-right: -.75rem;
    }
  }

  &__left,
  &__right {
    display: flex;
    align-items: flex-start;
  }

  &__left {
    flex-grow: 1;
  }

  &__right {
  }
}

// animation
.siteHeader {
  // opacity
  body.modal-raised &__el {
    opacity: 0;
    transition: .2s opacity; // fast-in
  }

  // shadow
  &__background {
    transition: 1s box-shadow; // slow-out
  }

  body.is-scrolled & .siteHeader__background {
    box-shadow: 0 0 20px rgba(black, 0.07);
    transition: .3s box-shadow; // fast-in
  }
}
</style>
