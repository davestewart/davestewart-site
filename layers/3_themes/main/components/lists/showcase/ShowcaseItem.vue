<template>
  <!-- showcase -->
  <div v-if="format === 'showcase'" class="showcaseItem" data-format="showcase">
    <p class="showcaseItem__title">
      <span v-if="date">
        {{ formatDate(new Date(date), 'MMM yyyy') }}<template v-if="duration">, {{ duration }}</template> |
      </span>
      <ShowcaseLink :path="path">
        <template v-if="role">{{ role }},</template>
        {{ title }}
      </ShowcaseLink>
    </p>
    <p v-if="tech" class="showcaseItem__tech">
      {{ tech }}
    </p>
    <p v-if="text" class="showcaseItem__text">
      {{ text }}
    </p>
  </div>

  <!-- table -->
  <div v-else-if="format === 'table'" class="showcaseItem" data-format="table">
    <p class="showcaseItem__title">
      <ShowcaseLink :path="path">
        {{ title }}
      </ShowcaseLink>
    </p>
    <p v-if="text" class="showcaseItem__text">
      {{ text }}
    </p>
  </div>

  <!-- paragraphs -->
  <div v-else-if="format === 'paragraphs'" class="showcaseItem" data-format="paragraphs">
    <p class="showcaseItem__title">
      <ShowcaseLink :path="path">
        {{ title }}
      </ShowcaseLink>
    </p>
    <p v-if="text" class="showcaseItem__text">
      {{ text }}
    </p>
  </div>

  <!-- bullets -->
  <li v-if="format === 'bullets'" class="showcaseItem" data-format="bullets">
    <div class="showcaseItem__title">
      <ShowcaseLink :path="path">
        {{ title }}
      </ShowcaseLink>
    </div>
    <div v-if="text" class="showcaseItem__text">
      {{ text }}
    </div>
  </li>
</template>

<script setup lang="ts">
import { formatDate } from 'date-fns'
import ShowcaseLink from './ShowcaseLink.vue'

defineProps<ShowcaseInfo & {
  format?: 'bullets' | 'paragraphs' | 'table' | 'showcase'
}>()
</script>

<script lang="ts">
export interface ShowcaseInfo {
  path: string
  title: string
  text?: string
  date?: string | undefined
  duration?: string
  role?: string
  tech?: string
  image?: string
}
</script>

<style lang="scss">
.showcaseItem {
  margin-bottom: 2rem;

  @media print {
    margin-bottom: 1rem;
  }

  p {
    margin: .2em 0;
  }

  &__title {
    @include md-down {
      font-size: 1.1em;
      font-weight: 500;
      margin-bottom: .5em;
    }
  }

  &__text {
    line-height: 1.4em;
  }

  &__tech {
    margin: .3em 0 !important;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: .02em;
    color: var(--theme);
  }

  &[data-format="showcase"] {
    .showcaseItem__title {
      display: block;
      font-weight: 600;
      font-size: 1.2rem;
      font-family: $titleFont;
      margin-bottom: .25rem;
    }
  }

  &[data-format="table"] {
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: .5rem 1.5rem;
    margin-bottom: .6rem;

    p {
      margin: 0;
    }

    @include md-down {
      display: block;
    }
  }

  &[data-format="paragraphs"] {
    margin-bottom: .75rem;
  }

  &[data-format="bullets"] {
    list-style-type: disc;

    .showcaseItem__text {
      font-size: .9rem;
      color: #888888;
      margin-bottom: 0.75em;
    }

    @include sm {
      font-size: 1rem;
    }
  }
}
</style>
