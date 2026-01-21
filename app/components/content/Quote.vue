<template>
  <blockquote class="quote" :class="{ hero }">
    <div class="quote__size" :style="`font-size: ${size}em`">
      <span class="quote__text">{{ text }}</span>
      <div class="quote__cite">
        <span class="quote__name">{{ name }}</span>
        <template v-if="link">
          via <cite><a :href="link" target="_blank">{{ source }}</a></cite>
        </template>
      </div>
    </div>
  </blockquote>
</template>

<script setup lang="ts">
defineProps({
  text: { type: String, default: '' },
  name: { type: String, default: '' },
  source: { type: String, default: '' },
  link: { type: String, default: '' },
  hero: { type: Boolean, default: false },
  size: { type: [String, Number], default: '2' },
})
</script>

<style lang="scss">
.quote {
  box-sizing: border-box;

  @include md-up {
    padding: 1.5rem 2rem;
  }

  &__text {
    box-sizing: border-box;
    display: inline;
    font-family: $quoteFont;
    font-size: 1.5em;
    font-weight: bold;
    line-height: 1.2em;
    color: $accentColor;

    &:before {
      padding-right: .15em;
      margin-left: -.6em;
      font-size: 1.2em;
      content: "“";
      color: $grey-light;
    }

    &:after {
      padding-left: .15em;
      margin-right: -.6em;
      font-size: 1.2em;
      content: "”";
      color: $grey-light;
    }
  }

  &__cite {
    font-size: .8rem;
    margin-top: -0.4em;
  }

  &__name {
    color: $grey;
  }

  &.hero {
    width: 100%;
    text-align: center;

    @include sm {
      padding: 1.5rem 1rem;
      font-size: .75rem !important;

      .quote__cite {
        margin-top: .8em;
      }
    }

    @include md-up {
      padding: 3rem 5rem;
      .quote__text {
        font-size: 2em;
        line-height: .9em;
      }

      .quote__cite {
        margin-top: .8em;
      }
    }
  }
}
</style>
