import { ref } from 'vue'

export interface PreviewComponent {
  show: (source: HTMLElement) => void
  hide: (immediate?: boolean) => void
  visible: Ref<boolean>
}

let previewInstance: PreviewComponent | null = null

/**
 * Registers root preview component
 *
 * Runs at app initialization
 */
export function registerPreview (instance: PreviewComponent) {
  previewInstance = instance
}

/**
 * Hooks into root preview component
 *
 * Used by individual content components to show/hide full-screen preview
 */
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
