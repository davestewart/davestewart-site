import { Status } from '~/store/config/status'

const { HIDDEN, UNLISTED } = Status

/**
 * Composable for applying consistent content filtering across the application.
 *
 * Status is determined by:
 *
 * - draft: no date
 * - scheduled: date is in the future
 * - visibility: frontmatter prop, can be "hidden" or "unlisted"
 */
export function useContentFilters () {
  const isDev = process.env.NODE_ENV === 'development'
  const today = new Date().toISOString()

  /**
   * Apply common post preview selections and ordering.
   * Selects: path, title, shortTitle, description, shortDescription, date, type, meta, media, permalink, visibility
   * Orders by: date DESC
   */
  function getPostPreview (query: any) {
    return query
      .where({ type: 'post' })
      .only(['_path', 'title', 'shortTitle', 'description', 'shortDescription', 'date', 'type', 'meta', 'media', 'permalink', 'visibility'])
      .sort({ date: -1 })
  }

  /**
   * Exclude HIDDEN content.
   * In production: excludes hidden content
   * In dev: shows everything
   */
  function filterVisible (query: any) {
    if (isDev) {
      return query // Show everything in dev
    }
    return query.where({ visibility: { $ne: HIDDEN } })
  }

  /**
   * Exclude UNLISTED content in production (show in dev).
   */
  function filterListed (query: any) {
    if (isDev) {
      return query // Show everything in dev
    }
    return query.where({ visibility: { $ne: UNLISTED } })
  }

  /**
   * Exclude DRAFT and SCHEDULED content.
   * Draft = no date
   * Scheduled = future date
   */
  function filterPublished (query: any) {
    if (isDev) {
      return query // Show everything in dev
    }

    return query
      .where({
        date: {
          $ne: null,
          $lte: today,
        },
      })
  }

  /**
   * Filter content to only recent items within the specified number of days.
   */
  function filterRecent (query: any, days: number) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return query.where({ date: { $gte: cutoff.toISOString() } })
  }

  /**
   * Filter content by path pattern using regex.
   *
   * Examples:
   *   - filterByPath(query, /^\/blog\//) - matches all blog posts
   *   - filterByPath(query, /^\/blog\//, true) - excludes blog posts
   */
  function filterByPath (query: any, pattern: RegExp | string, exclude = false) {
    // Convert SQL-like % wildcards to regex if generic string is passed (simplified handling)
    // But better to expect regex or handle specific cases.
    // For migration, assuming the caller might pass SQL like strings, but better to fix callers.
    // Let's assume pattern is regex or we treat it as substring?
    // v3 'LIKE' '/blog/%' -> regex /^\/blog\//

    let regex = pattern
    if (typeof pattern === 'string') {
      const source = pattern.replace(/%/g, '.*')
      regex = new RegExp(`^${source}`)
    }

    const operator = exclude ? '$not' : '$regex'
    // If exclude, we need { _path: { $not: regex } }
    // But $not in LokiJS/Mongo usually takes a query or regex

    if (exclude) {
      return query.where({ _path: { $not: { $regex: regex } } })
    }
    return query.where({ _path: { $regex: regex } })
  }

  /**
   * Combined filter for typical "public content" use case.
   * Applies: visible + published + listed
   *
   * Excludes:
   * - hidden (visibility)
   * - draft (no date)
   * - scheduled (future date)
   * - unlisted (visibility)
   */
  function filterPublic (query: any) {
    let filtered = filterVisible(query)
    filtered = filterPublished(filtered)
    filtered = filterListed(filtered)
    return filtered
  }

  return {
    getPostPreview,
    filterVisible,
    filterPublished,
    filterRecent,
    filterByPath,
    filterListed,
    filterPublic,
  }
}
