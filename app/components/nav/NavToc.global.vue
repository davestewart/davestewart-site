<template>
  <div class="navToc">
    <div
      v-if="options.items.length > 1"
      :data-depth="depth"
      v-html="html"
    />
    <details v-if="items.length > 0 && options.items.length === 0" class="navToc__warning">
      <summary class="navToc__label">
        Invalid TOC attributes
      </summary>
      <div class="navToc__data">
        <pre>Props: {{ $props }}</pre>
        <pre>Items: {{ items }}</pre>
      </div>
    </details>
  </div>
</template>

<script lang="ts">
/**
 * Convert Nuxt Content TOC to legacy format
 *
 * @param toc
 */
function makeHeaders (toc: Toc): HeaderItem[] {
  function flatten (links: TocLink[]): HeaderItem[] {
    return links.flatMap(link => [
      {
        level: link.depth,
        title: link.text,
        slug: link.id,
      },
      ...(link.children ? flatten(link.children) : []),
    ])
  }

  return flatten(toc.links).flat()
}
</script>

<script setup lang="ts">
interface Props {
  // optional page headers to render (defaults to the containing page)
  headers?: HeaderItem[]
  // change the text which precedes the links
  prompt?: string
  // takes a number, or a comma-delimited string of levels, i.e. 2,3,4
  level?: number | string
  // takes a string or array of strings of slugs to exclude
  exclude?: string | string[]
  // render links of a named section only (by slug)
  section?: string
  // begin rendering from a specific header (by slug)
  from?: string
  // end rendering at a specific header (by slug)
  to?: string
  // the type of structure to render; defaults to auto, which depends on the number of levels
  type?: 'list' | 'tree' | 'auto'
  // tips for each level
  tips?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  prompt: 'Jump to',
  level: 2,
  exclude: '',
  section: '',
  from: '',
  to: '',
  type: 'auto',
})

const items = computed(() => {
  if (props.headers) {
    return props.headers
  }
  const toc = usePageStore().page?.body?.toc
  return toc
    ? makeHeaders(toc)
    : []
})

function split (value: number | string | string[]): string[] {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string') {
    return value.split(',').map(value => value.trim())
  }
  return [String(value)]
}

const options = computed(() => {
  // variables
  let itemsList = [...items.value]

  // props
  const levels = split(props.level).map(level => parseInt(level))
  const excludes = props.exclude ? split(props.exclude) : []
  const fromIndex = itemsList.findIndex(item => item.slug === props.from)
  const toIndex = itemsList.findIndex(item => item.slug === props.to)

  // section
  if (props.section) {
    let found = false
    let level: number | null = null
    let done = false
    itemsList = itemsList.reduce((items, item) => {
      if (!done) {
        if (!found) {
          if (item.slug === props.section) {
            found = true
            level = item.level
          }
        }
        else {
          if (level !== null && item.level > level) {
            items.push(item)
          }
          else {
            done = true
          }
        }
      }
      return items
    }, [] as HeaderItem[])
  }

  // slice if from or to and included
  if (toIndex > -1) {
    itemsList = itemsList.slice(0, toIndex + 1)
  }
  if (fromIndex > -1) {
    itemsList = itemsList.slice(fromIndex)
  }

  // filter the items
  itemsList = itemsList
    .filter(item => levels.includes(item.level))
    .filter(item => !excludes.includes(item.slug))

  // return
  return {
    levels,
    excludes,
    items: itemsList,
    tips: props.tips || {},
  }
})

const depth = computed(() => {
  const levels = options.value.levels
  if (props.type === 'tree' && levels.length > 0) {
    return levels[levels.length - 1]! - 1
  }
  return 1
})

const hasHierarchy = computed(() => {
  return options.value.levels.length > 1 || props.type === 'list'
})

const html = computed(() => {
  // helpers
  const makeLink = (item: HeaderItem, tip?: string) => {
    const title = hasHierarchy.value
      ? item.title
      : item.title.replace(/^\W|\W$/g, '')
    let html = `<a href="#${item.slug}">${title}</a>`
    if (tip) {
      html += `<br><small>${tip}</small>`
    }
    return html
  }

  // variables
  const prompt = props.prompt
  const { levels, items: itemsList, tips } = options.value

  // check for items
  if (!itemsList.length) {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(entry => !!entry[1] || (Array.isArray(entry[1]) && entry[1].length > 0)),
    )
    console.warn('NavToc: no items resolved for props', JSON.stringify(filteredProps, null, '  '))
    return ''
  }

  // generate html
  if (levels.length) {
    // list
    if (hasHierarchy.value) {
      let prev = itemsList[0]
      let html = '<ul>'
      for (const item of itemsList) {
        if (prev && item.level > prev.level) {
          html += '<ul>'
        }
        else if (prev && item.level < prev.level) {
          html += '</ul>'.repeat(prev.level - item.level)
        }
        html += `<li>${makeLink(item, tips[item.slug])}</li>`
        prev = item
      }
      return prompt
        ? `<p>${prompt}:</p>${html}`
        : html
    }

    // paragraph
    else {
      const links = itemsList.map(item => makeLink(item))
      const last = links.pop()
      return `<p>${prompt}: ${links.join(', ')} or ${last}.</p>`
    }
  }

  return ''
})
</script>

<style lang="scss">
.navToc {
  li {
    margin-bottom: 0;
  }

  &:not([data-depth="1"]) > ul > li {
    margin-top: .75em;

    small {
      color: $grey;
    }

    a {
      color: $textColor;
      font-weight: 600;
    }

    small {
      display: block;
      margin-top: -.15em;
    }
  }

  > ul > ul > li {
    font-size: .85rem;
  }

  &__label {
    cursor: pointer;
    color: $accentColor;
    font-weight: 600;
  }

  &__warning {
    padding: 1rem;
    border: 1px solid $borderColor;
    border-radius: 4px;
  }

  &__data {
    margin: 1rem;

    pre + pre {
      margin-top: 1rem;
    }
  }
}
</style>
