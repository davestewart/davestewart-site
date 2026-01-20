<template>
  <span class="shield">
    <a
      ref="link"
      :href="href"
      target="_blank"
      class="shield__link"
    >
      <img
        ref="img"
        class="shield__image"
        :src="src"
        :alt="github"
        :title="github"
        @load="onLoad"
      />
    </a>
  </span>
</template>

<script>
import { storage } from '../../utils/storage.js'

export default {
  props: {
    github: String,
  },

  computed: {
    src () {
      return `https://img.shields.io/github/stars/${this.github}?style=flat&color=%23ea4848&label=Stars%3A&logo=github`
    },

    href () {
      return `https://github.com/${this.github}#readme`
    },

    key () {
      return `badges/${this.github}`
    },
  },

  mounted () {
    const width = storage.get(this.key)
    if (width) {
      this.$refs.link.style.width = width + 'px'
    }
  },

  methods: {
    onLoad () {
      const img = this.$refs.link
      img.style.width = ''
      this.$nextTick(() => {
        const width = img.offsetWidth
        storage.set(this.key, width)
      })
    },
  },
}
</script>

<style lang="scss">
.shield {

  &__link {
    display: block;
    height: 20px;
    min-width: 83px; // 83: double-digits, 91: triple digits
    border-radius: 3px;
    background: url(../../assets/shield.svg) top left;
    background-size: 100px 20px;
  }

  &:hover {
    opacity: .9;
  }

  &, * {
    font-size: 0;
  }
}
</style>
