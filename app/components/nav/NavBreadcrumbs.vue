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
        :class="index === links.length - 2 ? 'breadcrumb__link--last' : ''"
      >{{ link.title }}</NuxtLink>
      <span v-else class="breadcrumb__text">{{ link.title }}</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
const { breadcrumbs: links } = storeToRefs(useMetaStore())
</script>

<style lang="scss">
.navBreadcrumbs {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: .5rem 0;
  box-sizing: border-box;
}

.breadcrumb {

  &__item {
    display: inline-block;
    white-space: nowrap;
    margin: .25rem 0; // required for wrapping
    cursor: default;
  }

  // arrow
  &__link:after {
    display: inline-block;
    width: 18px;
    height: 16px;
    margin: 0 2px;
    background: url('../../assets/icons/arrow-right.svg') no-repeat;
    background-position-y: -1px;
    vertical-align: middle;
    content: ' ';
  }

  &__link,
  &__text {
    display: inline-block;
  }

  &__text {
    color: $grey-light;
  }
}

// hide page title on mobile
@include sm {
  .breadcrumb__text {
    display: none;
  }
  .breadcrumb__link--last:after {
    content: unset;
  }
}
</style>
