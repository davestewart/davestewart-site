import type { ParsedContent } from '@nuxt/content'
import type { StatusType } from '../stores/api'
import type { MediaSource, MediaSourceOption } from './media'

/**
 * Base content item returned from Nuxt Content queries
 */
export interface ParsedPage extends ParsedContent {
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
