<template>
  <div class="searchTags" :data-mode="mode">
    <!-- list -->
    <div v-if="component === 'list'" class="searchTags__list">
      <TagList
        :tags="allTags"
        :selected="selected"
        :valid="valid"
      />
    </div>

    <!-- groups -->
    <div v-if="component === 'groups'" class="searchTags__groups">
      <div v-for="group in groups" :key="group.title" class="tagGroup">
        <label>{{ group.title }}:</label>
        <TagList
          :tags="group.tags"
          :selected="selected"
          :valid="valid"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import { useSearchStore } from '~/stores/search'

const components = ['list', 'groups']

const props = defineProps<{
  mode?: string
  selected?: string[]
  pages?: any[]
}>()

const emit = defineEmits(['click', 'toggle'])

const store = useSearchStore()

// Get all tags from store replacement
const allTags = computed(() => store.tagList)

const component = ref('list')
const groups = computed(() => store.tagGroups)

// Valid tags are those that appear in the filtered pages
const valid = computed(() => {
  return props.pages?.reduce((output: string[], page: any) => {
    const tags = page.frontmatter?.tags || page.tags
    if (tags?.length) {
      tags.forEach((tag: string) => {
        if (!output.includes(tag)) {
          output.push(tag)
        }
      })
    }
    return output
  }, []) || []
})

watch(() => props.mode, (value) => {
  if (value && components.includes(value)) {
    component.value = value
  }
}, { immediate: true })

function handleTagClick (tag: string, toggle: boolean) {
  emit(toggle ? 'toggle' : 'click', tag)
}

provide('handleTagClick', handleTagClick)
</script>

<style lang="scss">
.searchTags {

  &__groups {
    display: flex;
    flex-direction: column;
    padding-left: 4px;
    gap: 6px;
    @include md-down {
      gap: 4px;
    }
  }

  @include md-up {
    &__groups {
      padding-left: 15px;
    }

    > * {
      margin-left: 15px;
      border-left: 4px solid $grey-lightest;
      padding: 8px;
    }
  }

  @include md-down {
    .tagList__tag {
      //padding: .2em .5em;
    }
  }

  a {
    font-size: .8rem;
  }

  .tagList__tag {
    display: inline-block;
    @include md-up {
      margin: .1em .1em;
    }
  }

  .tagGroup {
    display: flex;
    font-size: 12px;

    label {
      display: flex;
      align-items: flex-start;
      padding: .3em 0;
      margin: .1em 0;
      min-width: 70px;
      font-weight: 600;
    }

    .tagList {
      display: inline-block;
      padding: 0 0 0 .5rem;
    }
  }
}
</style>
