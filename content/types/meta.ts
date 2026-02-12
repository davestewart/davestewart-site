/**
 * Raw data from Content API
 */
export interface MetaItemRaw {
  _path?: string
  type: 'folder' | 'post' | 'home' | 'showcase'
  title?: string
  shortTitle?: string
  description?: string
  permalink?: string
  media?: {
    thumbnail?: string
  }
  order?: number
  date?: string
  status?: string
  github?: string
  tags?: string[]
}

/**
 * Filtered data for either folder or post item
 */
export type MetaItem = MetaFolder | MetaPost

/**
 * Filtered data for folder item
 */
export interface MetaFolder {
  type: 'folder'
  path: string
  title: string
  description?: string
  items: MetaItem[]
}

/**
 * Filtered data for post item
 */
export interface MetaPost {
  type: 'post'
  date: string
  path: string
  permalink?: string
  title: string
  shortTitle?: string
  description?: string
  status?: string
  github?: string
  tags: string[]
  media: {
    thumbnail?: string
  }
}

export interface TagGroup {
  title: string
  tags: string[]
}

export interface Tag {
  text: string
  count: number
}
