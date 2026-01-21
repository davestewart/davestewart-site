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

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { storage } from '../../utils/storage.js'

const props = defineProps<{
  github: string
}>()

const link = ref<HTMLAnchorElement>()

const src = computed(() =>
  `https://img.shields.io/github/stars/${props.github}?style=flat&color=%23ea4848&label=Stars%3A&logo=github`,
)

const href = computed(() =>
  `https://github.com/${props.github}#readme`,
)

const key = computed(() =>
  `badges/${props.github}`,
)

onMounted(() => {
  const width = storage.get(key.value)
  if (width && link.value) {
    link.value.style.width = width + 'px'
  }
})

function onLoad () {
  if (!link.value) return
  link.value.style.width = ''
  nextTick(() => {
    if (link.value) {
      const width = link.value.offsetWidth
      storage.set(key.value, width)
    }
  })
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
