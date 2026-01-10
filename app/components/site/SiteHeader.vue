<template>
  <transition name="fade">
    <header v-if="scroll < 50 ? true : delta <= 0" class="siteHeader">
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
    </header>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y: scrollY } = useWindowScroll()
const scroll = ref(0)
const delta = ref(0)

watch(scrollY, (val) => {
  delta.value = val - scroll.value
  scroll.value = val
})

// Initial set
onMounted(() => {
  scroll.value = window.scrollY
})

// Logic from template: scroll < 50 ? true : delta <= 0
// However, the original had a v-if on the header.
// It seems it hides the header when scrolling down, shows when scrolling up.
</script>

<style lang="scss">
.siteHeader {
  font-family: $titleFont;
  user-select: none;

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
  opacity: 1;
  transition: .6s opacity; // slow-out
  transition-delay: .2s;

  // opacity
  body.modal-raised & {
    opacity: 0;
    transition: .2s opacity; // fast-in
  }

  // shadow
  &__background {
    transition: 1s box-shadow; // slow-out
  }

  body.is-scrolled & .siteHeader__background{
    box-shadow: 0 0 20px rgba(black, 0.07);
    transition: .3s box-shadow; // fast-in
  }
}
</style>
