import { useRoute } from 'vue-router'

/**
 * Scrolls to the anchor on page load
 *
 * - looks for #folder-<hash>
 * - looks for #year-<hash>
 */
export default function useAnchor () {
  const hash = useRoute().hash
  if (hash) {
    const slug = hash.substring(1)
    let prefix = 'folder'
    if (/^\d{4}$/.test(slug)) {
      prefix = 'year'
    }
    const id = `${prefix}-${slug}`
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 750)
    return {
      prefix,
      id,
    }
  }
  return {}
}
