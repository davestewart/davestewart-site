<template>
  <div class="pageFeedback pageContent">
    <h2>So...</h2>
    <template v-if="$route.path.includes('/blog/')">
      <p>I hope you found this article useful or enjoyable.</p>
    </template>

    <template v-else>
      <p>I hope you found this post interesting or useful.</p>
    </template>

    <p>
      If you want to engage further, follow me on
      <a href="https://twitter.com/dave_stewart" target="_blank">Twitter</a>,
      <a href="https://bsky.app/profile/davestewart.uk" target="_blank">Bluesky</a>,
      or drop a <a href="#hyvor-talk-view">comment</a> or <a href="#hyvor-talk-view">reaction</a> below.
    </p>
    <p>Either way, thanks for reading!</p>

    <SiteIcon size="32" fill="#EA4848" />

    <ClientOnly>
      <Comments
        :website-id="6366"
        :page-url="`https://davestewart.co.uk${$route.path}`"
        :settings="settings"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { Comments } from '@hyvor/hyvor-talk-vue'

const settings = {
  custom_css: `
.comment-writer {
  background: var(--ht-color-input);
  margin: 4px 10px;
}`,
}
</script>

<style lang="scss">
.pageFeedback {
  margin-top: 5rem;
  //border-top: 1px solid $grey-lightest;
}

#hyvor-talk-view {
  min-height: 280px;
  margin-bottom: -60px;
  margin-left: -1rem;
  margin-right: -1rem;
  width: calc(100% + 2rem) !important;
  max-width: unset !important;

  iframe {
    width: calc(100% + 2rem) !important;
  }

  .main-box-footer {
    display: none;
  }
}
</style>
