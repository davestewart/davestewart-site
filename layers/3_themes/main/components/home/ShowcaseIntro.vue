<script lang="ts" setup>
const route = useRoute()
const state = useState('showcase-intro', () => true)

withDefaults(defineProps<{
  links?: string,
}>(), {
  links: '#commercial-work'
})

function print () {
  window.print()
}
</script>

<template>
  <alert v-if="state" icon="book" title="What am I looking at?" closable class="showcaseIntro" @close="state = false">
    <p>This is a shortlist of relevant jobs, projects and resources, filtered from my <a href="https://davestewart.co.uk" target="_blank">full portfolio</a>.</p>
    <p>It reads as a short CV with links to and descriptions of the content on the other pages.</p>
    <p>You can:</p>
    <ul>
      <li><a :href="links">scroll down</a> to continue</li>
      <li>click above to <NuxtLink to="/work">navigate</NuxtLink> or <NuxtLink to="/search?tagsFilter=list">search</NuxtLink> the projects like a normal website</li>
      <li class="only-md-up">use <kbd>shift</kbd> + <kbd>cursor</kbd> keys to quickly navigate the pages </li>
      <li><a href="#print" @click.prevent="print">print</a> this page as a CV</li>
    </ul>
  </alert>
</template>

<style lang="scss">
@media print {
  .showcaseIntro {
    display: none !important;
  }
}
</style>
