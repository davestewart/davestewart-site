import { isMac } from './env'

export function stopEvent (event: Event): void {
  event.preventDefault()
  event.stopImmediatePropagation()
}

// ---------------------------------------------------------------------------------------------------------------------
// assertions
// ---------------------------------------------------------------------------------------------------------------------

export function isModifier (event: KeyboardEvent): boolean {
  return event.shiftKey || (isMac() && event.metaKey) || (!isMac() && event.ctrlKey)
}

export function isNotModifier (event: KeyboardEvent): boolean {
  return !(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
}

export function isInput (event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement
  return 'input textarea'.split(' ').includes(target.tagName.toLowerCase())
}

// ---------------------------------------------------------------------------------------------------------------------
// keys
// ---------------------------------------------------------------------------------------------------------------------

export function isEscape (event: KeyboardEvent): boolean {
  return String(event.key || (event as any).which).toLowerCase().startsWith('esc')
}

export function isChar (event: KeyboardEvent): boolean {
  return isNotModifier(event) && getKeyChar(event) !== ''
}

export function getKeyChar (event: KeyboardEvent): string {
  return event.key.length === 1
    ? event.key.trim()
    : ''
}

interface Keys {
  shift: boolean
  meta: boolean
  ctrl: boolean
  alt: boolean
  esc: boolean
  tab: boolean
  tabPrev: boolean
  tabNext: boolean
  enter: boolean
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  char: string
  key: string
}

export function getKeys (event: KeyboardEvent): Keys {
  // modifiers
  const shift = event.shiftKey
  const meta = event.metaKey
  const ctrl = event.ctrlKey
  const alt = event.altKey

  // keys
  const esc = isEscape(event)
  const tab = event.key === 'Tab'
  const enter = event.key === 'Enter'
  const up = event.key === 'ArrowUp'
  const down = event.key === 'ArrowDown'
  const left = event.key === 'ArrowLeft'
  const right = event.key === 'ArrowRight'
  const key = event.key

  // derived keys
  const tabPrev = tab && shift
  const tabNext = tab && !shift
  const char = getKeyChar(event)

  return {
    shift,
    meta,
    ctrl,
    alt,
    esc,
    tab,
    tabPrev,
    tabNext,
    enter,
    up,
    down,
    left,
    right,
    char,
    key,
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// navigation
// ---------------------------------------------------------------------------------------------------------------------

interface Navigation {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  enter: boolean
  before: boolean
  after: boolean
  prev: boolean
  next: boolean
  axis: string
  row: boolean
  col: boolean
  dir: number
  x: number
  y: number
}

export function getNavigation (event: KeyboardEvent, axis: string = 'xy'): Navigation {
  // keys
  const { tabPrev, tabNext, up, down, left, right, enter } = getKeys(event)

  // geometry
  const col = axis.includes('y')
  const row = axis.includes('x')

  // intentions
  const before = col
    ? left
    : row
      ? up
      : up || left
  const after = col
    ? right
    : row
      ? down
      : down || right
  const x = left
    ? -1
    : right
      ? 1
      : 0
  const y = up
    ? -1
    : down
      ? 1
      : 0
  const dir = col
    ? (up ? -1 : down ? 1 : 0)
    : row
      ? (left ? -1 : right ? 1 : 0)
      : 0

  // return
  return {
    up,
    down,
    left,
    right,
    enter,
    before: before || tabPrev,
    after: after || tabNext,
    prev: dir < 0,
    next: dir > 0,
    axis,
    row,
    col,
    dir,
    x,
    y,
  }
}

export function navigateLinks (event: KeyboardEvent, links: HTMLElement[], objBefore?: HTMLElement, objAfter?: HTMLElement, mode: string = 'xy'): void {
  // variables
  const navigation = getNavigation(event, mode)
  const { dir, prev, next, before, after } = navigation

  if (before && objBefore) {
    stopEvent(event)
    return objBefore.focus()
  }

  else if (after && objAfter) {
    stopEvent(event)
    return objAfter.focus()
  }

  else if (prev || next) {
    stopEvent(event)
    const index = links.indexOf(event.target as HTMLElement)
    if (index > -1) {
      const target = links[index + dir]
      if (target) {
        return target.focus()
      }
      else {
        if (prev && objBefore) {
          return objBefore.focus()
        }
        else if (next && objAfter) {
          return objAfter.focus()
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// animation
// ---------------------------------------------------------------------------------------------------------------------

export function monitorScroll (sourceSelector: string, targetSelector: string, top: number = 0, className: string = 'is-scrolled'): void {
  if (
    'IntersectionObserver' in window
    && 'IntersectionObserverEntry' in window
    && 'intersectionRatio' in window.IntersectionObserverEntry.prototype
  ) {
    const source = document.querySelector(sourceSelector)
    const target = document.querySelector(targetSelector)
    if (source && target) {
      const observer = new IntersectionObserver(() => {
        target.classList.toggle(className, window.pageYOffset > top)
      })
      observer.observe(source)
    }
  }
}

export function onTransitionEnd (element: HTMLElement, callback: () => void): void {
  element.addEventListener('transitionend', function onEnd (event: TransitionEvent) {
    if (event.currentTarget === event.target) {
      element.removeEventListener('transitionend', onEnd)
      callback()
    }
  })
}
