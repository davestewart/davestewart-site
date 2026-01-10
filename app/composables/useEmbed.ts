/**
 * Composable to handle script embedding for components
 * Replaces legacy embed mixin
 */
export function useEmbed (src: string) {
  const scriptElement = ref<HTMLScriptElement | null>(null)

  onMounted(() => {
    // Check if script already exists to avoid duplication if needed,
    // but legacy behavior appeared to blindly append.
    // We'll stick to legacy behavior for now but keep a ref to remove it.

    // Note: Some embeds might need unique IDs or checks.
    // Using a simple append for now matching original logic.

    const script = document.createElement('script')
    script.setAttribute('src', src) // using setAttribute for standard behavior
    script.async = true
    document.body.appendChild(script)
    scriptElement.value = script
  })

  onUnmounted(() => {
    if (scriptElement.value && document.body.contains(scriptElement.value)) {
      document.body.removeChild(scriptElement.value)
    }
  })
}
