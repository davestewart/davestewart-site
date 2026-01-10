<template>
  <div v-if="date" class="pageDate">
    <a
      class="pageDate__text"
      :href="href"
      :title="relative"
      @click.exact.prevent="onClick"
    ><span class="only-sm">{{ dateShort }}</span><span class="only-md-up">{{ dateLong }}</span></a>
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns'

export default {
  props: {
    date: {
      type: String,
    },
  },

  computed: {
    dateObject () {
      return new Date(this.date)
    },

    relative () {
      return formatDistance(this.dateObject, new Date())
    },

    dateShort () {
      return format(this.dateObject, 'MMM yyyy')
    },

    dateLong () {
      return format(this.dateObject, 'MMMM yyyy')
    },

    year () {
      return this.date.substr(0, 4)
    },

    href () {
      return `/search/?year=${this.year}`
    },
  },

  methods: {
    onClick () {
      this.$emit('click', this.href, this.date)
    },
  },
}
</script>

<style lang="scss">
.pageDate__text {
  display: inline-block;
  padding: .3em .5em;
  white-space: nowrap;
  color: black !important;
}
</style>
