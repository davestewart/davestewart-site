import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'
import { isInput, isModifier } from '~/utils/events'

export function useShortcuts () {
  const route = useRoute()
  const router = useRouter()

  const SEARCH_PATH = '/search/'

  const isOnSearchPage = computed(() => route.path.startsWith(SEARCH_PATH))

  onKeyStroke('k', (e: KeyboardEvent) => {
    // skip if on search page or input
    if (!(isOnSearchPage.value || isInput(e))) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // skip if modal is showing
    if (document.body.classList.contains('preview-active')) {
      return
    }

    // open search if keyboard combo hit
    if (isModifier(e)) {
      e.preventDefault()
      void router.push(SEARCH_PATH)
    }
  })
}
