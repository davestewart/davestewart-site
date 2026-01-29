import { ref } from 'vue'

interface PreviewComponent {
  show: (source: HTMLElement) => void
  hide: (immediate?: boolean) => void
  visible: Ref<boolean>
}

let previewInstance: PreviewComponent | null = null

export function setupPreview () {
  const previewRef = ref(null)
  onMounted(() => {
    previewInstance = previewRef.value as unknown as PreviewComponent
  })
  return previewRef
}

export function usePreview () {
  return {
    show: (source: HTMLElement) => {
      if (!previewInstance) {
        console.warn('Preview component not registered')
        return
      }
      previewInstance.show(source)
    },
    hide: (immediate?: boolean) => {
      if (!previewInstance) {
        console.warn('Preview component not registered')
        return
      }
      previewInstance.hide(immediate)
    },
    get visible () {
      return previewInstance?.visible ?? ref(false)
    },
  }
}
