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
import { ref } from 'vue'
import { getPosts } from '~/composables/useNavigation'

const key = ref(0)
const random = useState('random', () => false)

const { data: pages } = useAsyncData('home-thumbs', () => {
  return getPosts({
    limit: 6,
    random: random.value,
    sorted: !random.value,
  })
}, {
  watch: [key, random],
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
