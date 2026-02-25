<template>
  <div id="app">
    <div class="container">
      <h1 class="pico-color-red-500">
        Dave Stewart
      </h1>
      <hgroup>
        <h4>Pico Theme Demo</h4>
        <p>Simple <a href="https://picocss.com/">Pico</a> theme layer to demonstrate dynamic theming</p>
      </hgroup>
      <section v-for="group in tree.items" :key="group.slug">
        <h6>{{ group.title }}</h6>
        <ul v-for="item in group.items" :key="item.slug">
          <li>
            <a :href="item.path" class="grid__item article">
              {{ item.title }}
            </a>
            <p>
              {{ item.description}}<br>
              <small class="pico-color-zinc-250">{{ item.path.replace(/[^/]+\/$/, '') }}</small>
            </p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useMetaStore()
const tree = store.search({ path: '/', sort: 'date', group: 'date' })
</script>

<style lang="scss">

</style>
