<template>
  <div id="app">
    <div class="grid">
      <template v-for="item in items" :key="item.path">
        <p>{{ item.path }}</p>
        <a :href="item.path" class="grid__item article">
          {{ item.description }}
        </a>
        <!--
        <MediaImage
          :source="getMedia(item)"
          width="240"
        />
        -->
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useMetaStore()
const tree = store.search({ path: '/', sort: 'date' })

const items = computed(() => {
  return tree.items
    .filter(item => item.type === 'post' && item.media?.thumbnail)
    .filter(Boolean)
})

function getMedia (item: MetaPost) {
  // eslint-disable-next-line
  const { style, ...rest } = useMedia(item.media.thumbnail)
  return rest
}
</script>

<style lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;

  &__item {
    padding: 0.75rem;
    background: #eee;
    aspect-ratio: 1/1;
    border-radius: 0.25rem;
    line-height: 1.4;
    text-decoration: none;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6; /* number of lines */
    overflow: hidden;
    //text-overflow: ellipsis;

    //overflow: hidden;
    //display: block;
    //height: 100%;
    color: black;

    &:hover {
      background: #ddd;
    }
  }
}
</style>
