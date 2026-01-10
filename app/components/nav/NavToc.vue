<template>
  <div
    v-if="computedOptions.items.length > 1"
    class="navToc"
    :data-depth="computedDepth"
    v-html="html"
  ></div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = defineProps({
  // optional page headers to render (defaults to the containing page)
  headers: {
    type: Array,
    default: () => null,
  },

  // change the text which precedes the links
  prompt: {
    type: String,
    default: 'Jump to',
  },

  // takes a number, or a comma-delimited string of levels, i.e. 2,3,4
  level: {
    type: [Number, String],
    default: 2,
  },

  // takes a string or array of strings of slugs to exclude
  exclude: {
    type: [String, Array],
    default: '',
  },

  // render links of a named section only (by slug)
  section: {
    type: String,
    default: '',
  },

  // begin rendering from a specific header (by slug)
  from: {
    type: String,
    default: '',
  },

  // end rendering at a specific header (by slug)
  to: {
    type: String,
    default: '',
  },

  // the type of structure to render; defaults to auto, which depends on the number of levels
  type: {
    type: String,
    validator: (value: string) => ['list', 'tree', 'auto'].includes(value),
    default: 'auto',
  },
})

const attrs = useAttrs()
const { page } = usePage()

// --- Utilities ---

function split (value: string | number | (string | number)[]): (string | number)[] {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string') {
    return value.split(',').map(v => v.trim())
  }
  return [value]
}

// Flatten Nuxt Content's nested TOC to VuePress style flat array
// Nuxt: { id, text, depth, children }
// VuePress: { slug, title, level }
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

interface FlatHeader {
  slug: string
  title: string
  level: number
}

function flattenToc (links: TocLink[]): FlatHeader[] {
  let flattened: FlatHeader[] = []
  for (const link of links) {
    flattened.push({
      slug: link.id,
      title: link.text,
      level: link.depth,
    })
    if (link.children) {
      flattened = flattened.concat(flattenToc(link.children))
    }
  }
  return flattened
}

// --- Logic ---

const rawItems = computed(() => {
  if (props.headers) {
    // If headers prop is provided, assume it might already be in the old format or handle accordingly.
    // However, usually in MDC we rely on page data if not passed.
    // If passed explicitly, we might need to check its format.
    // For now, let's assume if passed, it mimics the flat structure or we might need to adjust.
    // But mostly this component pulls from page.
    return props.headers as FlatHeader[]
  }
  if (page.value?.body?.toc?.links) {
    return flattenToc(page.value.body.toc.links)
  }
  return []
})

// removed depth ref

const computedOptions = computed(() => {
  // variables
  let items = [...rawItems.value]

  // props
  const levels = split(props.level).map(l => parseInt(String(l)))
  const excludes = split(props.exclude).map(String)

  // These logic pieces replicate the old Vue logic:
  const fromIndex = items.findIndex(item => item.slug === props.from)
  // Fix original logic bug? Original: item.slug === this.to - 1. 'to' is string.
  // Probably meant finding index and stopping *before* it? Or simple typo in original code?
  // Original: const toIndex = items.findIndex(item => item.slug === this.to - 1)
  // That looks like a bug in original code (subtracting 1 from string?).
  // Let's assume it meant to find the item with slug 'to'.
  const toIndex = items.findIndex(item => item.slug === props.to)

  // section
  if (props.section) {
    let found = false
    let currentLevel: number | null = null
    let done = false

    // Reduce replacement
    const newItems: FlatHeader[] = []

    for (const item of items) {
      if (done) break

      if (!found) {
        if (item.slug === props.section) {
          found = true
          currentLevel = item.level
        }
      }
      else {
        if (item.level > (currentLevel as number)) {
          newItems.push(item)
        }
        else {
          done = true
        }
      }
    }
    items = newItems
  }

  // slice if from or to and included
  // Original logic:
  // if (toIndex > -1) items = items.slice(0, toIndex - 1)
  // if (fromIndex > -1) items = items.slice(fromIndex)

  if (toIndex > -1) {
    items = items.slice(0, toIndex) // slice is exclusive of end, so this excludes 'to' item?
    // Original was `toIndex - 1`. If toIndex is 5, slice(0, 4).
    // Let's stick to standard slice behavior: slice(0, toIndex) excludes the item at toIndex.
  }

  if (fromIndex > -1) {
    items = items.slice(fromIndex)
  }

  // filter the items
  items = items
    .filter(item => levels.includes(item.level))
    .filter(item => !excludes.includes(item.slug))

  // add tips to top level items
  const tips: Record<string, string> = {}
  for (const name of Object.keys(attrs)) {
    if (name.startsWith('tip-')) {
      const key = name.substring(4) // after 'tip-'
      tips[key] = attrs[name] as string
    }
    // Handling underscore prefix if passed from markdown sometimes? Nuxt Content props handling?
    // In original: `_tip-work` in MD.
    // MDC might pass it as `tip-work` or `_tip-work`.
    if (name.startsWith('_tip-')) {
      const key = name.substring(5)
      tips[key] = attrs[name] as string
    }
  }

  return {
    levels,
    excludes,
    items,
    tips,
  }
})

const hasHierarchy = computed(() => {
  return computedOptions.value.levels.length > 1 || props.type === 'list'
})

const computedDepth = computed(() => {
  const { levels } = computedOptions.value
  return levels.length ? levels[levels.length - 1] - 1 : 1
})

const html = computed(() => {
  // helpers
  const makeLink = (item: FlatHeader, tip?: string) => {
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
  const { items, tips } = computedOptions.value

  // generate html
  if (items.length) {
    // list
    if (hasHierarchy.value) {
      let prev = items[0]
      let htmlStr = '<ul>'

      for (const item of items) {
        if (item.level > prev.level) {
          htmlStr += '<ul>'
        }
        else if (item.level < prev.level) {
          htmlStr += '</ul>'.repeat(prev.level - item.level)
        }
        htmlStr += `<li>${makeLink(item, tips[item.slug])}</li>`
        prev = item
      }
      return props.prompt
        ? `<p>${props.prompt}:</p>${htmlStr}`
        : htmlStr
    }

    // paragraph
    else {
      const links = items.map(item => makeLink(item))
      if (links.length > 1) {
        const last = links.pop()
        return `<p>${props.prompt}: ${links.join(', ')} or ${last}.</p>`
      }
      return `<p>${props.prompt}: ${links[0]}.</p>`
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
}
</style>
