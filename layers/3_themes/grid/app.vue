<template>
  <div id="app">
    <template v-for="source in sources" :key="source.src">
      <MediaImage
        :source="source"
        width="240"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import PageTree from '~~/themes/main/components/lists/page/PageTree.vue'
import ThumbnailWall from '~~/themes/main/components/lists/thumbnail/ThumbnailWall.vue'

const store = useMetaStore()
await callOnce('items', () => store.loadItems())

const tree = store.search({ path: '/' })
const items = store.getPosts()

const sources = computed(() => {
  const sources = tree.items
    .filter((item) => item.type === 'post')
    .map((item) => {
      const { thumbnail } = item.media ?? {}
      if (thumbnail) {
        const { style, ...rest } = useMedia(item.media?.thumbnail)
        return rest
      }
      return
    })
  return sources.filter(Boolean) as MediaItem[]
})
</script>
