<template>
  <div class="webStore">
    <p>To install, visit the Chrome Web Store and click the "Add to Chrome" button:</p>
    <div class="webStore__button">
      <a :href="url()" target="_store">
        <img src="/assets/img/chrome-web-store.png" :alt="`Install ${name} from the Chrome Web Store`" />
      </a>
    </div>
    <p v-if="rel" style="margin-bottom: 2rem">
      Note that you'll need to reload any loaded {{ rel }} pages after installation.
    </p>
    <p v-if="review" class="webStore__review">
      {{ rel ? 'And if' : 'If' }} you make use of extension and like it, please consider
      <a :href="url('reviews')" target="_store">leaving a review</a>
      – it really helps with visibility!
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  name: string
  rel?: string
  review?: boolean
}>()

function url (path = '') {
  return `https://chromewebstore.google.com/detail/${props.id}/${path}`
}
</script>

<style lang="scss">
.webStore {

  &__button {
    text-align: center;
    margin: 3rem 3rem 4rem;

    a {
      display: inline-block;
      outline: 1px solid $grey-lightest;
      text-decoration: none;
      box-shadow: 0 1rem 2rem #0002;

      &:hover {
        outline: 1px solid $grey-light;
      }
    }
  }

  &__review {

  }
}
</style>
