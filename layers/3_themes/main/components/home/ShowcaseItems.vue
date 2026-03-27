<template>
  <ul class="pageList">
    <ThumbnailWall v-if="thumbnails" :pages="pages" />
    <template v-for="page in pages" v-else :key="page?.path">
      <PageItem v-if="page" :page="page" />
    </template>
  </ul>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { PageContent } from '@content/types'
import { formatDate } from 'date-fns'

interface ShowcaseItem {
  title: string
  description: string
  date: string
  href: string
  image?: string
}

const props = defineProps<{
  items: string
  thumbnails?: boolean
}>()

const page = inject<Ref<PageContent>>('page')?.value
const store = useMetaStore()

const items: ShowcaseItem[] | string[] | undefined = getValue(page, props.items) ?? []

const pages = computed<MetaPost[]>(() => {
  if (items) {
    return items?.map((item) => {
      // extract variables
      const {
        title = '',
        description = '',
        href = '',
        image,
      } = typeof item === 'string'
        ? { href: item }
        : item

      // convert absolute links to routes
      if (href.startsWith('https://davestewart.co.uk/') || href.startsWith('/')) {
        const path = href.replace('https://davestewart.co.uk', '')
        const post = store.getItem(path) as MetaPost
        if (post) {
          const date = formatDate(new Date(post.date), 'MMM yyyy')
          return {
            ...post,
            description: `${date} | ${post.description}`,
          }
        }
        return { title: 'Missing post', description: path, path }
      }

      // thumbnail
      const thumbnail = image
        ? `${image}?width=844&height=422`
        : undefined
      return {
        title,
        description,
        path: href,
        media: { thumbnail },
      } as MetaPost
    })
      .filter(item => item?.title) as MetaPost[]
  }
  return []
})
</script>

<style lang="scss">
.pageList {
  margin: 0 0 0 2rem;
  padding: 0;
  list-style: none;
}
</style>
