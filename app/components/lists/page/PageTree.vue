<template>
  <div
    class="pageTree"
    :data-format="format"
    :data-depth="depth"
    :data-pages="pages.length"
    :data-folders="folders.length"
  >
    <!--
    <pre>{{ items?.map(item => {
      return {
        title: item.title,
        path: item.path,
        layout: item.layout,
        type: item.type,
      }
    }) }}</pre>
    -->
    <div v-if="title && items?.length" class="pageTree__header">
      <component :is="headingTag" class="pageTree__title">
        <a :id="id"></a>
        <NuxtLink :to="path">
          {{ title }}
        </NuxtLink>
      </component>
      <span v-if="desc" class="pageTree__desc">{{ desc }}</span>
    </div>

    <div v-if="folders.length" class="pageTree__folders">
      <PageTree
        v-for="page in folders"
        :key="page.path"
        :title="page.title"
        :path="page.path"
        :desc="page.desc || page.description"
        :items="page.pages"
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
import PageItem from './PageItem.vue'
import { isVisible } from '~/store/config/status'
// We filtered in useFolder, so we might not need isVisible here if data is already clean.
// But let's assume items passed might need filtering?
// Actually useFolder filtered them.
// Let's rely on passed items.

defineOptions({
  name: 'PageTree',
})

const props = withDefaults(defineProps<{
  title?: string
  path?: string
  desc?: string
  items?: any[]
  format?: 'image' | 'text'
  depth?: number
}>(), {
  items: () => [],
  format: 'image',
  depth: 0,
})

// Simple slugify
const slugify = (text: string) => text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '')

const id = computed(() => props.title ? slugify(props.title) : '')
// slug logic in original was relative to page path?
// path.replace(this.$page.path, '')
// Let's stick to simple ID for now.

const folders = computed(() => props.items.filter(item => item.type === 'folder'))
const pages = computed(() => props.items.filter(item => item.type !== 'folder')) // assume already filtered for visibility

// Heading component replacement
// Use <component :is="h..." />
const headingTag = computed(() => `h${props.depth + 1}`)
</script>

<style lang="scss">
.pageTree {
  margin-bottom: .5em;

  // HEADER

  &__header {
    //margin: 1rem -1rem .5rem;
    //padding: .5rem 1rem;
    //border-bottom: 1px dashed $borderColor;
    margin: .5rem 0;
    padding: .5rem 0;
  }

  &__title {
    margin: 0;
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
