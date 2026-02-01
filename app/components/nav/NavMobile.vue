<template>
  <nav class="navMobile only-md-down">
    <!-- menu button -->
    <div class="navMobile__button" @click="visible = !visible">
      <svg width="20px" height="20px" viewBox="0 0 15 14">
        <rect
          id="bar-1"
          fill="currentColor"
          x="2"
          y="3"
          width="11"
          height="2"
        />
        <rect
          id="bar-2"
          fill="currentColor"
          x="2"
          y="7"
          width="11"
          height="2"
        />
        <rect
          id="bar-3"
          fill="currentColor"
          x="2"
          y="11"
          width="11"
          height="2"
        />
      </svg>
    </div>

    <!-- search -->
    <NuxtLink
      to="/search/"
      class="navTop__link navMobile__search"
    >
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke="none"
          stroke-width="1"
          fill="currentColor"
          fill-rule="evenodd"
        >
          <polygon id="handle" transform="translate(15.666905, 15.666905) rotate(-315.000000) translate(-15.666905, -15.666905) " points="11.6669048 14.0669048 19.6669048 14.0669048 19.6669048 17.2669048 11.6669048 17.2669048" />
          <path id="Oval-2" d="M8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 C3.581722,16 0,12.418278 0,8 C0,3.581722 3.581722,0 8,0 Z M8,2.35294118 C4.88121553,2.35294118 2.35294118,4.88121553 2.35294118,8 C2.35294118,11.1187845 4.88121553,13.6470588 8,13.6470588 C11.1187845,13.6470588 13.6470588,11.1187845 13.6470588,8 C13.6470588,4.88121553 11.1187845,2.35294118 8,2.35294118 Z" />
        </g>
      </svg>
    </NuxtLink>

    <!-- background -->
    <div v-if="visible" class="navMobile__background" @mousedown="hide" />

    <!-- dropdown -->
    <div v-if="visible" ref="dropdown" class="navMobile__dropdown">
      <div class="navMobile__branding">
        <SiteBranding @click="hide" />
      </div>
      <NavSections headers @click="hide" />
      <p class="navMobile__promo">
        Are you looking for a new <a href="https://controlspace.app" target="_blank">tab manager</a>?
      </p>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const visible = ref(false)

watch(() => route.path, () => {
  visible.value = false
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

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-width: 3rem;
    min-height: 3rem;
    border-right: 1px solid $grey-lightest;
    cursor: pointer;
    color: $grey-light;
    z-index: 100;

    &:hover {
      color: $accentColor;
    }
  }

  &__search.navTop__link {
    padding: .75rem;
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // dropdown
  // ---------------------------------------------------------------------------------------------------------------------

  &__background {
    @include fit;
    position: fixed;
    height: 100vh;
    background: #FFFD;
  }

  &__dropdown {
    box-sizing: border-box;
    position: fixed;
    background: white;
    outline: 1px solid $grey-lightest;
    border-radius: 2px;
    z-index: 110;

    @include shadow-lg;

    @include sm {
      padding: .5rem;
      width: calc(100% - 20px);
      font-size: 1.3em;
      top: 10px;
      left: 10px;
    }

    @include md-up {
      position: absolute;
      max-width: calc(100% - 20px);
      padding: 1rem .25rem;
      top: 45px;
      left: 10px;
      height: auto;
      font-size: 1.15em;
    }

    @include full {
      left: -10px;
    }
  }

  &__branding {
    padding-bottom: 1rem;
    margin: .25rem 1rem 1.25rem;
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
    padding: 1rem 1rem 0;
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
    a[href="/"],
    a[href="/search/"],
    a[href="/projects/personal/dave-stewart/"] {
      display: none;
    }
  }
}
</style>
