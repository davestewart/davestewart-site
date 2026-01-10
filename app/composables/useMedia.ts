import { unref } from 'vue'
import { isImage, isVideo } from '~/utils/assert'

// Minimal types for illustration
interface MediaProps {
  /**
   * Page to use for media resolution.
   */
  page?: ContentItem
  /**
   * Key of media object to use.
   */
  media?: string
  width?: string | number
  height?: string | number
  scale?: boolean

  /**
   * Use captions or not
   */
  caption?: string
}

export interface MediaSource {
  src: string
  width?: number
  height?: number
  style?: string
  text?: string
  href?: string
  type?: 'video' | 'image' | 'embed'
}

function parseSrc (url: string | undefined) {
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

export function useMedia<K extends string> (props: MediaProps, defaultKey: K): K extends 'thumbnail' | 'featured' | 'opengraph' | 'video' ? MediaSource : MediaSource[] {
  const { page: contentPage } = usePage()

  const CONFIG = {
    DEFAULT_WIDTH: 840,
    DEFAULT_HEIGHT: 840 / 16 * 9,
  }

  // 1. Pure function to normalize any input into a MediaSource object
  const normalize = (input: string | Record<string, string>): MediaSource => {
    // treat everything as an object
    if (!input || typeof input === 'string') {
      input = { src: input ?? '' }
    }

    // get image props
    const parsed = parseSrc(input?.src)
    const width = parsed.width ?? props.width ?? CONFIG.DEFAULT_WIDTH
    const height = parsed.height ?? props.height ?? CONFIG.DEFAULT_HEIGHT
    const src = parsed.src || `https://dummyimage.com/${width}x${height}/eaecef/ea4848`
    const { text, href } = input
    const style = width && height
      ? `width: 100%; aspect-ratio: ${width}/${height};`
      : ''

    // source type
    const type = isImage(src)
      ? 'image'
      : isVideo(src)
        ? 'video'
        : 'embed'

    // return normalized object
    return {
      src,
      width: Number(width),
      height: Number(height),
      style,
      href,
      text,
      type,
    }
  }

  const page = props.page || unref(contentPage)
  const mediaKey = props.media || defaultKey
  const rawMedia = page?.media?.[mediaKey]
  return (Array.isArray(rawMedia)
    ? rawMedia.map(normalize)
    : normalize(rawMedia)) as K extends 'thumbnail' | 'featured' | 'opengraph' | 'video' ? MediaSource : MediaSource[]
}
