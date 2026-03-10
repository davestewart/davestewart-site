import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'
import { isInput, isModifier } from '~/utils/events'
import { getPath } from '@content/utils'

/**
 * Sets up global keyboard shortcuts for the whole site
 */
export function useShortcuts () {
  const route = useRoute()
  const router = useRouter()
  const metaStore = useMetaStore()

  const SEARCH_PATH = '/search/'
  const isOnSearchPage = computed(() => route.path.startsWith(SEARCH_PATH))

  const surround = computed(() => metaStore.getSurround(route.path))
  const parent = computed(() => metaStore.getUp(route.path))

  onKeyStroke('k', (e: KeyboardEvent) => {
    // skip if modal is showing
    if (document.body.classList.contains('preview-active')) {
      return
    }

    // skip if on search page or input
    if (isOnSearchPage.value) {
      if (isInput(e)) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }

    // open search if keyboard combo hit
    if (isModifier(e)) {
      e.preventDefault()
      void router.push(SEARCH_PATH)
    }
  })

  // surround navigation
  onKeyStroke('ArrowLeft', (e: KeyboardEvent) => {
    const prev = surround.value.prev
    if (!isInput(e) && e.shiftKey && prev) {
      router.push(getPath(prev)!)
    }
  })

  onKeyStroke('ArrowRight', (e: KeyboardEvent) => {
    const next = surround.value.next
    if (!isInput(e) && e.shiftKey && next) {
      router.push(getPath(next)!)
    }
  })

  onKeyStroke('ArrowUp', (e: KeyboardEvent) => {
    if (!isInput(e) && e.shiftKey) {
      router.push(parent.value!.path)
    }
  })
}
