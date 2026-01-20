<template>
  <UiControls class="pageInfo">
    <PageDate v-if="page.date" :date="page.date"/>
    <PageStats v-if="page._path.startsWith('/blog/') && page.readingTime" v-bind="page.readingTime" />
    <PageShare v-if="isVisible(page)" :page="page" />
    <Shield v-if="page.github" :github="page.github" class="only-md-up" />
    <TagList v-if="page.tags" :tags="page.tags" />
  </UiControls>
</template>

<script setup lang="ts">
defineProps<{
  page: ParsedPage
}>()

function isVisible (post: ParsedPage) {
  return !!post
}
</script>

<style lang="scss">
.uiControls.pageInfo {
  font-family: $titleFont;
  font-size: 16px;
  flex-wrap: nowrap !important;
  margin-top: 1.25rem;
  margin-left: -17.5px;

  .shield {
    padding: 0 18px;
  }
}
</style>
