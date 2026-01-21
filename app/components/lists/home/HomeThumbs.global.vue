<template>
  <client-only>
    <div class="homeThumbs">
      <p>
        Click to see a
        <a href="#recent" :class="{ active: !random }" @click.prevent="random = false">recent</a>
        or
        <a href="#random" :class="{ active: random }" @click.prevent="random = true; key++">random</a>
        selection of work :
      </p>
      <ThumbnailWall v-if="pages" :pages="pages" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { getPosts } from '~/stores/content'

const key = ref(0)
const random = useState('random', () => false)
const pages = computed(() => {
  return getPosts({
    sort: random.value ? 'random' : 'date',
  })
    .filter(item => item.media?.thumbnail)
    .filter(item => !item.path.startsWith('/archive/'))
    .filter(item => !item.path.startsWith('/blog/'))
    .slice(0, 6)
})
</script>

<style lang="scss">
.homeThumbs {

  .thumbnailWall {
    margin: 3rem 0;
  }

  a {
    color: $grey-lighter;
    //text-decoration: underline;
  }

  a.active {
    color: $accentColor;
    //text-decoration: none;

    &:after {
      //content: "*";
    }
  }

  a:not(.active):not(:hover) {
    text-decoration: underline;
    text-decoration-style: dotted;
  }
}
</style>
