<template>
  <div
    class="codepen"
    :data-height="height"
    :data-slug-hash="hash"
    data-user="davestewart"
    data-theme-id="light"
    data-default-tab="result"
    :style="`height: ${height}px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;`"
  >
    <span>
      See the Pen <a :href="`https://codepen.io/davestewart/pen/${hash}`"> {{ title }}</a>
      by Dave Stewart (<a href="https://codepen.io/davestewart">@davestewart</a>)
      on <a href="https://codepen.io">CodePen</a>.
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  hash: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  height: {
    type: [String, Number],
    required: true,
  },
})

useEmbed('https://cpwebassets.codepen.io/assets/embed/ei.js')
</script>

<style>
.cp_embed_wrapper {
  margin: 2rem auto;
}
</style>
