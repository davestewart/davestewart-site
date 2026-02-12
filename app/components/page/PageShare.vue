<template>
  <div class="pageShare" unselectable="on">
    <a ref="toggle" class="pageShare__toggle" @click="show">
      <UiIcon icon="share" :size="26" />
    </a>
    <div class="pageShare__popup">
      <div v-show="popup" ref="links" class="pageShare__links">
        <a
          :href="`https://twitter.com/intent/tweet?url=${url}&text=${title}%0A%0A${description}%0A%0A&hashtags=${hashtags}&via=dave_stewart`"
          target="_blank"
          title="Tweet"
        ><img alt="Tweet" src="./sharing/twitter.svg" /></a>
        <a
          :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
          title="Share on Facebook"
          target="_blank"
        ><img alt="Share on Facebook" src="./sharing/facebook.svg" /></a>
        <a
          :href="`https://www.linkedin.com/shareArticle?url=${url}&title=${title}&summary=${description}&source=${url}`"
          target="_blank"
          title="Share on LinkedIn"
        ><img alt="Share on LinkedIn" src="./sharing/linkedin.svg" /></a>
        <a
          :href="`http://www.reddit.com/submit?url=${url}&title=${title}`"
          target="_blank"
          title="Share on Reddit"
        ><img alt="Share on Reddit" src="./sharing/reddit.svg" /></a>
        <!--
        <a
          :href="`https://getpocket.com/save?url=${url}&title=${title}&tags=${hashtags}`"
          target="_blank"
          title="Add to Pocket"
        ><img alt="Add to Pocket" src="./sharing/pocket.svg" /></a>
        -->
        <a
          :href="`mailto:?subject=${title}&body=${description}%0A%0A${url}`"
          target="_blank"
          title="Send email"
        ><img alt="Send email" src="./sharing/email.svg" /></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = defineProps<{
  page: PageContent
}>()

const popup = ref(false)
const links = ref<HTMLElement | null>(null)
const toggle = ref<HTMLElement | null>(null)

const title = computed(() => encodeURIComponent(props.page.title!))
const description = computed(() => encodeURIComponent(props.page.description ?? ''))
const url = computed(() => `https://davestewart.co.uk${props.page._path}`)
const hashtags = computed(() => {
  const tags = props.page.tags || []
  return tags.join(',')
})

const hide = () => {
  popup.value = false
}

const show = () => {
  setTimeout(() => {
    popup.value = true
    nextTick(() => {
      if (links.value && toggle.value) {
        links.value.style.marginLeft = (toggle.value.offsetLeft - 10) + 'px'
      }
    })

    const onClick = () => {
      document.body.removeEventListener('click', onClick)
      hide()
    }
    document.body.addEventListener('click', onClick)
  }, 50)
}
</script>

<style lang="scss">
.pageShare {
  display: inline-block;
  flex-shrink: 0;

  ::selection {
    background: transparent;
  }

  ::-moz-selection {
    background: transparent;
  }

  &__toggle {
    display: inline-block;
    width: 30px;
    height: 30px;
    font-size: 0;
    line-height: 0;
    background-repeat: no-repeat;
    background-position: center;
    text-decoration: none;
    flex-shrink: 0;
    color: $grey-light;
    cursor: pointer;

    &:hover {
      color: $accentColor;
    }
  }

  &__popup {
    position: absolute;
    left: 0;
    @include sm {
      width: 100%;
    }
  }

  &__links {
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    outline: 1px solid $borderColor;
    background: white;
    font-size: 0;

    @include shadow-md;

    @include sm {
      margin: auto 1rem !important;
    }

    a {
      display: inline-block;
      padding: 12px 8px;
      &:first-child {
        padding-left: 12px;
      }
      &:last-child {
        padding-right: 12px;
      }

      &:hover img {
        //outline: 4px solid $grey-lightest;
        background: $borderColor;
      }
    }

    img {
      width: 30px;
    }
  }

  span {
    flex-shrink: 0;
  }
}
</style>
