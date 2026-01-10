// import type { StatusType } from '../app/store/config/status'

/**
 * Nuxt Content types for the application
 */
declare global {
  /**
   * Base content item returned from Nuxt Content queries
   */
  interface ContentItem {
    /** The path to the content item */
    _path: string
    /** Whether this is a partial/draft */
    _partial?: boolean

    /** Publication date */
    date?: string
    /** Full title of the content */
    title?: string
    /** Short title for navigation */
    shortTitle?: string
    /** Content description */
    description?: string

    /** Content type classification */
    type?: 'folder' | 'post' | 'captions'
    /** Custom order for sorting */
    order?: number
    /** Content type classification */
    status?: 'StatusType'

    /** Layout type (e.g., 'folder', 'post') */
    layout?: string
    /** Tags associated with the content */
    tags?: string[]

    /** Nested pages for folder-type content */
    // pages?: ContentItem[]

    /** Optional hero item **/
    hero?: string
    /** Page media **/
    media?: {
      thumbnail?: string
      featured?: string
      gallery?: string[]
      [key: string]: string | string[]
    }
  }
}

export {}
