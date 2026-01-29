<template>
  <li class="pageItem">
    <span class="pageItem__title" :data-status="page.status ? page.status : undefined">
      <NuxtLink :to="page.path">{{ page.title }}</NuxtLink>
    </span>
    <span v-if="page.description" class="pageItem__desc">{{ page.description }}</span>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  page: ParsedPage
}>()
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
