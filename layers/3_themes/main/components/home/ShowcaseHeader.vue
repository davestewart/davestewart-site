<script lang="ts" setup>
const page = inject<Partial<PageContent>>('page', () => {})
const showcase = useState('showcase', () => '')
</script>

<template>
  <header class="showcaseHeader">
    <BioImage class="showcaseHeader__bio animate-block" />
    <div class="showcaseHeader__content">
      <h1 class="showcaseHeader__title animate-block">
        <span class="showcaseHeader__name">Dave Stewart</span>
        <span class="showcaseHeader__role">{{ page.title }}</span>
      </h1>
      <div class="showcaseHeader__links animate-block">
        <span class="showcaseHeader__domain">
          <a :href="`https://${showcase}.davestewart.io`" target="_blank">{{ showcase }}.davestewart.io</a> | </span>
          <a href="mailto: dave@davestewart.co.uk" target="_blank">dave@davestewart.co.uk</a> |
          <a href="tel:+447976944805">+44 7976 944 805</a>
      </div>
    </div>
  </header>
</template>

<style lang="scss">
.showcaseHeader {
  text-align: center;

  &__title {
    margin-top: 1.75rem !important;
    font-size: 3.8rem;
    line-height: 1.2;
  }

  &__name,
  &__role {
    display: block;
    color: $grey-darkest;
    line-height: 1.2;
  }

  &__role {
    font-size: .6em;
  }

  &__links {
    margin-top: .5rem;
    @include md-down {
      font-size: .8em;
    }
  }

  &__domain {
    display: none;
    @media print {
      display: inline;
    }
  }

  @media print {
    // name (3.2rem × 1.2lh) + role (1.92rem × 1.2lh) + 0.5rem gap + links (1rem × 1.2lh) ≈ 7.8rem
    --bio-size: 7.9rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
    text-align: left;

    &__content {
      flex: 1;
    }

    &__title {
      margin-top: -.15em !important;
      margin-bottom: .1em !important;
    }

    p {
      line-height: 1.4em;
    }

    &__bio {
      flex-shrink: 0;
      width: var(--bio-size);
      height: var(--bio-size);
      margin: 0;
      border-radius: .5rem;
      overflow: hidden;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
  }
}
</style>
