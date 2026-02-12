// ---------------------------------------------------------------------------------------------------------------------
// utilities
// ---------------------------------------------------------------------------------------------------------------------

import type { LooseUnion } from './index'

/**
 * Utility type to create media props which allow either a media key or a set of attributes
 */
export type MediaProps<TKey extends string, TValue, TProps extends Record<string, any>> =
  | ({ [K in TKey]: TValue } & { [K in keyof TProps]?: never })
  | ({ [K in TKey]?: never } & TProps)

/**
 * Utility function to resolve single or array media sources based on the key name
 */
export type ResolveMedia<T extends MediaKey> = T extends 'gallery'
  ? Array<MediaSource | string>
  : MediaSource | string

// ---------------------------------------------------------------------------------------------------------------------
// media types
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
