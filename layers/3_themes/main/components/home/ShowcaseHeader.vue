<script lang="ts" setup>
const page = inject<Partial<PageContent>>('page', () => {})
const showcase = useState('showcase', () => '')
</script>

<template>
  <header class="showcaseHeader">
    <h1 class="showcaseHeader__title animate-block">
      <span class="showcaseHeader__name">Dave Stewart</span>
      <span class="showcaseHeader__role">{{ page.title }}</span>
    </h1>
    <div class="showcaseHeader__links animate-block">
      <span class="showcaseHeader__domain"><a :href="`https://${showcase}.davestewart.io`" target="_blank">{{ showcase }}.davestewart.io</a> | </span>
      <a href="mailto: dave@davestewart.co.uk" target="_blank">dave@davestewart.co.uk</a> |
      <a href="tel:+447976944805">+44 7976 944 805</a>
    </div>
  </header>
</template>

<style lang="scss">
.showcaseHeader {
  text-align: center;

  &__title {
    margin-top: 2rem !important;
    font-size: 3.2rem;
    line-height: 1.2;
  }

  &__name,
  &__role {
    display: block;
    color: $grey-darkest;
  }

  &__role {
    font-size: .6em;
  }

  &__links {
    @include md-down {
      font-size: .8em;
    }
  }

  &__domain {
    display: none;
    @media print {
      display: inline-block;
    }
  }
}
</style>
