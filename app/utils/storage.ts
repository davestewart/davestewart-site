// provide proxy for server

const noop = (): any => ({})
const s = typeof localStorage !== 'undefined' ? localStorage : { setItem: noop, getItem: noop, removeItem: noop }

// actual storage
export const storage = {
  set (key: string, value: any): void {
    s.setItem(key, JSON.stringify(value))
  },

  get<T = any>(key: string, defaults: T | undefined = undefined): T | undefined {
    const value = s.getItem(key)
    if (value !== null) {
      try {
        return typeof value === 'string'
          ? JSON.parse(value)
          : value
      }
      catch (err) {
        console.warn(`Warning: Invalid JSON for storage.get('${key}'): `, JSON.stringify(value))
      }
    }
    return defaults
  },

  remove (key: string): void {
    s.removeItem(key)
  },
}
