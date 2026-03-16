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
        title="What's this?"
        class="showcaseIntro"
        inline
      >
        <p>Please read this page as a mini-portfolio of relevant projects and resources:</p>
        <div class="showcaseIntro__details">
          <ul style="margin: 1rem">
            <li>the projects are all filtered from my <a href="https://davestewart.co.uk" target="_blank">main portfolio</a></li>
            <li>you can navigate the links <NuxtLink to="/work">menus</NuxtLink> and <NuxtLink to="/search?tagsFilter=list">search</NuxtLink> like the full website</li>
            <li class="only-md-up">you can use <kbd>shift</kbd> + <kbd>left</kbd><kbd>right</kbd><kbd>up</kbd> to jump through projects</li>
            <li>you can <a href="#print" @click.prevent="print">print</a> this page to PDF if you need to save a copy</li>
          </ul>
        </div>
      </Alert>
    </transition>
  </div>
</template>

<style lang="scss">
.showcaseIntro {

  &[data-type="popup"] {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 100;
    max-width: 420px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, .2);

    .uiAlert {
      background: white;
      row-gap: 1.2rem;
      padding: 2rem;
    }
  }

  .uiAlert {
    background: white;
    row-gap: 1.2rem;
  }

  &__details {
    //display: none;
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
