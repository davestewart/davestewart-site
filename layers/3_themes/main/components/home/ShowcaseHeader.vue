<script lang="ts" setup>
const page = inject<Partial<PageContent>>('page', () => {})
const url = useRequestURL()
const showcase = useState('showcase', () => '')
</script>

<template>
  <header class="showcaseHeader">
    <h1>{{ page.title }}</h1>
    <span class="showcaseHeader__domain"><a :href="`https://${showcase}.davestewart.io`" target="_blank">{{ showcase }}.davestewart.io</a> | </span>
    <a href="mailto: dave@davestewart.co.uk" target="_blank">dave@davestewart.co.uk</a> |
    <a href="tel:+447976944805">+44 7976 944 805</a>
  </header>
</template>

<style lang="scss">
.showcaseHeader {
  text-align: center;

  &__domain {
    display: none;
    @media print {
      display: inline-block;
    }
  }
}
</style>
