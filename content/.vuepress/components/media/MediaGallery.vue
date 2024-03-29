<template>
  <div class="mediaGallery" :style="containerStyle" :class="{ loading }">

    <!-- slides -->
    <div class="mediaGallery__slidesContainer" :style="slideContainerStyle">
      <div class="mediaGallery__slides" :style="mediaStyle">
        <div v-for="(image, i) in source"
             :key="image.src"
             class="mediaGallery__slide">
          <MediaImage :source="image"
                      v-if="renderImage(i)"
                      v-show="index === i"/>
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
      <span class="mediaGallery__navButton mediaGallery__navPrev"
            @click.prevent.stop="prev"
      >{{ prevText }}</span>

      <!-- dots -->
      <div class="mediaGallery__pagination">
        <a v-for="(image, i) in source"
           :key="i"
           :class="{ 'mediaGallery__page--active' : index === i}"
           class="mediaGallery__page"
           @click.prevent="index = i"
        >
          <span class="mediaGallery__dot"></span>
        </a>
      </div>

      <!-- next -->
      <span class="mediaGallery__navButton mediaGallery__navNext"
            @click.prevent.stop="next"
      >{{nextText }}</span>
    </div>

    <!-- caption -->
    <div v-if="hasCaption" class="mediaGallery__caption">
      <router-link v-if="captionLink" :to="captionLink">{{ captionText }}</router-link>
      <span v-else>{{ captionText }}</span>
    </div>

  </div>
</template>

<script>
import { getKeys, isNotModifier, stopEvent } from '../../utils/events.js'
import { offset } from '../../utils/array'
import media from './index.js'
import { storage } from '../../utils/storage.js'

export default {
  extends: media('gallery'),

  props: {
    keepAlive: Boolean,
    wrap: {
      type: [Number, Boolean],
      default: true,
    },
    captions: {
      type: [Number, Boolean],
      default: undefined,
    },
    prevText: {
      type: String,
      default: 'Prev',
    },
    nextText: {
      type: String,
      default: 'Next',
    }
  },

  data () {
    return {
      index: 0,
      loaded: [],
      loading: this.keepAlive
    }
  },

  computed: {
    hasCaption () {
      return this.captions === false || this.captions === 0
        ? false
        : this.source.some(image => image.caption)
    },

    captionText () {
      return this.source[this.index].caption
    },

    captionLink () {
      return this.source[this.index].href
    },

    slideContainerStyle () {
      const { width, height } = this.source[0] || {}
      return `padding-bottom: calc(${height} / ${width}* 100%)`
    },

    storageKey () {
      return `gallery[${(this.page || this.$page).path}]:${this.media}`
    },
  },

  watch: {
    index (value) {
      if (this.keepAlive && this.storageKey) {
        storage.set(this.storageKey, value)
      }
    }
  },

  mounted () {
    // gallery navigation
    document.addEventListener('keydown', this.onKeyDown)

    // remember last image
    if (this.keepAlive) {
      this.$nextTick(() => this.loading = false)
      const index = storage.get(this.storageKey)
      if (typeof index === 'number' && index >= 0 && index < this.source.length) {
        this.index = index
      }
    }
  },

  destroyed () {
    document.removeEventListener('keydown', this.onKeyDown)
  },

  methods: {
    renderImage (index) {
      if (this.loaded.includes(index)) {
        return true
      }
      const load = Math.abs(this.index - index) < 3
      if (load) {
        this.loaded.push(index)
      }
      return load
    },

    next () {
      this.index = offset(this.index, 1, this.source, this.wrap)
    },

    prev () {
      this.index = offset(this.index, -1, this.source, this.wrap)
    },

    view () {
      const { width, height } = this.source[0]
      this.$preview.show(this.$el, width, height)
    },

    onKeyDown (event) {
      const only = isNotModifier(event)
      const { left, right } = getKeys(event)
      if (only) {
        if (left) {
          stopEvent(event)
          this.prev()
        }
        if (right) {
          stopEvent(event)
          this.next()
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import "../../styles/variables";

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
