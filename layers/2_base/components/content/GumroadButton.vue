<script lang="ts" setup>
defineProps<{
  url: string
}>()

const trigger = ref('')

onMounted(() => {
  trigger.value = 'gumroad-button'
})
</script>

<template>
  <a :class="trigger" :href="url">Purchase on</a>
</template>
