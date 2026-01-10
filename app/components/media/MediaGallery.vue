<template>
  <div
    ref="rootEl"
    class="mediaGallery"
    :style="slideContainerStyle"
    :class="{ loading }"
  >
    <!-- slides -->
    <div class="mediaGallery__slidesContainer" :style="slideContainerStyle">
      <div class="mediaGallery__slides">
        <div
          v-for="(image, i) in images"
          :key="image.src"
          class="mediaGallery__slide"
        >
          <MediaImage
            v-if="renderImage(i)"
            v-show="index === i"
            :source="image"
          />
        </div>
      </div>
      <div class="mediaGallery__slidesNav">
        <div class="mediaGallery__slidesPrev" @click="prev"></div>
        <div v-if="scale" class="mediaGallery__slidesView" @click="view"></div>
        <div class="mediaGallery__slidesNext" @click="next"></div>
      </div>
    </div>

    <!-- navigation -->
    <div class="mediaGallery__nav">
      <!-- prev -->
      <span
        class="mediaGallery__navButton mediaGallery__navPrev"
        @click.prevent.stop="prev"
      >{{ prevText }}</span>

      <!-- dots -->
      <div class="mediaGallery__pagination">
        <a
          v-for="(image, i) in images"
          :key="i"
          :class="{ 'mediaGallery__page--active': index === i }"
          class="mediaGallery__page"
          @click.prevent="index = i"
        >
          <span class="mediaGallery__dot"></span>
        </a>
      </div>

      <!-- next -->
      <span
        class="mediaGallery__navButton mediaGallery__navNext"
        @click.prevent.stop="next"
      >{{ nextText }}</span>
    </div>

    <!-- caption -->
    <div v-if="hasCaption" class="mediaGallery__caption">
      <NuxtLink v-if="captionLink" :to="captionLink">
        {{ captionText }}
      </NuxtLink>
      <span v-else>{{ captionText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useMedia } from '~/composables/useMedia'
import type { MediaSource } from '~/composables/useMedia'
import { usePage } from '~/composables/usePage'
import { getKeys, isNotModifier, stopEvent } from '~/utils/events'
import { offset } from '~/utils/array'
import { storage } from '~/utils/storage'
import MediaImage from './MediaImage'

interface Props {
  /**
   * Points at a frontmatter media key
   */
  media?: string
  page?: ContentItem
  src?: string
  height?: string | number
  scale?: boolean
  caption?: string

  // Gallery props
  keepAlive?: boolean
  wrap?: number | boolean
  width?: string | number
  captions?: number | boolean
  prevText?: string
  nextText?: string
}

const props = withDefaults(defineProps<Props>(), {
  media: 'gallery',
  scale: false,
  wrap: true,
  prevText: 'Prev',
  nextText: 'Next',
})

const page: ContentItem = props.page ?? usePage()

const images = useMedia(props, 'gallery')
const { $preview } = useNuxtApp() // Assuming preview plugin exists/migrated

const index = ref(0)
const loaded = ref<number[]>([])
const loading = ref(props.keepAlive)

// Computed
const hasCaption = computed(() => {
  const imgs = Array.isArray(images) ? images : []
  return props.captions === false || props.captions === 0
    ? false
    : imgs.some((image: MediaSource) => image.text)
})

const currentImage = computed(() => {
  const imgs = Array.isArray(images) ? images : []
  return imgs[index.value]
})

const captionText = computed(() => currentImage.value?.text)
const captionLink = computed(() => currentImage.value?.href)

const slideContainerStyle = computed(() => {
  return images[0]?.style
})

const storageKey = computed(() => {
  const { page } = usePage()
  const p = props.page || page.value
  if (!p) return ''
  return `gallery[${p._path || p.path}]:${props.media}`
})

// Watch
watch(index, (value) => {
  if (props.keepAlive && storageKey.value) {
    storage.set(storageKey.value, value)
  }
})

// Methods
function renderImage (i: number) {
  if (loaded.value.includes(i)) return true
  const load = Math.abs(index.value - i) < 3
  if (load) loaded.value.push(i)
  return load
}

function next () {
  index.value = offset(index.value, 1, images, props.wrap)
}

function prev () {
  index.value = offset(index.value, -1, images, props.wrap)
}

function view (event: Event) {
  const imgs = Array.isArray(images) ? images : []
  if (!imgs.length) return
  const { width, height } = imgs[0]
  // Need the root element. In script setup we can get the element reference if bound or use even.target parent?
  // Original used this.$el. Here we can use a ref on root div.
  // We need to implement ref="rootEl".
  if ($preview && rootEl.value) {
    $preview.show(rootEl.value, width, height)
  }
}

function onKeyDown (event: KeyboardEvent) {
  const only = isNotModifier(event)
  const { left, right } = getKeys(event)
  if (only) {
    if (left) {
      stopEvent(event)
      prev()
    }
    if (right) {
      stopEvent(event)
      next()
    }
  }
}

// Hooks
const rootEl = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  if (props.keepAlive) {
    nextTick(() => loading.value = false)
    const savedIndex = storage.get(storageKey.value)
    const imgs = Array.isArray(images) ? images : []
    if (typeof savedIndex === 'number' && savedIndex >= 0 && savedIndex < imgs.length) {
      index.value = savedIndex
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style lang="scss">
$colorHover: #888;

.mediaGallery {
  margin: 0 auto;
  position: relative;
  line-height: 1;

  // loading for keep-alive
  transition: .3s opacity;
  &.loading {
    opacity: 0;
  }

  .pageContent & {
    margin: 2rem auto 3rem;
    @include sm {
      margin: 1rem auto;
    }
  }

  // slides
  &__slidesContainer {
    font-size: 0;
    position: relative;
    overflow: hidden;

    > * {
      position: absolute;
      top: 0;
    }

    * {
      width: 100%;
      height: 100%;
    }
  }

  &.bordered &__slidesNav {
    outline: 1px solid $borderColor;
    outline-offset: -1px;
  }

  .preview__container &__slidesView {
    cursor: zoom-out;
    // @include shadow-lg;
  }

  &__slide {
    position: absolute;
    width: 100%;
    top: 0;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      //-webkit-backface-visibility: hidden;
      //-webkit-transform: translateZ(0) scale(1, 1);
    }
  }

  &__slides[style*="aspect-ratio"] .mediaGallery__slide {
    position: absolute;
  }

  // slides navigation
  &__slidesNav {
    width: 100%;
    height: 100%;
    display: flex;

    > * {
      height: 100%;
      width: 50%;
    }
  }

  &__slidesPrev {
    cursor: w-resize;
  }

  &__slidesView {
    cursor: zoom-in;
  }

  &__slidesNext {
    cursor: e-resize;
  }

  // button navigation
  &__nav {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: $titleFont;
    font-size: 16px;
  }

  &__navButton {
    border: none;
    color: #ccc;
    background: transparent;
    user-select: none;
    cursor: pointer;
    padding: .5rem;
    transition-duration: 0.3s;

    &:hover {
      color: $accentColor;
    }
  }

  // pagination
  &__pagination {
    margin: 0;
    padding: 0 1rem;
    //padding: .6rem .5rem;
    //border-radius: 32px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    //background: white;
  }

  &__page {
    margin: 0 3px;
    padding: 7px;
    cursor: pointer;

    span {
      background-color: #eee;
      border: none;
      border-radius: 100%;
      display: block;
      height: 10px;
      font-size: 0;
      line-height: 0;
      margin: 0;
      padding: 0;
      transition-duration: 1.8s;
      width: 10px;
      outline: none;
    }

    &--active span,
    &:hover span {
      background-color: $colorHover;
      box-shadow: 0 0 0 7px rgba(0, 0, 0, 0.1);
      transition-duration: 0.3s;
    }
  }

  // caption
  &__caption {
    border-top: 1px dotted #CCC;
    margin: 1rem 0 0;
    padding: 1rem 0 0;
    text-align: center;
    color: $accentColor;
  }

}
</style>
