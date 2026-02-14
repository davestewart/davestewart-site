/**
 * Options to filter the search
 *
 * @public
 */
export interface SearchFilters {
  // the path from which to search from
  path?: string
  // any text from title and description to match
  text?: string
  // any tags to match
  tags?: string[]
  // match all or some text fragments
  textOp?: 'and' | 'or'
  // match all or some text tags
  tagsOp?: 'and' | 'or'
  // group by path (default) or date (year)
  group?: 'path' | 'date'
  // whether to pick random items (different from sort, as items can still be sorted)
  randomize?: boolean
  // limit the number of results returned
  limit?: number
  // sort by path (default) or date
  sort?: 'path' | 'date' | 'random'
}

/**
 * Options to control search behaviour and display
 *
 * @internal
 */
export interface SearchOptions {
  // which paths to include in the search
  searchPaths?: string[]
  // whether to exclude drafts from results
  excludeDrafts?: boolean
  // whether to include only items with thumbnails
  hasThumbnail?: boolean
  // whether to show the tag filter
  tagsFilter?: 'list' | 'groups'
  // format to display results in - image (default) or text
  format?: 'image' | 'text'
}

/**
 * Combined type for overall search query
 */
export type SearchQuery = SearchFilters & SearchOptions
