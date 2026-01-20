<template>
  <div v-if="tags.length" class="tagList" :class="{ showValid }">
    <TagItem
      v-for="tag in tags"
      :key="tag"
      :tag="tag"
      :selected="selected?.includes(tag)"
      :valid="(valid || []).includes(tag)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TagItem from './TagItem.vue'

const props = withDefaults(defineProps<{
  tags: string[]
  selected?: string[]
  valid?: string[]
}>(), {
  selected: () => [],
})

const showValid = computed(() => Array.isArray(props.valid))
</script>

<style lang="scss">
.tagList {
  word-break: keep-all;
  display: flex;
}
</style>
