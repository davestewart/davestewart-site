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
.showcase {
  #content {
    margin-bottom: 10rem;
  }

  .siteIcon {
    fill: $accentColor;
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
