<template>
  <div class="prose-pre" :data-lang="lang">
    <pre :class="`language-${lang}`"><slot /></pre>
    <span
      v-if="label && label !== 'text' && !hideLabel"
      class="prose-pre__label"
      @click="copyCode"
    >
      {{ label }}
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  code: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
}>(), {
  language: 'text',
})

const lang = computed(() => {
  const lookup: Record<string, string> = {
    tree: 'text',
    typescript: 'ts',
    javascript: 'js',
    markdown: 'md',
    yml: 'yaml',
  }
  return lookup[props.language] ?? props.language
})

const hideLabel = computed(() => {
  return props.language === 'text' || props.meta === 'nolabel'
})

const copied = ref(false)

const label = computed(() => {
  const lookup: Record<string, string> = {
    ts: 'TypeScript',
    js: 'JavaScript',
    tree: 'Text',
    vue: 'Vue',
    xml: 'XML',
    html: 'HTML',
    yaml: 'YAML',
    json: 'JSON',
    css: 'CSS',
    scss: 'SCSS',
    md: 'Markdown',
    bash: 'Bash',
    http: 'cURL',
  }
  return copied.value
    ? 'Copied!'
    : lookup[lang.value] ?? lang.value
})

function copyCode () {
  copied.value = true
  navigator.clipboard.writeText(props.code)
  setTimeout(() => copied.value = false, 2000)
}
</script>
