<template>
  <div class="footerIcons">
    <LinkIcon
      v-for="item in items"
      :key="item.href"
      v-bind="item"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LinkItem {
  name: string
  color: string
  href: string
}

// https://simpleicons.org/?q=product
function link (name: string, color: string, href: string): LinkItem {
  return { name, color, href }
}

const items = computed(() => [
  link('twitter', '#1DA1F2', 'https://twitter.com/dave_stewart'),
  link('github', '#181717', 'https://github.com/davestewart'),
  link('linkedin', '#0A66C2', 'http://linkedin.com/in/davestewartuk/'),
])
</script>

<style lang="scss">
.footerIcons {
  display: flex;

  .iconLink {
    margin-left: 8px;
  }
}
</style>
