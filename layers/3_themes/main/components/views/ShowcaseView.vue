<template>
  <div class="showcase pageContent">
    <div
      v-show="showIntro"
      ref="intro"
      class="slide-fade-transition"
      :class="{ 'is-leaving': isLeaving }"
    >
      <ShowcaseIntro :page="page" @close="onClose" />
    </div>
    <div
      v-show="showContent"
      ref="content"
      class="slide-fade-transition"
      :class="{ 'is-entering': isEntering }"
    >
      <ShowcaseHeader />
      <ContentRenderer :value="page" class="animate-block" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ShowcaseIntro from '@main/components/home/ShowcaseIntro.vue'

defineProps<{
  page: PageContent
}>()

// values
const route = useRoute()
const introState = useState('showcase-intro', () => route.path === '/')
const intro = ref<HTMLElement>()
const content = ref<HTMLElement>()

// animation state
const showIntro = ref(introState.value)
const showContent = ref(!introState.value)
const isLeaving = ref(false)
const isEntering = ref(false)

onMounted(() => {
  if (introState.value) {
    // animate intro elements
    const elements = intro.value!.querySelectorAll('.animate-block')
    animateElements(elements)
  }
})

function onClose () {
  // start intro leave animation
  isLeaving.value = true

  // scroll to top for smaller displays or zoomed devices
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // after leave animation completes, hide intro and show content
  setTimeout(() => {
    showIntro.value = false
    showContent.value = true
    introState.value = false

    // trigger content enter animation
    nextTick(() => {
      isEntering.value = true

      // animate content elements
      nextTick(() => {
        const elements = content.value!.querySelectorAll('.animate-block')
        console.log('elements', elements)
        animateElements(elements)
      })

      // cleanup
      setTimeout(() => {
        document.documentElement.removeAttribute('data-intro')
      }, 1000)
    })
  }, 350)
}

function animateElements (elements: NodeListOf<Element>) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('animate-in')
    }, index * 125)
  })
}
</script>

<style lang="scss">
html[data-showcase] {
  .pageInfo,
  .navSurround,
  .pageFeedback,
  .scrollTop,
  .siteFooter,
  .pageItem__title[data-status]:after,
  .showcaseItem__title[data-status]:after {
    display: none;
  }

  #content {
    margin-bottom: 10rem;
  }

  .pageContent {
    margin-bottom: 8rem;
    @media print {
      margin-bottom: 0;
    }

  }

  h1, h2, h3 {
    line-height: 1.2em;
    margin-top: 0.75em;
    margin-bottom: 0;
  }

  p, ul {
    line-height: 1.8em;
    @media print {
      line-height: 1.4em;
    }
  }

  .siteIcon {
    fill: $accentColor;
  }

  hr {
    margin: 2rem 0;
    border: none;
    background: $grey-light;
  }

  @media print {
    html {
      width: 100%;
      margin: 0;
    }

    body {
      margin: 2rem 2rem;
    }

    #content {
      margin-bottom: 0;
    }

    .siteMain {
      margin: 0;
      zoom:85%;
    }

    .layout__navSide,
    .layout__navPage {
      display: none;
    }

    .layout__inner {
      max-width: unset !important;
      padding: 0 !important;
    }

    .pageItem {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .table-wrapper {
      margin-left: 1.5rem;
    }

    h2, h3 {
      break-after: avoid;
      page-break-after: avoid;
      margin-top: 0.5em;
      margin-bottom: 0;

      + p {
        margin-top: 1em;
      }
    }

    p {
      margin: 0.5em 0;
    }

    hr {
      display: none;
    }
  }
}

html[data-intro] .animate-block {
  opacity: 0;
  transform: translateY(1.5rem);
  transition: opacity 0.3s ease-out, transform 0.4s ease-out;

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-fade-transition {
  transition: opacity 0.3s ease-out, transform 0.35s ease-out;

  &.is-leaving {
    opacity: 0;
    transform: translateY(-1.5rem);
  }

  &.is-entering {
    animation: slide-fade-enter 0.35s ease-out;
  }
}

@keyframes slide-fade-enter {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
