<template>
  <div class="layout__search">
    <ClientOnly>
      <h1 class="search__title">
        <span v-if="!isFiltered">Search...</span>
        <span v-else class="accent">{{ searchTitle }}</span>
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
          <span>&times;</span>
        </button>

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
                v-model="query.tagsFilter"
                name="filter"
                label="Tags"
                :count="query.tags.length ? query.tags.length : ''"
                :count-state="options.showTags ? 0 : 1"
                :options="options.filter"
              />
            </div>

            <!-- grouping -->
            <div class="searchControls__group">
              <UiRadio v-model="query.group" name="group" :options="options.group" />
            </div>

            <!-- format -->
            <div class="searchControls__format only-md-up">
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
import { onKeyStroke } from '@vueuse/core'
import { type ContentItem, makeTree } from '~/stores/content'
import { type SearchQuery, searchContent, groupBy, parseQuery, makeDefaultQuery, cleanQuery, DEFAULT_SEARCH_PATHS } from '~/stores/search'

const route = useRoute()
const router = useRouter()
const searchInput = ref<HTMLElement | null>(null)

const query = reactive<SearchQuery>({
  ...makeDefaultQuery(),
  ...parseQuery(route.query),
})

const options = reactive({
  filter: ['off', 'list', 'groups'],
  group: ['date', 'path'],
  format: ['text', 'image'],
  showTags: query.tagsFilter !== 'off',
})

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
  return makeTree(filtered.value, '/')
})

const isFiltered = computed(() => {
  return query.text || query.tags.length > 0
})

const canReset = computed(() => {
  return query.text !== '' || query.tags.length > 0
})

const searchTitle = computed(() => {
  const { text, tags } = query
  const parts = []
  if (text) parts.push(text)
  if (tags.length) parts.push(tags.join(' + '))
  return parts.join(' & ')
})

const pageDescription = computed(() => {
  return isFiltered.value
    ? plural(itemsAsList.value.length, 'item')
    : 'Everything on the site'
})

// Watchers
watch(query, (val) => {
  router.replace({ path: '/search/', query: cleanQuery(val) }).catch(() => { })

  // Options sync
  options.showTags = query.tagsFilter !== 'off'
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
  query.tagsFilter = def.tagsFilter
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
  if (query.year) {
    query.group = 'date'
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
    margin-left: -1rem;
  }

  &__text {

    @include md-down {

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

    .uiControls > * {
      padding: 5px;
    }
  }
}
</style>
