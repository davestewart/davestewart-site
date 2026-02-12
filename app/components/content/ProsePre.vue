<template>
  <div class="prosePre" :data-lang="lang">
    <div class="prosePre__code" v-html="html" />
    <span
      v-if="label && label !== 'text' && !hideLabel"
      class="prosePre__label"
      @click="copyCode"
    >
      {{ label }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { codeToHtml } from 'shiki'
import { createCssVariablesTheme } from 'shiki/core'

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

const label = computed(() => {
  const lookup: Record<string, string> = {
    ts: 'TypeScript',
    js: 'JavaScript',
    vue: 'Vue',
    xml: 'XML',
    html: 'HTML',
    yaml: 'YAML',
    json: 'JSON',
    css: 'CSS',
    scss: 'SCSS',
    md: 'Markdown',
    bash: 'Bash',
  }
  return copied.value
    ? 'Copied!'
    : lookup[lang.value] ?? lang.value
})

const theme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
})

const html = await codeToHtml(props.code.trim(), {
  lang: lang.value,
  theme: theme,
})

const copied = ref(false)

function copyCode () {
  copied.value = true
  navigator.clipboard.writeText(props.code)
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style lang="scss">
.prosePre {
  position: relative;
  margin: 2rem 0;
  cursor: default;

  & + & {
    margin-top: 1rem;
  }

  &__label {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    font-size: 0.75rem;
    opacity: 0.25;
    transition: opacity 0.2s ease-in-out;
    user-select: none;
    cursor: pointer;
  }

  &:hover &__label{
    opacity: 1;
    color: var(--theme);
  }

  &[data-lang="text"] code {
    line-height: 1.4;
  }
}

/*
pre.shiki {
  white-space: nowrap;
  .line {
    white-space: pre;
  }
}
*/

:root {
  /* base **/
  --shiki-default-font-style: normal !important;
  --shiki-foreground: #5c6e74;
  --shiki-background: #f5f5f8;

  /* comments, prolog, doctype, cdata */
  --shiki-token-comment: #93a1a1;

  /* atrule, attr-value, keyword */
  --shiki-token-keyword: #07a;

  /* punctuation */
  --shiki-token-punctuation: var(--shiki-foreground);

  /* property, tag, boolean, number, constant, symbol, deleted */
  --shiki-token-constant: var(--theme);

  /* string expressions (operators, entities, etc) */
  --shiki-token-string-expression: var(--theme);

  /* selector, attr-name, string, char, builtin, inserted */
  --shiki-token-string: var(--theme);

  /* function */
  --shiki-token-function: #dd4a68;

  /* regex, important, variable (closest match is parameter) */
  --shiki-token-parameter: #ee9900;

  /* links */
  --shiki-token-link: #0077aa;
}

.language-css {
  --shiki-token-constant: var(--shiki-foreground);
}

.language-md {
  --shiki-token-keyword: var(--theme);
  --shiki-token-link: var(--theme);
}
</style>
