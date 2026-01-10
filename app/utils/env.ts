export function isMac (): boolean {
  return navigator.platform.toLowerCase().includes('mac')
}

// this really means "is small screen"
export function isMobile (): boolean {
  return window.innerWidth < 450 || window.innerHeight < 450
}

export function isDesktop (): boolean {
  return window.innerWidth > 450
}

export function isClient (): boolean {
  return typeof window !== 'undefined'
}

export function isServer (): boolean {
  return !isClient()
}

export function isMirror (): boolean {
  return false // Placeholder - implement if needed
}
