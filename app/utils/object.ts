import { isEmpty, isPlainObject } from './assert'

export function getValue (target: any, path: string): any {
  const props = path.split('.')
  return props.reduce((target, prop) => {
    return target && target[prop]
  }, target)
}

export function merge<T extends Record<string, any>> (...values: Partial<T>[]): T {
  return Object.assign({}, ...values) as T
}

export function clean<T extends Record<string, any>> (source: T): Partial<T> {
  return Object.keys(source).reduce((output, key) => {
    const value = source[key]
    if (!isEmpty(value)) {
      output[key as keyof typeof output] = value
    }
    return output
  }, {} as Partial<T>)
}

export function clone<T> (value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export function toObject (input: any): Record<string, any> {
  const output: Record<string, any> = {}
  for (const key in input) {
    if (typeof input[key] !== 'function') {
      output[key] = isPlainObject(input[key])
        ? toObject(input[key])
        : input[key]
    }
  }
  return output
}
