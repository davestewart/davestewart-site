<template>
  <div class="socialLinks">
    <a
      v-for="item in items"
      :key="item.href"
      class="socialLinks__link"
      target="_blank"
      :href="item.href"
      :style="`background-color: ${item.color}`"
    ><span :style="`background-image:url(/assets/social/${item.name}.svg)`">&nbsp;</span></a>
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
.socialLinks {
  display: flex;
  gap: 8px;

  &__link {
    display: inline-block;
    border-radius: 3px;
    overflow: hidden;
    font-size: 0;

    span {
      display: inline-block;
      padding: 4px;
      width: 24px;
      height: 24px;
      font-size: 0;
      margin: 0;
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
      background-color: $grey-light;
      transform: none;

      &:hover, &:focus {
        background-color: unset;
      }

      @include hover;
    }
  }
}
</style>
