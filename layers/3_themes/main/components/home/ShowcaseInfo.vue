<script lang="ts" setup>
withDefaults(defineProps<{
  links?: string
}>(), {
  links: '#commercial-work',
})

function print () {
  window.print()
}
</script>

<template>
  <div class="showcaseIntro">
    <transition name="fade">
      <Alert
        icon="box"
        inline
        class="showcaseIntro"
        @close="state = false"
      >
        <p>I've prepared this shortlist of relevant jobs, projects and resources, filtered from my <a href="https://davestewart.co.uk" target="_blank">main portfolio</a>.</p>
        <details>
          <summary>
            <span>More info...</span>
          </summary>
          <ul>
            <li>consider this page a tailored CV or mini-portfolio</li>
            <li>you can navigate the <NuxtLink to="/work">menus</NuxtLink> and <NuxtLink to="/search?tagsFilter=list">search</NuxtLink> like the full website</li>
            <li class="only-md-up">you can use <kbd>shift</kbd> + <kbd>cursor</kbd> to quickly navigate projects and folders</li>
            <li>you can <a href="#print" @click.prevent="print">print</a> this page to PDF if you need a hard copy</li>
          </ul>
        </details>
      </Alert>
    </transition>
  </div>
</template>

<style lang="scss">
.showcaseIntro {
  .uiAlert {
    background: white;
    row-gap: 1.2rem;
  }

  summary {
    cursor: pointer;
    span {
      margin-left: .3em;
      color: $accentColor;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media print {
    display: none !important;
  }
}
</style>
