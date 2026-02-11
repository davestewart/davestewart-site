import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'
import { isInput, isModifier } from '~/utils/events'

export function useShortcuts () {
  const route = useRoute()
  const router = useRouter()

  const isOnSearchPage = computed(() => route.path.startsWith('/search'))

  function search (value = '') {
    const path = '/search/'
    const query = value
      ? `?text=${value.replace('/', '')}`
      : ''
    router.push(path + query).catch(() => {})
  }

  onKeyStroke('k', (e: KeyboardEvent) => {
    // skip if on search page or input
    if (isOnSearchPage.value || isInput(e)) {
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
      search()
    }
  })
}
