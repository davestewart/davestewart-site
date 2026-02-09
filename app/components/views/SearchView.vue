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
              <label class="searchControls__label">Tags: </label>
              <UiRadio
                v-model="query.tagsFilter"
                name="filter"
                :count="query.tags.length ? query.tags.length : ''"
                :count-state="options.showTags ? 0 : 1"
                :options="options.filter"
              />
            </div>

            <!-- grouping -->
            <div class="searchControls__group only-md-up">
              <label class="searchControls__label">Group: </label>
              <UiRadio v-model="query.group" name="group" :options="options.group" />
            </div>

            <!-- format -->
            <div class="searchControls__format">
              <label class="searchControls__label">Format: </label>
              <UiRadio v-model="query.format" name="format" :options="options.format" />
            </div>
          </UiControls>
        </div>

        <!-- tags -->
        <div v-show="options.showTags" class="search__tags-container">
          <TagMatrix
            class="search__tags"
            :mode="query.tagsFilter"
            :selected="query.tags"
            :pages="filtered"
            @toggle="toggleTag"
            @click="setTag"
          />
        </div>
      </div>

      <div class="layout__folder">
        <div v-if="itemsAsList.length" class="search__results">
          <!-- by date -->
          <div v-if="query.group === 'date'" class="search__date">
            <div
              v-for="group in itemsByYear"
              :key="group.title"
              class="pageTree"
              :data-mode="query.format"
            >
              <div class="pageTree__header">
                <h2 :id="`year_${group.title}`" class="pageTree__title">
                  {{ group.title }}
                </h2>
              </div>
              <div class="pageTree__pages">
                <ThumbnailWall v-if="query.format === 'image'" :pages="group.items" />
                <PageList v-else :pages="group.items" />
              </div>
            </div>
          </div>

          <!-- by path -->
          <div v-else-if="query.group === 'path'" class="search__tree">
            <PageTree :format="query.format" :items="itemsAsTree" />
          </div>

          <!-- thumbnails -->
          <div v-else-if="query.group === 'thumbs'" class="search__list">
            <ThumbnailWall :pages="itemsAsList as ContentPage[]" />
          </div>
        </div>

        <div v-else class="search__noResults">
          <p>No results for those search parameters!</p>
        </div>
      </div>
    </ClientOnly>
    <!-- header -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke, useLocalStorage } from '@vueuse/core'
import { type ContentItem, getItems, makeTree } from '~/stores/content'
import {
  cleanQuery,
  DEFAULT_SEARCH_PATHS,
  groupBy,
  makeDefaultQuery,
  parseQuery,
  searchContent,
  type SearchQuery,
} from '~/stores/search'
import { UiIcon } from '#components'
import type { Link } from '~/stores/nav'

const route = useRoute()
const router = useRouter()

// ---------------------------------------------------------------------------------------------------------------------
// variables
// ---------------------------------------------------------------------------------------------------------------------

const searchInput = ref<HTMLElement | null>(null)

const storedOptions = useLocalStorage<Pick<SearchQuery, 'group' | 'format' | 'tagsFilter'>>('searchOptions', {
  group: 'path',
  format: 'image',
  tagsFilter: 'off',
})

const query = reactive<SearchQuery>({
  ...makeDefaultQuery(),
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
  router.replace({ path: '/search/', query: cleanQuery(val) }).catch(() => { })

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
// data
// ---------------------------------------------------------------------------------------------------------------------

const filtered = computed(() => {
  return searchContent(query, {
    paths: DEFAULT_SEARCH_PATHS,
    excludeDrafts: true,
  })
})

const itemsAsList = computed(() => {
  return filtered.value.filter((item: ContentItem) => item.type === 'post')
})

const itemsByYear = computed(() => {
  const items = itemsAsList.value.filter((item: ContentItem) => item.path !== '/')
  return groupBy(items, 'date', (date: string) => date && date.substring(0, 4))
})

const itemsAsTree = computed(() => {
  if (!isFiltered.value) {
    return makeTree(filtered.value, '/')
  }

  // TODO: the following code is crap; look to filter tree in main search

  // use existing breadcrumbs function to get all parents for filtered items
  const breadcrumbs: Map<string, Link> = new Map()
  for (const page of filtered.value) {
    const parents = getContentParents(page.path)
    parents.pop()
    for (const parent of parents) {
      if (!breadcrumbs.has(parent.path)) {
        breadcrumbs.set(parent.path, parent)
      }
    }
  }

  // convert breadcrumbs to content items
  const items = getItems('/')
  const folders = Array
    .from(breadcrumbs.values())
    .map(breadcrumb => items.find(item => item.path === breadcrumb.path))
    .filter(item => item !== undefined)
    .filter(Boolean)

  const merged = [...filtered.value, ...folders]//.sort(sortBySection)

  // make the tree
  return makeTree(merged, '/')
})

// ---------------------------------------------------------------------------------------------------------------------
// flags
// ---------------------------------------------------------------------------------------------------------------------

const isFiltered = computed(() => {
  return query.text || query.tags.length > 0
})

const canReset = computed(() => {
  return query.text !== '' || query.tags.length > 0
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
  if (tags.length) {
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

watch(searchTitle, (val) => {
  if (import.meta.client) {
    document.title = `Search${val ? ' ' + val : ''} | Dave Stewart`
  }
})

const pageDescription = computed(() => {
  return isFiltered.value
    ? plural(itemsAsList.value.length, 'item')
    : 'Everything on the site'
})

// ---------------------------------------------------------------------------------------------------------------------
// methods
// ---------------------------------------------------------------------------------------------------------------------

function reset () {
  const def = makeDefaultQuery()
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
  if (query.show) {
    if (/^\d{4}$/.test(query.show)) {
      query.group = 'date'
      setTimeout(() => {
        document.querySelector(`#year_${query.show}`)?.scrollIntoView({ behavior: 'smooth' })
      }, 750)
    }
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

  &__label {
    font-size: 11px;
    font-weight: 600;
    margin: 0 .5em;

    @include md-down {
      display: block;
    }
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

      label {
        padding: 0 0 10px 1px;
      }
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
