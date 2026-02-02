<template>
  <SmartHeader
    v-slot="{ style }"
    mode="slide-trigger"
    :height="60"
    :scroll-down-scalar="0.1"
    :scroll-up-scalar="0.5"
  >
    <header
      ref="el"
      class="siteHeader"
      :style="{
        ...style,
        boxShadow: `0 0 calc(var(--value) * 20px) rgba(0, 0, 0, 1)`,
      }"
    >
      <div class="siteHeader__el">
        <div class="siteHeader__background">
          <div class="layout__inner">
            <NavMobile />
            <NavTop />
          </div>
        </div>
      </div>
    </header>
  </SmartHeader>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const router = useRouter()

// pad the body and app scrolling depending on the header height
const offset = ref(51)
useHead({
  style: computed(() => {
    const value = `${offset.value}px`
    return [`
      html {
        scroll-padding-top: ${value};
      }
      .layout__default {
        padding-top: ${value};
      }
    `]
  }),
})

function updateHeader () {
  const value = el.value?.offsetHeight
  if (value) {
    offset.value = value
  }
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
html {
  scroll-padding-top: 51px;
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
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }

  &__background {
    flex-grow: 1;
  }

  // used to give all items reasonable outline padding
  a, .breadcrumb__text {
    //padding: 2px 6px;
  }

  .layout__inner {
    // pull in padding because breadcrumbs already contain bottom margin
    padding: 0 1rem;
    @include xl-down {
      padding-left: 0;
      padding-right: 0;
    }
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

.navTop {
  display: none;
}

.navMobile,
.navBreadcrumbs {
  display: flex;
}

@include lg {
  .navTop {
    display: flex;
  }
  .navBreadcrumbs,
  .navMobile {
    display: none;
  }
}

// animation
.siteHeader {
  // opacity for preview modal
  &__el {
    opacity: 1;
    transition: .5s opacity;
    transition-delay: 0.25s;
  }

  body.preview-raised &__el {
    transition-delay: 0s;
    opacity: 0;
  }

  // shadow
  &__background {
    //transition: 1s box-shadow; // slow-out
  }

  body.is-scrolled & .siteHeader__el {
    //box-shadow: 0 0 20px rgba(black, 0.07);
    //transition: .3s box-shadow; // fast-in
  }
}
</style>
