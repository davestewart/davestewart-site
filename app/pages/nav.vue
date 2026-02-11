<script lang="ts" setup>
import { getContentParents, getContentSiblings, getContentSurround } from '@content/stores/nav'
import { searchContent } from '@content/stores/search'

definePageMeta({
  layout: 'wide',
})

const store = useContentStore()

const methods = {
  Items: store.getItems,
  Siblings: getContentSiblings,
  Surround: getContentSurround,
  Parents: getContentParents,
  Tree: () => {
    return searchContent({
      path: path.value,
    })
  },
}
const method = ref<keyof typeof methods>('Items')

const paths = {
  Folders: [
    '/',
    '/archive/',
    '/products/',
    '/projects/',
    '/blog/',
    '/blog/software/',
  ],
  Pages: [
    '/products/control-space/',
    '/blog/software/mac-finder-tips/',
    '/archive/projects/open-source/3dsmax/',
  ],
} as const

const path = ref(paths.Folders[0])

const data = computed(() => {
  const key = method.value as keyof typeof methods
  const fn = methods[key]
  return fn(path.value)
})
</script>

<template>
  <section class="nav">
    <!-- controls -->
    <section class="nav__method">
      <section class="nav__method">
        <div v-for="(names, type) in paths" :key="type" class="nav__section">
          <label for="">{{ type }}</label>
          <div class="nav__radios">
            <label v-for="name in names" :key="name" class="nav__radio">
              <input
                v-model="path"
                type="radio"
                :value="name"
              />
              <code>{{ name }}</code>
            </label>
          </div>
        </div>
        <div>
        </div>

        <div class="nav__section">
          <label for="">Function</label>
          <div class="nav__radios">
            <label v-for="(_, name) in methods" :key="name" class="nav__radio">
              <input
                v-model="method"
                type="radio"
                :value="name"
              />
              {{ name }}
            </label>
          </div>
        </div>
      </section>
    </section>

    <!-- tree view -->
    <section v-if="data && ('tree' in data) && 'pages' in data" class="tree">
      <pre>Pages: {{ data.pages }}</pre>
      <pre>Tree: {{ data.tree }}</pre>
      <pre>Headers: {{ data.headers }}</pre>
    </section>

    <!-- data view -->
    <section v-else>
      <pre>Pages: {{ data }}</pre>
    </section>
  </section>
</template>

<style lang="scss">
.nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__section {
    padding-bottom: 1rem;
    & > label {
      display: block;
      margin-bottom: .5rem;
      font-weight: 600;
    }
  }

  &__radios {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__method {
    display: flex;
    gap: 10px;
  }

  pre {
    overflow-x: auto;
    flex-grow: 1;
  }

  section {
    display: flex;
    gap: 1rem;
  }

  section.tree {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
  }
}
</style>
