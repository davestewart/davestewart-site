<template>
  <nav v-if="links" class="navBreadcrumbs">
    <span
      v-for="(link, index) in links"
      :key="link.path"
      class="breadcrumb__item"
    >
      <NuxtLink
        v-if="index < links.length - 1"
        :to="link.path"
        :title="link.description"
        class="breadcrumb__link"
      >{{ link.title }}</NuxtLink>
      <span v-else class="breadcrumb__text">{{ link.title }}</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const { data: links } = await useAsyncData('breadcrumbs', () => getNavParents(route.path), {
  watch: [route],
})
</script>

<style lang="scss">
.navBreadcrumbs {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: .5rem;
  box-sizing: border-box;
}

.breadcrumb {

  &__item {
    display: inline-block;
    white-space: nowrap;
    margin: .25rem 0;
    cursor: default;

    // arrow
    &:not(:last-child):after {
      display: inline-block;
      width: 10px;
      height: 14px;
      line-height: 1;
      margin: 0 2px;
      background: url('../../assets/breadcrumb-arrow.svg') no-repeat;
      background-position-y: 80%;
      vertical-align: bottom;
      content: ' ';
    }
  }

  &__text {
    color: $grey-light;
  }
}

// hide page title on mobile
@include sm {
  .layout__page {
    .breadcrumb__item:nth-last-child(10n+2):after,
    .breadcrumb__item:last-child {
      display: none;
    }
  }
}
</style>
