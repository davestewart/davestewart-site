import { ref } from 'vue'

interface GalleryInstance {
  id: symbol
  element: HTMLElement
  intersectionRatio: number
  observer: IntersectionObserver
}

const galleries = ref<Map<symbol, GalleryInstance>>(new Map())
const activeGalleryId = ref<symbol | null>(null)

export function useActiveGallery () {
  function register (element: HTMLElement) {
    const id = Symbol('gallery')

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          updateIntersection(id, entry.intersectionRatio)
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] },
    )

    observer.observe(element)

    galleries.value.set(id, {
      id,
      element,
      intersectionRatio: 0,
      observer,
    })
    updateActiveGallery()

    // Return cleanup function and id checker
    return {
      cleanup: () => {
        observer.disconnect()
        galleries.value.delete(id)
        if (activeGalleryId.value === id) {
          updateActiveGallery()
        }
      },
      isActive: () => activeGalleryId.value === id,
    }
  }

  function updateIntersection (id: symbol, ratio: number) {
    const gallery = galleries.value.get(id)
    if (gallery) {
      gallery.intersectionRatio = ratio
      updateActiveGallery()
    }
  }

  function updateActiveGallery () {
    let mostCentralId: symbol | null = null
    let maxRatio = 0

    galleries.value.forEach((gallery) => {
      if (gallery.intersectionRatio > maxRatio) {
        maxRatio = gallery.intersectionRatio
        mostCentralId = gallery.id
      }
    })

    activeGalleryId.value = mostCentralId
  }

  return {
    register,
  }
}
