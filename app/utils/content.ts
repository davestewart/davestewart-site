export function getTitle (page: ContentPage) {
  return page.shortTitle || page.title
}

/**
 * Ensure the path contains a trailing slash
 * @param path
 */
export function normalizePath (path: string) {
  return path.replace(/\/*$/, '/')
}

/**
 * Get parent path by removing last segment
 * @param path
 */
export function getParentPath (path: string) {
  return path.replace(/[^/]+\/?$/, '')
}

export function slicePath (path: string, reduce: number = 1): string {
  return path
    .split('/')
    .slice(0, -reduce)
    .join('/') + '/'
}
