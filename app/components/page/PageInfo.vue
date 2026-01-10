<template>
  <UiControls class="pageInfo">
    <PageDate v-if="doc.date" :date="doc.date" @click="search" />
    <PageStats v-if="doc.duration" v-bind="doc.duration" />
    <PageShare v-if="doc.isVisible" :page="doc" />
    <Shield v-if="doc.repo" :repo="doc.repo" class="only-md-up" />
    <TagList v-if="doc.tags" :tags="doc.tags" @click="search" />
  </UiControls>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  doc: ContentItem
}>()

const router = useRouter()

const search = (href: string) => {
  router.push(href)
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
