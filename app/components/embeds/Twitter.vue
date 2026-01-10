<template>
  <div class="twitter-tweet">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
useEmbed('https://platform.twitter.com/widgets.js')
</script>

<style>
.twitter-tweet {
  display: block;
  margin: 2rem auto !important;
}
</style>
