import { isImage, isVideo } from '~/utils/assert'

// ---------------------------------------------------------------------------------------------------------------------
// utility types
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Utility type to allow known string literals plus any other string
 *
 * @usage
 *
 * ```ts
 * type MyType = LooseUnion<'option1' | 'option2'>
 * const a: MyType = 'option1' // valid
 * const b: MyType = 'custom'  // also valid
 * ```
 */
type LooseUnion<T extends string> = T | (string & {})

/**
 * Utility type to create media props which allow either a media key or a set of attributes
 */
export type MediaProps<TKey extends string, TValue, TProps extends Record<string, any>> =
  // eslint-disable-next-line no-unused-vars
  | ({ [K in TKey]: TValue } & { [K in keyof TProps]?: never })
  // eslint-disable-next-line no-unused-vars
  | ({ [K in TKey]?: never } & TProps)

/**
 * Utility function to resolve single or array media sources based on the key name
 */
type ResolveMedia<T extends MediaKey> = T extends 'gallery'
  ? Array<MediaSource | string>
  : MediaSource | string

// ---------------------------------------------------------------------------------------------------------------------
// types
// ---------------------------------------------------------------------------------------------------------------------

/**
 * List of known media keys, plus the option for user defined ones
 */
export type MediaKey = LooseUnion<'thumbnail' | 'featured' | 'opengraph' | 'gallery' | 'video'>

/**
 * Union type of all media source types
 */
export type MediaSourceOption = string | MediaSource | Array<string | MediaSource>

/**
 * A base media object with optional width and height
 */
export interface MediaBase {
  src: string
  width?: number | string
  height?: number | string
}

/**
 * An expanded media object with additional optional properties
 */
export interface MediaSource extends MediaBase {
  type?: 'image' | 'video' | 'embed'
  text?: string
  href?: string
}

/**
 * Final parsed media item
 */
export interface MediaItem extends MediaSource {
  style?: string
}

// ---------------------------------------------------------------------------------------------------------------------
// main functions
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Resolve a media source object from the page
 *
 * @param key   A valid MediaKey, or a custom string
 * @param page  Optionally pass a page object to resolve from
 */
export function resolveMedia<K extends MediaKey> (key: K, page?: { media?: Record<string, any> } | undefined): ResolveMedia<K> | undefined {
  // grab the injected page if not supplied
  const target = !page
    ? usePage().page?.value
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
    DEFAULT_WIDTH: 840, // page width
    DEFAULT_HEIGHT: 840 / 16 * 9,
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
