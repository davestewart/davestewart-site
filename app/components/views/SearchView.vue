<template>
  <div class="layout__search">
    <ClientOnly>
      <h1 class="search__title">
        <span>Search</span>
        <span v-if="searchTitle">: <span class="accent">{{ searchTitle }}</span></span>
      </h1>

      <!-- description -->
      <p class="description" style="display: flex">
        <span>{{ pageDescription }}</span>
      </p>

      <!-- parameters -->
      <div class="search__parameters">
        <!-- clear
        <button class="search__clear" :class="{ active: canReset }" @click.prevent="reset">
          <span>&times;</span>
        </button>
         -->

        <div class="searchControls">
          <UiControls class="only-sm">
            <!-- search input -->
            <div class="searchControls__text">
              <UiInput v-model="query.text" placeholder="Type to filter..." />
            </div>
          </UiControls>

          <!-- controls -->
          <UiControls>
            <!-- search input -->
            <div class="searchControls__text only-md-up">
              <UiInput ref="searchInput" v-model="query.text" placeholder="Type to filter..." />
            </div>

            <!-- tags -->
            <div class="searchControls__tags">
              <UiRadio
                v-model="query.filter"
                name="filter"
                label="Tags"
                :count="query.tags.length ? query.tags.length : ''"
                :count-state="options.showTags ? 0 : 1"
                :options="options.filter"
              />
            </div>

            <!-- sorting -->
            <div class="searchControls__sort">
              <UiRadio v-model="query.sort" name="sort" :options="options.sort" />
            </div>

            <!-- format -->
            <div class="searchControls__format">
              <UiRadio v-model="query.format" name="format" :options="options.format" />
            </div>
          </UiControls>
        </div>

        <!-- tags -->
        <div v-show="options.showTags" class="search__tags-container">
          <TagMatrix
            class="search__tags"
            :mode="query.filter"
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
          <div v-if="query.sort === 'date'" class="search__date">
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
          <div v-else-if="query.sort === 'path'" class="search__tree">
            <PageTree :format="query.format" :items="itemsAsTree" />
          </div>

          <!-- thumbnails -->
          <div v-else-if="query.sort === 'thumbs'" class="search__list">
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyDown, onKeyStroke } from '@vueuse/core'
import { type ContentItem, makeTree } from '~/stores/content'

// --- Types & Interfaces ---

interface Query {
  text: string
  textOp: string
  tags: string[]
  tagsOp: string
  filter: string
  group: 'path' | 'date'
  sort: 'path' | 'date'
  format: 'text' | 'image'
  path: string
  year: string
}

function groupBy (array: ContentItem[], key: string, iteratee?: (val: ContentItem) => any) {
  const result: any = {}
  array.forEach((item) => {
    const val = (iteratee
      ? iteratee(item[key])
      : item[key]) ?? 'No Date'
    if (!result[val]) result[val] = []
    result[val].push(item)
  })
  return Object.keys(result).sort().reverse().map(k => ({ title: k, items: result[k] }))
}

function makeTextFilter (text: string, useOr = true) {
  text = text.trim()
  if (text === '') {
    return () => true
  }
  const matches = text.toLowerCase().match(/\S+/g) || []
  const predicates = matches.map((t) => {
    return t.startsWith('/')
      ? (page: any) => page.path && page.path.includes(t)
      : (page: any) => {
        console.log({ t, page })
        return ((page.title || '') + (page.description || '')).toLowerCase().includes(t)
      }
  })
  return useOr
    ? (page: any) => predicates.some(fn => fn(page))
    : (page: any) => predicates.every(fn => fn(page))
}

function makeTagsFilter (tags: string[], useOr = false) {
  const orQuery = (page: ContentPage) => (page.tags ?? []).some((tag: string) => tags.includes(tag))
  const andQuery = (page: ContentPage) => {
    const pageTags = (page.tags ?? [])
    return tags.every((tag: string) => pageTags.includes(tag))
  }
  const query = useOr ? orQuery : andQuery
  return (item: ContentItem) => {
    return item.type === 'folder' || query(item)
  }
}

function makeDateFilter (year: string) {
  return (item: ContentItem) => {
    if (item.type === 'folder') {
      return true
    }
    const pageYear = item.date
      ? item.date.substring(0, 4)
      : ''
    return pageYear === year
  }
}

const makeDefaultQuery = (): Query => ({
  text: '',
  textOp: 'and',
  tags: [],
  tagsOp: 'and',
  filter: 'off',
  sort: 'path',
  format: 'text',
  path: '',
  year: '',
})

// --- Component Logic ---

const route = useRoute()
const router = useRouter()
const searchInput = ref<HTMLElement | null>(null)

// Initial Query state from route
const initialTags = route.query.tags || []
const query = reactive<Query>({
  ...makeDefaultQuery(),
  ...route.query as any,
  tags: Array.isArray(initialTags) ? initialTags : [initialTags],
})

// Options
const options = reactive({
  filter: ['off', 'list', 'groups'],
  sort: ['date', 'path'],
  format: ['text', 'image'],
  showTags: query.filter !== 'off',
})

// Data Fetching
const allPages = computed(() => getItems('/'))

// Filtering & Computed Props
const paths = {
  searchable: [
    '/archive/',
    '/products/',
    '/projects/',
    '/work/',
    '/blog/',
  ],
}

const prepared = computed(() => {
  // Filter visible and searchable pages
  let items = allPages.value.filter((p: any) => !p.draft) // basic visibility check

  items = items.filter((item: any) => {
    const path = item.path
    return path === '/' || paths.searchable.some(p => path.startsWith(p))
  })

  // Sort by date desc
  items.sort((a: any, b: any) => {
    const da = new Date(a.date || 0).getTime()
    const db = new Date(b.date || 0).getTime()
    return db - da
  })

  return items
})

const filtered = computed(() => {
  let items = prepared.value
  const { text, tags, year } = query

  if (tags.length) {
    items = items.filter(makeTagsFilter(tags as string[]))
  }

  if (text) {
    items = items.filter(makeTextFilter(text))
  }

  if (year) {
    // items = items.filter(makeDateFilter(year))
  }

  return items
})

const itemsAsList = computed(() => {
  return filtered.value.filter((item: any) => item.type === 'post')
})

const itemsByYear = computed(() => {
  let items = itemsAsList.value.filter((item: any) => item.path !== '/')
  return groupBy(items, 'date', (date: string) => date && date.substring(0, 4))
})

const itemsAsTree = computed(() => {
  return makeTree(filtered.value, '/')
})

const isFiltered = computed(() => prepared.value.length === filtered.value.length)

const canReset = computed(() => {
  const def = makeDefaultQuery()
  return query.text !== def.text || query.tags.length > 0
})

const searchTitle = computed(() => {
  const { text, tags } = query
  const parts = []
  if (text) parts.push(text)
  if (tags.length) parts.push(tags.join(' + '))
  return parts.join(' & ')
})

const pageDescription = computed(() => {
  return isFiltered.value ? 'Everything on the site' : plural(itemsAsList.value.length, 'item')
})

// Watchers
watch(query, (val) => {
  const cleanQuery: any = {}
  const def: any = makeDefaultQuery()
  for (const key in val) {
    if (String((val as any)[key]) !== String(def[key])) {
      cleanQuery[key] = (val as any)[key]
    }
  }
  router.replace({ path: '/search/', query: cleanQuery }).catch(() => { })

  // Options sync
  options.showTags = query.filter !== 'off'
}, { deep: true })

watch(searchTitle, (val) => {
  if (import.meta.client) {
    document.title = `Search${val ? ' ' + val : ''} | Dave Stewart`
  }
})

// Methods
const reset = () => {
  const def = makeDefaultQuery()
  query.text = def.text
  query.tags = def.tags
  query.filter = def.filter
}

const toggleTag = (tag: string) => {
  const idx = query.tags.indexOf(tag)
  if (idx === -1) query.tags.push(tag)
  else query.tags.splice(idx, 1)
}

const setTag = (tag: string) => {
  query.tags = tag !== query.tags[0] ? [tag] : []
}

// Keyboard
onKeyStroke('Escape', (e) => {
  // If input focused and has text, clear text
  // We don't have direct ref to input element instance easily unless we use ref bindings
  // Assuming generic behavior
  if (query.text) {
    query.text = ''
    return
  }
  if (canReset.value) {
    reset()
    return
  }
  // history.back() // removed for now
})


onMounted(() => {
  function onKeyDown (event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (!query.text) {
        history.back()
      }
    }
  }
  document.addEventListener('keydown', onKeyDown)
  onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown)
  })
  if (query.year) {
    query.sort = 'date'
    setTimeout(() => {
      document.querySelector(`#year_${query.year}`)?.scrollIntoView({ behavior: 'smooth' })
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
    /* transition? */
  }

  &__results {
    margin-top: 1rem
  }

  &__tree {

    // hide descriptions for empty thumbnail folders
    .pageTree[data-pages="0"]>.pageTree__header>.pageTree__desc {
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
    margin-left: -1rem;
  }

  &__text {

    @include sm {

      &,
      .uiInput {
        width: 100%;
      }
    }

    @include md-up {
      width: 150px;
    }
  }

  @include sm {
    .uiControls {
      flex-wrap: nowrap;
      margin: 0 -1rem .5rem;
    }

    .uiControls>* {
      padding: 5px;
    }
  }
}
</style>
