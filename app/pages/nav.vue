<script lang="ts" setup>
import { queryItems, getItems, getNavSurround, getNavParents, getNavSiblings, getNavTree } from '~/composables/useNavigation'

const methods = {
  'Raw Items': queryItems,
  'Items': getItems,
  'Siblings': getNavSiblings,
  'Surround': getNavSurround,
  'Parents': getNavParents,
  'Tree': getNavTree,
}
const method = ref<keyof typeof methods>('Raw Items')

const paths = [
  '/',
  '/archive/',
  '/products/',
  '/blog/',
  '/blog/software/',
  '/products/control-space/',
  '/blog/software/mac-finder-tips/',
  '/archive/projects/open-source/3dsmax/',
] as const
const path = ref(paths[0])

async function getData () {
  const key = method.value as keyof typeof methods
  const fn = methods[key]
  return fn(path.value)
}

const { data } = await useAsyncData(() => `nav-${path.value}`, getData, {
  watch: [method, path],
})
</script>

<template>
  <section class="nav">
    <section class="nav__method">
      <section class="nav__method">
        <div class="nav__group">
          <label v-for="name in paths" :key="name" class="nav__radio">
            <input
              v-model="path"
              type="radio"
              :value="name"
            />
            {{ name }}
          </label>
        </div>

        <div class="nav__group">
          <label v-for="(_, name) in methods" :key="name" class="nav__radio">
            <input
              v-model="method"
              type="radio"
              :value="name"
            />
            {{ name }}
          </label>
        </div>
      </section>
    </section>
    <pre>{{ path }}</pre>
    <section v-if="data && ('tree' in data) && 'pages' in data">
      <pre>{{ data.tree }}</pre>
      <pre>{{ data.pages }}</pre>
    </section>
    <section v-else>
      <pre>{{ data }}</pre>
    </section>
  </section>
</template>

<style lang="scss">
.nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 3rem;

  &__group {
    display: flex;
    flex-direction: column;
  }

  &__method {
    display: flex;
    gap: 10px;
  }

  section {
    display: flex;
    gap: 1rem;

    pre {
      overflow-x: auto;
      flex-grow: 1;
    }
  }
}
</style>
