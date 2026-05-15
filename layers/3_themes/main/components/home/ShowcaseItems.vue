<template>
  <div class="showcaseItems">
    <div
      v-for="item in pages"
      :key="item?.path"
    >
      <ShowcaseItem
        v-bind="item"
        :path="item.path"
        :format="format"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { PageContent } from '@content/types'
import type { ShowcaseInfo } from '../lists/showcase/ShowcaseItem.vue'

interface ShowcaseFrontmatter {
  title: string
  text: string
  date: string
  href: string
  image?: string
}

const props = withDefaults(defineProps<{
  path: string
  format?: 'bullets' | 'paragraphs' | 'table' | 'showcase'
  text?: 'summary' | 'description' | 'none'
}>(), {
  format: 'table',
})

const page = inject<Ref<PageContent>>('page')?.value
const store = useMetaStore()

const items: ShowcaseFrontmatter[] | string[] | undefined = getValue(page, props.path) ?? []

const pages = computed<ShowcaseInfo[]>(() => {
  if (!items) return []

  return items.map((item) => {
    // extract variables
    const {
      title = '',
      text = '',
      href = '',
      image,
    } = typeof item === 'string'
      ? { href: item }
      : item

    // resolve post
    let post: MetaPost
    if (href.startsWith('https://davestewart.co.uk/') || href.startsWith('/')) {
      const path = href.replace('https://davestewart.co.uk', '')
      const found = store.getItem(path) as MetaPost
      if (!found) {
        console.warn(`Post not found for path: ${path}`)
        return
      }
      post = found
    }
    else {
      const thumbnail = image ? `${image}?width=844&height=422` : undefined
      post = { title, description: text, path: href, media: { thumbnail } } as MetaPost
    }

    return {
      title: post.title,
      path: post.path,
      date: post.date,
      duration: post.duration,
      role: post.role,
      tech: post.tech,
      text: props.text === 'none'
        ? ''
        : props.text
          ? post[props.text] ?? text
          : post.summary || text,
    } satisfies ShowcaseInfo
  })
    // TODO fix TS undefined date error
    .filter(Boolean) as ShowcaseInfo[]
})
</script>

<style lang="scss">
.pageList {
  margin: 0 0 0 2rem;
  padding: 0;
  list-style: none;
}

.showcaseItems {
  margin: 1.5rem 0 1.5rem 1.5rem;
}
</style>
