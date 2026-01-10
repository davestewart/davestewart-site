export function getElements (selector: string, element?: Element | Document): Element[] {
  return Array.from((element || document).querySelectorAll(selector))
}

export function setElementBounds (element: HTMLElement, bounds: { width: number, height: number, x: number, y: number }): void {
  element.style.width = px(bounds.width)
  element.style.height = px(bounds.height)
  element.style.left = px(bounds.x)
  element.style.top = px(bounds.y)
}

export function copyLayout (source: HTMLElement, target: HTMLElement): void {
  const style = document.defaultView!.getComputedStyle(source, '')
  const props: Array<keyof CSSStyleDeclaration> = ['width', 'height', 'margin', 'padding']
  props.forEach((key) => {
    (target.style as any)[key] = style[key]
  })
}

export function px (value: number | string): string {
  value = String(value)
  return !value.endsWith('px')
    ? value + 'px'
    : value
}

export function createElement (tagName: string, attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement(tagName)
  Object.keys(attrs).forEach((key) => {
    el.setAttribute(key, attrs[key] as any)
  })
  return el
}
