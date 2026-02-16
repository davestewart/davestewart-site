<template>
  <div class="layout__home home">
    <Splash />
    <ContentRenderer id="content" :value="page" class="pageContent" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  page: PageContent
}>()
</script>

<style lang="scss">
.home {

  h1 {
    font-weight: normal;
    margin-top: -.5rem;
  }

  h2 {
    line-height: 1.2;
  }

  hr {
    border: none;
    height: 0;
    background: none;
    border-top: 3px dotted $grey-lightest;
  }

  .homeThumbs,
  .pageContent {

    > ul,
    > p {
      @include introText;
    }

    ul {
      padding-left: 1rem;
    }

    li {
      font-size: .8em !important;
    }
  }
}
</style>
