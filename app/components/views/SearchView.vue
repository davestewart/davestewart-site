<template>
  <div class="layout__search">
    <ClientOnly>
      <h1 class="search__title">
        <span v-if="!isFiltered">Search...</span>
        <component :is="searchTitle" v-else />
      </h1>

      <!-- description -->
      <p class="description" style="display: flex">
        <span>{{ pageDescription }}</span>
      </p>

      <!-- parameters -->
      <div class="search__parameters">
        <!-- clear -->
        <button
          v-if="isFiltered"
          class="search__clear"
          :class="{ active: canReset }"
          @click.prevent="reset"
        >
          <UiIcon icon="close" :size="24" />
        </button>

        <div class="searchControls">
          <UiControls class="only-md-down">
            <!-- search input -->
            <div class="searchControls__text">
              <UiInput v-model="query.text" placeholder="Type to filter..." />
            </div>
          </UiControls>

          <!-- controls -->
          <UiControls>
            <!-- search input -->
            <div class="searchControls__text only-lg">
              <UiInput ref="searchInput" v-model="query.text" placeholder="Type to filter..." />
            </div>

            <!-- tags -->
            <div class="searchControls__tags">
              <UiRadio
                v-model="query.tagsFilter"
                label="Tags"
                name="filter"
                :count="query.tags.length ? query.tags.length : ''"
                :count-state="options.showTags ? 0 : 1"
                :options="options.filter"
              />
            </div>

            <!-- grouping -->
            <div class="searchControls__group">
              <UiRadio
                v-model="query.group"
                label="Group"
                name="group"
                :options="options.group"
              />
            </div>

            <!-- format -->
            <div class="searchControls__format">
              <UiRadio
                v-model="query.format"
                label="Format"
                name="format"
                :options="options.format"
              />
            </div>
          </UiControls>
        </div>

        <!-- tags -->
        <SlideUpDown :active="options.showTags" :duration="400" class="search__tags-container">
          <TagMatrix
            class="search__tags"
            :mode="query.tagsFilter"
            :selected="query.tags"
            :valid="results.tags"
            @toggle="toggleTag"
            @click="setTag"
          />
        </SlideUpDown>
      </div>

      <div class="layout__folder">
        <div v-if="results.items.length" class="search__results">
          <PageTree :format="query.format" :items="results.items" />
        </div>
        <div v-else class="search__noResults">
          <p>No results for those search parameters!</p>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke, useLocalStorage } from '@vueuse/core'
import SlideUpDown from 'vue-slide-up-down'

import {
  cleanQuery,
  makeSearchFilters,
  parseQuery,
  searchContent,
  type SearchQuery,
} from '@content/stores/search'
import { UiIcon } from '#components'

const route = useRoute()
const router = useRouter()

// ---------------------------------------------------------------------------------------------------------------------
// variables
// ---------------------------------------------------------------------------------------------------------------------

const searchInput = ref<HTMLElement | null>(null)

type StoredOptions = Required<Pick<SearchQuery, 'group' | 'format' | 'tagsFilter'>>

const storedOptions = useLocalStorage<StoredOptions>('searchOptions', {
  group: 'path',
  format: 'image',
  tagsFilter: 'off',
})

const query = reactive<Required<SearchFilters & StoredOptions>>({
  ...makeSearchFilters(),
  ...storedOptions.value,
  ...parseQuery(route.query),
})

const options = reactive({
  filter: ['off', 'list', 'groups'],
  group: ['path', 'date'],
  format: ['image', 'text'],
  showTags: query.tagsFilter !== 'off',
})

watch(query, (val) => {
  router
    // TODO fix this any
    .replace({ path: '/search/', query: cleanQuery(val) as any })
    .catch((err) => {
      console.log(err)
    })

  // Persist layout options to localStorage
  storedOptions.value = {
    group: val.group,
    format: val.format,
    tagsFilter: val.tagsFilter,
  }

  // Options sync
  options.showTags = query.tagsFilter !== 'off'
}, { deep: true })

// ---------------------------------------------------------------------------------------------------------------------
// flags
// ---------------------------------------------------------------------------------------------------------------------

const hasTags = computed(() => {
  return Array.isArray(query.tags) && query.tags.length > 0
})

const isFiltered = computed(() => {
  return query.text || hasTags.value
})

const canReset = computed(() => {
  return query.text !== '' || hasTags.value
})

// ---------------------------------------------------------------------------------------------------------------------
// derived
// ---------------------------------------------------------------------------------------------------------------------

const searchTitle = computed(() => {
  const { text, tags } = query
  const parts = []
  if (text) {
    parts.push(h('span', { className: 'searchTokens__text' }, text))
  }
  if (tags?.length) {
    for (const tag of tags) {
      if (parts.length) {
        parts.push(h('span', { class: 'searchTokens__punctuation' }, '+'))
      }
      parts.push(h('span', { class: 'searchTokens__tag' }, [
        // h(UiIcon, { icon: 'tag', color: 'black', size: 48 }),
        tag,
      ]))
    }
  }
  return h('div', { class: 'searchTokens' }, parts)
})

const pageDescription = computed(() => {
  return isFiltered.value
    ? plural(results.value.total, 'item')
    : 'Everything on the site'
})

// ---------------------------------------------------------------------------------------------------------------------
// data
// ---------------------------------------------------------------------------------------------------------------------

const searchQuery = computed(() => {
  return {
    ...query,
    excludeDrafts: true,
  }
})

const results = computed(() => {
  return searchContent(searchQuery.value)
})

// ---------------------------------------------------------------------------------------------------------------------
// methods
// ---------------------------------------------------------------------------------------------------------------------

function reset () {
  const def = {
    ...makeSearchFilters(),
    ...makeSearchOptions(),
  }
  query.text = def.text
  query.tags = def.tags
  query.tagsFilter = def.tagsFilter
}

function toggleTag (tag: string) {
  const idx = query.tags.indexOf(tag)
  if (idx === -1) query.tags.push(tag)
  else query.tags.splice(idx, 1)
}

function setTag (tag: string) {
  query.tags = tag !== query.tags[0] ? [tag] : []
}

// Keyboard
onKeyStroke('Escape', () => {
  if (query.text) {
    query.text = ''
    return
  }
  if (canReset.value) {
    reset()
    return
  }
  history.back()
})

onMounted(() => {
  const hash = useRoute().hash
  if (hash) {
    const slug = hash.substring(1)
    if (/^\d{4}$/.test(slug)) {
      query.group = 'date'
    }
    setTimeout(() => {
      document.querySelector(`#tree-${slug}`)?.scrollIntoView({ behavior: 'smooth' })
    }, 750)
  }
  nextTick(() => {
    searchInput.value?.focus()
  })
})
</script>

<style lang="scss">
.layout__search {
  margin-bottom: 4rem;
}

.search {

  &__title {
    margin-top: 0;
    padding-right: 3rem;
  }

  &__clear {
    position: absolute;
    top: 22px;
    right: 20px;
    padding: .6rem;
    font-size: 35px;
    line-height: 1rem;

    border: none;
    background: none;
    outline: none;
    font-family: $titleFont;

    color: $grey-lightest;
    text-decoration: none;
    cursor: default;
    font-weight: 400;
    user-select: none;

    @include md-down {
      top: 15px;
    }

    span {
      height: 0;
      width: 0;
    }

    &.active {
      color: black;
      cursor: pointer;

      &:hover {
        color: $accentColor;
      }
    }
  }

  &__clear,
  &__parameters a {
    transition: .2s all;
  }

  &__tags {
    padding: 1rem 0 .5rem;
  }

  &__tags-container {
    overflow: hidden;
  }

  &__results {
    margin-top: 1rem
  }

  &__tree {

    // hide descriptions for empty thumbnail folders
    .pageTree[data-pages="0"] > .pageTree__header > .pageTree__desc {
      display: none;
    }

    .pageTree {
      margin-bottom: 1.5rem;
    }
  }

  &__noResults {
    padding: 3rem;
    line-height: 1.6;
    text-align: center;
    font-family: $titleFont;
    font-size: 1.25rem;
    color: $grey-light;
  }

  .pageItem a:focus {
    outline: none;
    box-shadow: 0 0 0 2px $grey-lightest;
    border-radius: 2px;
  }
}

.searchControls {
  @include md-up {
    //margin-left: -1rem;
  }

  &__text {
    padding-right: 1rem;
    padding-left: 0;

    @include md-down {
      margin-bottom: .5rem;

      &,
      .uiInput {
        width: 100%;
      }
    }

    @include lg {
      width: 150px;
    }
  }

  @include md-down {

    & {
      margin-left: -.25rem;
    }

    .uiControls {
      flex-wrap: nowrap;
    }

    &__tags {
      padding-left: 0 !important;
      word-break: break-word;
    }

    .uiControls > * {
      padding: 5px;
      display: block;
    }
  }
}

.searchTokens {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .2em;
  word-break: break-word;

  &__text {
    color: $accentColor;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    color: $accentColor;
    letter-spacing: -.02em;
  }

  &__punctuation {
    color: $grey-light;
  }
}
</style>
