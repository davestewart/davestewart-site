<template>
  <div v-if="date" class="pageDate">
    <NuxtLink
      class="pageDate__text"
      :href="`/search/?show=${year}`"
      :title="relative"
    >
      {{ dateShort }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format, formatDistance } from 'date-fns'

const props = defineProps<{
  date?: string
}>()

const dateObject = computed(() => (props.date ? new Date(props.date) : new Date()))

const relative = computed(() => formatDistance(dateObject.value, new Date()))

const dateShort = computed(() => format(dateObject.value, 'MMM yyyy'))

const year = computed(() => props.date?.slice(0, 4) || '')
</script>

<style lang="scss">
.pageDate__text {
  display: inline-block;
  padding: .3em .5em;
  white-space: nowrap;
  color: black !important;

  &:hover span {
    text-decoration: underline;
  }
}
</style>
