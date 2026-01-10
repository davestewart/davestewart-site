<template>
  <li class="pageItem">
    <span class="pageItem__title" :data-status="page.status ? page.status : undefined">
      <NuxtLink :to="page.path">{{ page.title }}</NuxtLink>
    </span>
    <span v-if="desc" class="pageItem__desc">{{ desc }}</span>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: any
}>()

const desc = computed(() => props.page.desc || props.page.description || props.page.frontmatter?.description || props.page.meta?.description)
</script>

<style lang="scss">
.pageItem {
  margin-bottom: .75em;
  list-style-type: disc;

  @include sm {
    font-size: 1rem;
  }

  &__title {
    margin: 0;
    position: relative;
    line-height: 1.6em;

    // for focus outline
    &:focus {
      padding: 2px 6px;
      margin: -2px -6px;
    }

    &[data-status]:after {
      position: relative;
      left: .75em;
      top: -.75em;
      font-size: .55em;
    }
  }

  &__desc {
    display: block;
    margin: 0;
    font-size: .8em;
    color: #888888;
    line-height: 1.4em;
  }
}
</style>
