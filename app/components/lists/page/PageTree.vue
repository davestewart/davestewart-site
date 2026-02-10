<template>
  <div
    :id="`tree-${id}`"
    class="pageTree"
    :data-format="format"
    :data-depth="depth"
    :data-pages="pages.length"
    :data-folders="folders.length"
  >
    <div v-if="title && items?.length" class="pageTree__header">
      <component :is="headingTag" class="pageTree__title">
        <NuxtLink v-if="path" :to="path">
          {{ title }}
        </NuxtLink>
        <span v-else>{{ title }}</span>
      </component>
      <span v-if="desc" class="pageTree__desc">{{ desc }}</span>
    </div>

    <div v-if="folders.length" class="pageTree__folders">
      <PageTree
        v-for="item in folders"
        :key="item.path"
        :title="item.title"
        :path="item.path"
        :desc="item.description"
        :items="item.items"
        :format="format"
        :depth="(depth || 0) + 1"
      />
    </div>

    <div v-if="pages.length" class="pageTree__pages">
      <ThumbnailWall v-if="format === 'image'" :pages="pages" />
      <PageList v-else :pages="pages" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'PageTree',
})

const props = withDefaults(defineProps<{
  title?: string
  path?: string
  desc?: string
  items?: ContentItem[]
  format?: 'image' | 'text'
  depth?: number
}>(), {
  items: () => [],
  format: 'image',
  depth: 0,
})

function slugify (text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const id = computed(() => props.title ? slugify(props.title) : '')

const folders = computed(() => props.items.filter(item => item.type === 'folder'))

const pages = computed(() => props.items.filter(item => item.type === 'post'))

const headingTag = computed(() => `h${props.depth + 1}`)
</script>

<style lang="scss">
.pageTree {
  margin-bottom: .5em;
  line-height: 1;

  // HEADER

  &__header {
    padding: .5rem 0;
  }

  &__title {
    margin: 0 !important;
    font-size: 1.3rem;

    a {
      color: $textColor !important;
    }
  }

  &__desc {
    margin-top: .75em;
  }

  h2 {
    font-size: 1.8rem;
  }

  &__desc {
    display: block;
    font-size: .8em;
    color: #888888;
  }

  // ITEMS

  &__folders {
    margin-left: 2rem;
    @include md-down {
      margin-left: 0.5rem;
    }
  }

  &[data-depth="0"] > &__folders {
    margin-left: 0;
  }

  &__pages {
    margin: .5rem 0 0 2rem;
  }

  &[data-format="image"] &__pages,
  &[data-format="image"] &__folders {
    margin-left: 0;
  }

  // for thumbnails, only indent the first level
  &[data-format="image"][data-depth="1"] {
    > .pageTree__folders,
    > .pageTree__pages {
      margin-left: 2rem;
      @include md-down {
        margin-left: 0;
      }
    }
  }

  .pageList {
    margin-left: 0;
  }

  .pageItem {
    margin-bottom: .25em;
  }

  @include sm {
    &[data-format="image"] {
      .pageTree__folders,
      .pageTree__pages {
        margin-left: 0 !important;
      }
    }
  }

}
</style>
