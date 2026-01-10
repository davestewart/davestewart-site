<template>
  <a
    class="tagList__tag"
    :href="href"
    :class="{ selected, valid }"
    @click.exact.shift.prevent="onClick('toggle')"
    @click.exact.prevent="onClick('click')"
  >{{ tag.replace(/-/, ' ') }}</a>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
    },

    selected: {
      type: Boolean,
    },

    valid: {
      type: Boolean,
    },
  },

  computed: {
    href () {
      return `/search/?tags=${this.tag}`
    },
  },

  methods: {
    onClick (type) {
      this.$parent.$emit(type, this.href, this.tag)
    },
  },
}
</script>

<style lang="scss">
.tagList {
  display: flex;
  flex-wrap: wrap;

  &__tag {
    display: inline-block;
    padding: .3em .5em;
    vertical-align: middle;
    white-space: nowrap;

    @include sm {
      padding: .2em .5em;
    }

    &.selected {
      background: var(--theme);
      color: white !important;
      border-radius: 4px;
      text-decoration: none !important;
    }
  }
}

.showValid a.tagList__tag {
  color: $grey-light;
  &.valid {
    color: $accentColor;
  }
}
</style>
