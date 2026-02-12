<template>
  <div id="hyvor-talk-view" class="pageFeedback pageContent">
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
}

.comment-writer,
input {
  background: white !important;
  box-shadow: 0 0 0 1px var(--ht-color-accent-15);
}

.comments-list .no-comments {
  display: none;
}

.main-box-footer {
  display: none;
}

.comment-content {
  line-height: 1.7;
}

#app.light .hljs span *
  background: #f5f5f8;
  color: var(--foreground) !important; {
  font-weight: normal !important;
}

code,
.hljs * {
  color: #5c6e74 !important;
  font-weight: 500 !important;
}

.hljs-title, .hljs-literal {
  color: #EA4848 !important;
}

`,
}
</script>

<style lang="scss">
.pageFeedback {
  margin-bottom: 5rem;
}

.ht-comments-wrap {
  margin-top: 3rem;
}
</style>
