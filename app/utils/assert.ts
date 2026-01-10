/**
 * Tests whether a passed value is an Object or Array
 */
export function isObject (value: any): value is object {
  return !!value && typeof value === 'object'
}

/**
 * Tests whether a passed value is an Object
 */
export function isPlainObject (value: any): value is Record<string, any> {
  return isObject(value) && !Array.isArray(value)
}

export function isEmpty (value: any): boolean {
  if (typeof value === 'number' && value === 0) {
    return false
  }
  if (!value) {
    return true
  }
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  return false
}

export function isImage (path: string = ''): boolean {
  const src = path.split('?').shift()!
  return /\.(ico|gif|bmp|svg|png|jpe?g)$/.test(src)
}

export function isVideo (path: string = ''): boolean {
  return /\.(mp4|mpeg|avi)$/.test(path) || /youtube|youtu\.be|vimeo/.test(path)
}

// export function isLocal(path: string = ''): boolean {
//     return /\..+/.test(path)
// }

export function isRemote (path: string = ''): boolean {
  return /^https?:/.test(path)
}
