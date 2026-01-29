<template>
  <NuxtLink class="siteBranding" :to="to">
    <SiteIcon class="siteBranding__icon" />
    <div v-if="!icon" class="siteBranding__text">
      <span>Dave Stewart</span>
      <span>Web Developer + Indie Maker</span>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  icon?: boolean
  to?: string
}>(), {
  to: '/',
})
</script>

<style lang="scss">
.siteBranding {
  display: flex;
  color: unset;
  margin: -5px;
  padding: .5rem;
  font-size: 1rem !important;
  text-decoration: none !important;

  &__icon {
    height: 32px;
    width: auto;
    fill: $grey;
    opacity: .8;
  }

  &:hover {
    .siteBranding__icon {
      opacity: 1;
    }
  }

  &__text {
    height: 32px;
    margin-left: .5rem;
    line-height: 1;
    color: $grey;
    position: relative;

    span {
      position: relative;
      display: block;
      white-space: nowrap;
    }

    :first-child {
      top: -.1em;
      font-family: $titleFont;
      font-weight: 600;
      font-size: 1.35em;
      opacity: .8;
    }

    :last-child {
      bottom: -.15em;
      font-size: .65em;
      opacity: .6;
    }
  }

  .navSide &,
  &:hover {
    svg {
      fill: $accentColor;
    }

    span {
      color: $textColor;
    }
  }

  &__icon,
  &__text span {
    @include hover;
  }
}
</style>
