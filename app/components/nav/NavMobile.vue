<template>
  <nav class="navMobile only-md-down">
    <!-- menu button -->
    <div
      class="navMobile__link navMobile__button"
      :class="{ 'router-link-active': visible }"
      @click="visible = !visible"
    >
      <UiIcon icon="menu" :size="24" />
    </div>

    <div class="navMobile__links">
      <NuxtLink
        :to="up.path"
        class="navMobile__link navMobile__up"
        :class="up.class"
      >
        <UiIcon icon="up" :size="24" />
      </NuxtLink>

      <!-- search -->
      <NuxtLink
        to="/search/"
        class="navMobile__link navMobile__search"
      >
        <UiIcon icon="search" :size="24" />
      </NuxtLink>
    </div>

    <!-- background -->
    <transition name="menu">
      <div v-if="visible" class="navMobile__popover">
        <div class="navMobile__background" @mousedown="hide" />

        <!-- dropdown -->
        <div ref="dropdown" class="navMobile__dropdown">
          <div class="navMobile__branding">
            <SiteBranding @click="hide" />
          </div>
          <NavSections headers @click="hide" />
          <p class="navMobile__promo">
            Are you looking for a new <a href="https://controlspace.app" target="_blank">tab manager</a>?
          </p>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNavStore } from '~/stores/nav'

const route = useRoute()
const visible = ref(false)

const { up } = storeToRefs(useNavStore())

watch(() => route.path, () => {
  visible.value = false
})

watch(visible, (value) => {
  if (value) {
    window.addEventListener('scroll', hide)
  }
  else {
    window.removeEventListener('scroll', hide)
  }
})

function hide () {
  visible.value = false
}
</script>

<style lang="scss">
@use 'sass:color';

.navMobile {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__links {
    display: flex;
    align-items: center;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $grey-light;
    z-index: 100;
    padding: .75rem .8rem;

    svg {
      color: $grey-light;
    }

    &.hidden {
      display: none;
    }

    &:hover svg {
      color: black;
    }

    &.router-link-active svg {
      color: $accentColor !important;
    }
  }

  &__button {
    border-right: 1px solid $grey-lightest;
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // dropdown
  // ---------------------------------------------------------------------------------------------------------------------

  &__popover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 100;
  }

  &__background {
    @include fit;
    position: fixed;
    height: 100vh;
    background: #FFFD;
  }

  &__dropdown {
    box-sizing: border-box;
    position: fixed;
    padding: .5rem;
    font-size: 1.3em;
    top: 45px;
    left: 15px;
    right: 15px;
    background: white;
    outline: 1px solid $grey-lightest;
    border-radius: 2px;
    overflow: hidden;

    @include shadow-lg;

    @include full {
      left: -10px;
    }
  }

  &__branding {
    padding-bottom: 1rem;
    margin: .5rem .5rem 1.25rem;
    border-bottom: 1px dashed $grey-lightest;

    .siteBranding {
      padding: .75rem !important;

      &:hover {
        background: color.adjust($grey-lightest, $alpha: -0.6);
        border-radius: 4px;
      }
    }

    @media screen and (max-width: 430px), screen and (max-height: 470px) {
      display: none;
    }
  }

  &__promo {
    margin-top: 1rem;
    border-top: 1px dashed $grey-lightest;
    padding: 1rem 1rem .5rem;
    font-size: .85em;

    a {
      padding: .2rem;
    }

    @include sm {
      display: none;
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // sections
  // ---------------------------------------------------------------------------------------------------------------------

  .navSections {

    &__header {
      display: none;
      @include md-up {
        display: block;
      }
    }

    @include md-up {
      &__section {
        border-right: 1px dashed $grey-lightest;
        width: max-content;

        &:last-child {
          border: none;
        }
      }

      &__item {
        padding-right: 1rem !important;
      }
    }

    // hide some links in menu
    //.navSections__section[data-name="navigation"],
    a[href="/sitemap/"],
    a[href="/search/"],
    a[href="/projects/personal/dave-stewart/"] {
      display: none;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
