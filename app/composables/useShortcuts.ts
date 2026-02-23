import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'
import { isInput, isModifier } from '~/utils/events'
import { getParentPath, getPath } from '@content/utils'
import { useMetaStore } from '#imports'

export function useShortcuts () {
  const route = useRoute()
  const router = useRouter()
  const metaStore = useMetaStore()

  const SEARCH_PATH = '/search/'

  const isOnSearchPage = computed(() => route.path.startsWith(SEARCH_PATH))

  const posts = computed(() => metaStore.getSurround(route.path))
  const prev = computed(() => posts.value.at(0))
  const next = computed(() => posts.value.at(1))

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
    if (!isInput(e) && e.shiftKey && prev.value) {
      router.push(getPath(prev.value))
    }
  })

  onKeyStroke('ArrowRight', (e: KeyboardEvent) => {
    if (!isInput(e) && e.shiftKey && next.value) {
      router.push(getPath(next.value))
    }
  })

  onKeyStroke('ArrowUp', (e: KeyboardEvent) => {
    if (!isInput(e) && e.shiftKey) {
      router.push(getParentPath(route.path))
    }
  })
}
