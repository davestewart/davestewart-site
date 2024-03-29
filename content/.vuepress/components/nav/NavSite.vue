<template>
  <nav class="navSite">

    <!-- button -->
    <div class="navSite__button" @click="visible = !visible">
      <svg width="15px" height="14px" viewBox="0 0 15 14">
        <rect id="bar-1" fill="currentColor" x="2" y="3" width="11" height="2"></rect>
        <rect id="bar-2" fill="currentColor" x="2" y="7" width="11" height="2"></rect>
        <rect id="bar-3" fill="currentColor" x="2" y="11" width="11" height="2"></rect>
      </svg>
    </div>

    <!-- background -->
    <div v-if="visible" class="navSite__background" @mousedown="hide"></div>

    <!-- dropdown -->
    <div ref="dropdown" v-if="visible" class="navSite__dropdown">
      <div class="navSite__branding">
        <SiteBranding @click.native="hide" />
      </div>
      <NavSections headers @click="hide"/>
      <p class="navSite__promo">Are you looking for a new <a href="https://controlspace.app" target="_blank">tab manager</a>?</p>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },

  watch: {
    '$route.path' () {
      this.visible = false
    }
  },

  methods: {
    hide () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/variables";

.navSite {
  height: 100%;
  display: flex;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-width: 2.5rem;
    min-height: 2.5rem;
    border-right: 1px solid $grey-lightest;
    cursor: pointer;
    color: $grey-light;
    z-index: 100;

    &:hover {
      color: $accentColor;
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // dropdown
  // ---------------------------------------------------------------------------------------------------------------------

  &__background {
    @include fit;
    position: fixed;
    background: #FFFD;
  }

  &__dropdown {
    box-sizing: border-box;
    position: fixed;
    background: white;
    outline: 1px solid $grey-lightest;
    border-radius: 2px;
    z-index: 110;

    @include shadow-lg;

    @include sm {
      padding: .5rem;
      width: calc(100% - 20px);
      font-size: 1.3em;
      top: 10px;
      left: 10px;
    }

    @include md-up {
      position: absolute;
      max-width: calc(100% - 20px);
      padding: 1rem .25rem;
      top: 40px;
      left: 10px;
      height: auto;
      font-size: 1.15em;
    }

    @include full {
      left: -10px;
    }
  }

  &__branding {
    padding-bottom: 1rem;
    margin: .25rem 1rem 1.25rem;
    border-bottom: 1px dashed $grey-lightest;

    .siteBranding {
      padding: .75rem !important;

      &:hover {
        background: transparentize($grey-lightest, .6);
        border-radius: 4px;
      }
    }

    @media screen and (max-width: 430px), screen and (max-height: 470px) {
      display: none;
    }
  }

  &__promo {
    margin-top: 1rem;
    border-top: 1px dashed $grey-lightest;
    padding: 1rem 1rem 0;
    font-size: .85em;

    a {
      padding: .2rem;
    }

    @include sm {
      display: none;
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // sections
  // ---------------------------------------------------------------------------------------------------------------------

  .navSections {

    &__header {
      display: none;
      @include md-up {
        display: block;
      }
    }

    @include md-up {
      &__section {
        border-right: 1px dashed $grey-lightest;
        width: max-content;

        &:last-child {
          border: none;
        }
      }

      &__item {
        padding-right: 1rem !important;
      }
    }

    // hide some links in menu
    //.navSections__section[data-name="navigation"],
    a[href="/"],
    a[href="/search/"],
    a[href="/projects/personal/dave-stewart/"] {
      display: none;
    }

    @include md-up {
      a[href="/bio/"] {
        display: none;
      }
    }

  }
}

</style>
