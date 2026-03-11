<script lang="ts" setup>
const state = useState('showcase-intro', () => false)

withDefaults(defineProps<{
  links?: string
}>(), {
  links: '#commercial-work',
})

onMounted(() => {
  state.value = true
})

function print () {
  window.print()
}
</script>

<template>
  <div class="showcaseIntro">
    <transition name="fade">
      <Alert
        v-if="state"
        icon="book"
        title="Project Showcase"
        closable
        class="showcaseIntro"
        @close="state = false"
      >
        <p>This page is a shortlist of relevant jobs, projects and resources, filtered from my <a href="https://davestewart.co.uk" target="_blank">full portfolio</a>.</p>
        <p>Feel free to:</p>
        <ul>
          <li>use the <NuxtLink to="/work">navigation</NuxtLink> or <NuxtLink to="/search?tagsFilter=list">search</NuxtLink> as normal</li>
          <li class="only-md-up">use <kbd>shift</kbd> + <kbd>cursor</kbd> to jump around</li>
          <li>or <a href="#print" @click.prevent="print">print</a> this page to PDF for your records</li>
        </ul>
      </Alert>
    </transition>
  </div>
</template>

<style lang="scss">
.showcaseIntro {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 500;
  max-width: 50ch;

  .uiAlert {
    margin: 1.5rem;
    //border-top: 1px solid #EEE;
    //border-right: 1px solid #EEE;
    //border-bottom: 1px solid #EEE;
    border-radius: 4px;
    padding: 2rem;
    background: white;
    box-shadow: 0 .2rem .5rem #0002, 0 1rem 2rem #0002;
    row-gap: 1.2rem;
  }

  @media print {
    display: none !important;
  }
}
</style>
