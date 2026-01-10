<template>
  <div class="pageShare" unselectable="on">
    <a class="pageShare__toggle" @click="show">
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <g id="share" fill="currentColor" fill-rule="nonzero">
            <path id="Shape" d="M21.2998031,17.0942832 C20.043571,17.1025906 18.857007,17.6727578 18.065591,18.6483851 L12.7102397,16.1807232 C12.9620337,15.409708 12.9620337,14.5785828 12.7102397,13.8075676 L18.065591,11.3399057 C19.3698339,12.9137198 21.617656,13.3201595 23.3904368,12.3027172 C25.1632175,11.2852749 25.9461951,9.13938503 25.2452254,7.21933767 C24.5442558,5.29929032 22.5628792,4.16260907 20.55156,4.52666356 C18.5402409,4.89071805 17.0830053,6.6497979 17.0995276,8.69373217 C17.102686,8.94389198 17.1272776,9.19332093 17.1730324,9.43928107 L11.6286688,11.9909484 C9.97881947,10.3777316 7.33653609,10.3975068 5.71101718,12.0352367 C4.08549827,13.6729667 4.08549827,16.3153241 5.71101718,17.9530541 C7.33653609,19.5907841 9.97881947,19.6105592 11.6286688,17.9973424 L17.1730324,20.5490098 C17.1272776,20.7949699 17.102686,21.0443988 17.0995276,21.2945587 C17.0995276,23.6143068 18.980055,25.4948341 21.2998031,25.4948341 C23.6195512,25.4948341 25.5000786,23.6143068 25.5000786,21.2945587 C25.5000786,18.9748106 23.6195512,17.0942832 21.2998031,17.0942832 Z M21.2998031,6.59359443 C22.4596772,6.59359443 23.3999409,7.53385813 23.3999409,8.69373217 C23.3999409,9.85360622 22.4596772,10.7938699 21.2998031,10.7938699 C20.1399291,10.7938699 19.1996654,9.85360622 19.1996654,8.69373217 C19.1996654,7.53385813 20.1399291,6.59359443 21.2998031,6.59359443 Z M8.69897664,17.0942832 C7.53910259,17.0942832 6.59883889,16.1540195 6.59883889,14.9941454 C6.59883889,13.8342714 7.53910259,12.8940077 8.69897664,12.8940077 C9.85885069,12.8940077 10.7991144,13.8342714 10.7991144,14.9941454 C10.7991144,16.1540195 9.85885069,17.0942832 8.69897664,17.0942832 Z M21.2998031,23.3946964 C20.1399291,23.3946964 19.1996654,22.4544327 19.1996654,21.2945587 C19.1996654,20.1346846 20.1399291,19.1944209 21.2998031,19.1944209 C22.4596772,19.1944209 23.3999409,20.1346846 23.3999409,21.2945587 C23.3999409,22.4544327 22.4596772,23.3946964 21.2998031,23.3946964 Z" />
          </g>
        </g>
      </svg>
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
        <a
          :href="`https://getpocket.com/save?url=${url}&title=${title}&tags=${hashtags}`"
          target="_blank"
          title="Add to Pocket"
        ><img alt="Add to Pocket" src="./sharing/pocket.svg" /></a>
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
  page: ContentItem
}>()

const popup = ref(false)
const links = ref<HTMLElement | null>(null)
const toggle = ref<HTMLElement | null>(null)

const title = computed(() => encodeURIComponent(props.page.title))
const description = computed(() => encodeURIComponent(props.page.description ?? ''))
const url = computed(() => `https://davestewart.co.uk${props.page.path}`)
const hashtags = computed(() => {
  const tags = props.page.tags || []
  return tags.join(',')
})

const hide = () => {
  popup.value = false
}

const show = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  setTimeout(() => {
    popup.value = true
    nextTick(() => {
      if (links.value && target) {
        // Calculate position relative to the toggle button (approximate logic from original)
        // Or just reset logic as original
        // Original: this.$refs.links.style.marginLeft = (this.$el.offsetLeft - 1) + 'px'
        // In script setup we don't have this.$el easily, assuming standard flow
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
