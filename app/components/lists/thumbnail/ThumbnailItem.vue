<template>
  <article class="thumbnailItem">
    <!-- image -->
    <div class="thumbnailItem__image">
      <NuxtLink :to="page.permalink ?? page.path" draggable="false">
        <MediaImage :source="source" />
      </NuxtLink>
    </div>

    <!-- content -->
    <div class="thumbnailItem__content" :data-status="page.status || undefined">
      <h3 class="thumbnailItem__title">
        {{ title }}
      </h3>
      <p v-if="description">
        {{ description }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMedia } from '~/composables/useMedia'

const props = defineProps<{
  page: ContentPage
}>()

const source = useMedia(props.page?.media?.thumbnail)

const title = computed(() => {
  const page = props.page
  return page.shortTitle || page.title
})

const description = computed(() => {
  const page = props.page
  return page.description
})
</script>

<style lang="scss">
.thumbnailItem {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  display: inline-block;
  margin-bottom: 20px;
  background: white;

  padding: 0;
  border-radius: 6px;

  @include shadow-md;

  // box-shadow: 0 8px 8px 3px rgba($grey-lightest, .4);

  @include md {
    box-shadow: 0 5px 6px rgba(59, 92, 143, 0.05);
  }

  // stripes for transparent thumbnails
  &__image {
    overflow: hidden;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    @include md-up {
      background-image: linear-gradient(0deg, #f2f6f8 0%, #FFF 35%);
      a {
        @include striped(transparent, white);
      }
    }
  }

  a {
    display: block;
    font-size: 0;
    overflow: hidden;

    &:hover {
      img {
        transform: scale(1.07);
        transition-duration: .3s;
      }
    }
  }

  img {
    width: 100%;
    transition: all .6s cubic-bezier(0.180, 0.300, 0.125, 0.985);
    border-radius: 0;
  }

  &__content {
    position: relative;
    padding: .85rem 1rem 1rem;
    min-height: 4.4rem;

    h3 {
      font-size: 1.2em;
      margin: 0 0 .5rem;
      line-height: 1.1; // 1.3 is more comfortable, but this allows cards to tile better
    }
  }

  &__content[data-status]:after {
    position: absolute;
    top: -9px;
    right: 9px;
  }

  p {
    margin: 0;
    line-height: 1.5;
    font-size: .8rem;
    opacity: .6;
  }

  @include sm {
    box-shadow: none;

    &__image {
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      z-index: 1;

      // add a border for all images
      &:before {
        content: ' ';
        display: block;
        position: absolute;
        border: 1px dashed $borderColor;
        border-radius: 4px;
        @include fit;
        z-index: 0;
      }

      // hide border if not transparent
      img {
        position: relative;
      }
    }

    &__content {
      min-height: unset;
      padding-left: .25rem;
      padding-right: .25rem;

      h3 {
        font-size: 1.5em;
        margin: 0 -.5rem .5rem 0
      }
    }
  }

}

.thumbnailItem.shadow {
  @include shadow-thumb;
}
</style>
