export function useSmoothScroll () {
  const router = useRouter()

  onMounted(() => {
    // handler function
    function onLinkClick (event: MouseEvent) {
      // test for target link
      const target = event.target as HTMLLinkElement
      const link = target.closest('a')
      if (!link) {
        return
      }

      // check if link is internal
      const path = link.getAttribute('href')!
      if (path.startsWith('#')) {
        if (path !== '#') {
          const element = document.querySelector(path) as HTMLElement
          if (element) {
            event.preventDefault()
            event.stopImmediatePropagation()
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            window.addEventListener('scrollend', () => {
              void router.push(path.replace(/#(folder|year)-/, '#'))
            }, { once: true })
          }
        }
      }
    }

    // add and remove event listener
    document.addEventListener('click', onLinkClick, { capture: true })
    onUnmounted(() => {
      document.removeEventListener('click', onLinkClick, { capture: true })
    })
  })
}
