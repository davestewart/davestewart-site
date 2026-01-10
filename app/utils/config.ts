type ScriptOptions = Record<string, any>

export function script (src: string, options?: ScriptOptions): [string, Record<string, any>] {
  return ['script', { src, ...options }]
}

export function meta (name: string, content: string): [string, Record<string, string>] {
  return ['meta', { name, content }]
}

export function link (rel: string, href: string): [string, Record<string, string>] {
  return ['link', { rel, href }]
}

export function plugin (name: string, options?: any): string | [string, any] {
  return arguments.length > 1
    ? [name, options]
    : name
}

export const isDev = process.env.NODE_ENV !== 'production'
export const isProd = process.env.NODE_ENV === 'production'
