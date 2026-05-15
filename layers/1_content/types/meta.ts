/**
 * Raw data from Content API
 */
export interface MetaItemRaw {
  // the disk path of the item
  _path: string
  // the permalink path of the item (different for blog posts)
  path: string
  // the type of the item, based on the layout property
  // also different from the built-in "file" type property
  type: 'folder' | 'post' | 'home' | 'showcase'
  // the post's title
  title?: string
  // an optional short title, to be shown in navigation
  shortTitle?: string
  // an optional description
  description?: string
  // an optional media item hash
  media?: {
    thumbnail?: string
  }
  // an optional order for sorting
  order?: number
  // an optional date for sorting
  date?: string
  // an optional status for sorting
  status?: 'new' | 'scheduled' | 'preview' | 'draft' | 'unlisted' | 'hidden'
  // an optional github path (username/repo)
  github?: string
  // an optional list of tags
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
  // the physical folder path of the item on disk
  _path: string
  path: string
  type: 'folder'
  title: string
  description?: string
  slug: string
  items: MetaItem[]
}

/**
 * Filtered data for post item
 */
export interface MetaPost {
  // the physical folder path of the item on disk
  _path: string
  path: string
  type: 'post'
  title: string
  shortTitle?: string
  description?: string
  summary?: string
  date: string
  duration?: string
  role?: string
  status?: string
  github?: string
  tech?: string
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
