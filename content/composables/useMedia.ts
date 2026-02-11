import { isImage, isVideo } from '../utils'
import type { MediaItem, MediaKey, MediaSource, MediaSourceOption, ResolveMedia } from '../types'


/**
 * Resolve a media source object from the page
 *
 * @param key   A valid MediaKey, or a custom string
 * @param page  Optionally pass a page object to resolve from
 */
export function resolveMedia<K extends MediaKey> (key: K, page?: { media?: Record<string, any> } | undefined): ResolveMedia<K> | undefined {
  // grab the injected page if not supplied
  const target = !page
    ? useContentStore().page
    : page

  // return with the correct type, based on key; i.e. `gallery` will always be an array
  return target?.media?.[key] as ResolveMedia<K> | undefined
}

/**
 * Parses a media source option into a MediaItem object
 *
 * @param source  A valid MediaSource object, array or objects, array of strings, or undefined
 */
export function useMedia<T extends MediaSourceOption> (source: T | undefined): T extends Array<string | MediaSource> ? MediaItem[] : MediaItem {
  // defaults
  const CONFIG = {
    DEFAULT_WIDTH: 840 * 3, // page width
    DEFAULT_HEIGHT: 840 / 16 * 9 * 3,
  }

  // 1. Pure function to normalize any input into a MediaSource object
  const normalize = (input: string | MediaSource | undefined): MediaItem => {
    // treat everything as an object
    const source: MediaSource = typeof input === 'string' || !input
      ? { src: input ?? '' }
      : input

    // get image props
    const parsed = parseImageSizeFromUrl(source.src)
    const width = parsed.width ?? source.width ?? CONFIG.DEFAULT_WIDTH
    const height = parsed.height ?? source?.height ?? CONFIG.DEFAULT_HEIGHT
    const src = parsed.src || `https://dummyimage.com/${width}x${height}/eaecef/ea4848` // makePlaceholder(parsed.src || 'test image', width, height)
    const style = width && height ? `width: 100%; aspect-ratio: ${width}/${height};` : ''
    const { text, href } = source

    // source type
    const type = isImage(src)
      ? 'image'
      : isVideo(src)
        ? 'video'
        : 'embed'

    // return normalized object
    return {
      type,
      src,
      width,
      height,
      style,
      text,
      href,
    }
  }

  // process
  const result = Array.isArray(source)
    ? source.map(normalize)
    : normalize(source)

  // return
  return result as T extends Array<string | MediaSource> ? MediaItem[] : MediaItem
}

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Parse width and height from URL query parameters
 */
function parseImageSizeFromUrl (url: string | undefined): { src: string, width?: number, height?: number } {
  if (!url) {
    return { src: '' }
  }
  const [src, query = ''] = url.split('?')
  const params = new URLSearchParams(query)
  const width = params.get('width')
  const height = params.get('height')
  return {
    src: src ?? '',
    width: width !== null ? Number(width) : undefined,
    height: height !== null ? Number(height) : undefined,
  }
}
