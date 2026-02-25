/**
 * Dynamically adds scripts to the page
 *
 * Seems to work for now. Not sure if Nuxt has a better way
 */
export function useEmbed (src: string) {
  let script: HTMLScriptElement | null = null

  onMounted(() => {
    script = document.createElement('script')
    script.src = src
    script.async = true
    document.body.appendChild(script)
  })

  onUnmounted(() => {
    if (script) {
      document.body.removeChild(script)
    }
  })
}
