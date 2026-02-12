import type { ParsedContent } from '@nuxt/content'
import type { MediaSource, MediaSourceOption } from './media'

export type PostVisibility = 'public' | 'preview' | 'unlisted'

export const PostStatus = {
  // has a date, is published, and within 30 days of being published
  NEW: 'new',

  // has a date, but not yet published, so hidden on production
  SCHEDULED: 'scheduled',

  // no date, but visible on production
  PREVIEW: 'preview',

  // hidden on production, visible in development
  DRAFT: 'draft',

  // visible on production, but hidden in lists
  UNLISTED: 'unlisted',

  // hidden everywhere
  HIDDEN: 'hidden',
} as const

export type StatusType = 'new' | 'scheduled' | 'preview' | 'draft' | 'unlisted' | 'hidden'

export type PageWithStatus = {
  status?: StatusType
}

/**
 * Base content item returned from Nuxt Content queries
 */
export interface PageContent extends ParsedContent {
  /** Publication date */
  date?: string

  /** Full title of the content */
  title: string

  /** Short title for navigation */
  shortTitle?: string

  /** Content description */
  description?: string

  /** Content type classification */
  type?: 'folder' | 'post'

  /** View file to use */
  view?: 'folder' | 'post'

  /** Custom order for sorting */
  order?: number

  /** Content type classification */
  status?: StatusType

  /** Optional GitHub repo path */
  github?: string

  /** Tags associated with the content */
  tags?: string[]

  /** Optional hero item **/
  hero?: 'featured' | 'opengraph' | 'video' | 'gallery'

  /** Page media **/
  media?: {
    thumbnail?: string
    featured?: string | MediaSource
    opengraph?: string | MediaSource
    video?: string | MediaSource
    gallery?: string[] | MediaSource[]
    [key: string]: MediaSourceOption | undefined
  }
}
