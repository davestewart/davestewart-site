<template>
  <div v-if="tags.length" class="tagList" :class="{ showValid }">
    <TagItem
      v-for="tag in tags"
      :key="tag"
      :tag="tag"
      :selected="selected.includes(tag)"
      :valid="(valid || []).includes(tag)"
    >
      {{ tag.replace(/-/, ' ') }}
    </TagItem>
  </div>
</template>

<script>
import TagItem from './TagItem.vue'

export default {
  components: {
    TagItem,
  },

  props: {
    tags: {
      type: Array,
      default () {
        return []
      },
    },

    selected: {
      type: Array,
      default () {
        return []
      },
    },

    valid: {
      type: Array,
    },
  },

  computed: {
    showValid () {
      return Array.isArray(this.valid)
    },
  },
}
</script>

<style lang="scss">
.tagList {
  word-break: keep-all;
  display: flex;
}
</style>
