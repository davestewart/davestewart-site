import { PostStatus } from '~/stores/config/status'
import { isWithinDays } from '~/utils/time'

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

function setPath (file: any) {
  if (file._path) {
    file._path = file._path.replace(/\/*$/, '/')
  }
}

/**
 * Set the type of the file so it can be filtered in search, etc
 *
 * @param {Page}  file
 */
function setType (file: any) {
  if (!file.type) {
    if (file.layout === 'folder') {
      file.type = 'folder'
    }
    else if (file.layout === 'file') {
      file.type = 'file'
    }
    else if (file._file?.endsWith('/captions.yaml')) {
      file.type = 'captions'
    }
    else if (file._extension === 'md') {
      file.type = 'post' // Default to post
    }
  }
}

const today = new Date().toISOString().replace(/T.+?Z/, 'T00:00:00.000Z')

function setDate (file: any) {
  if (!file.date) {
    // file.date = today
  }
}

/**
 * Set the visibility status so it can be omitted from production
 *
 * @param {Page}  file
 */
function setStatus (file: any) {
  const { layout, date, visibility } = file // hidden, preview

  // default status
  file.status = ''

  // add status to posts (files without layout)
  if (!layout) {
    if (visibility === PostStatus.HIDDEN) {
      file.status = PostStatus.HIDDEN
    }
    else if (visibility === PostStatus.UNLISTED) {
      file.status = PostStatus.UNLISTED
    }
    else if (visibility === PostStatus.PREVIEW) {
      file.status = PostStatus.PREVIEW
      file.date = today.replace('T00', 'T01')
    }
    else if (date) {
      if (date > today) {
        file.status = PostStatus.SCHEDULED
      }
      else if (isWithinDays(file.date, 90)) {
        file.status = PostStatus.NEW
      }
    }
    else {
      file.status = PostStatus.DRAFT
    }
  }
}

/**
 * Optionally set permalinks
 *
 * @param {Page}  file
 */
function setPermalink (file: any) {
  // permalink blog articles to a flat hierarchy
  if (file._path?.startsWith('/blog/') && file.type === 'post' && !file.permalink) {
    const slug = file._stem.replace(/\/index/, '').split('/').pop()
    file.permalink = `/blog/${slug}/`
  }
}

/**
 * Set parent path so file can be placed in a hierarchy
 *
 * @param {Page}  file
 * @deprecated ?
 */
function setParentPath (file: any) {
  file.parentPath = file._path
    ?.replace('/index.md', '')
    .split('/').slice(0, -1).join('/') || '/'
  return
}

function setContent (file: any) {
  const elements = file.body?.children || []
  const index = elements.findIndex((element: any) => element.tag === 'h1' && !element.props.className)
  if (index > -1) {
    elements.splice(index, 1)
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse', (file: any) => {
    setPath(file)
    setType(file)
    setStatus(file)
    setDate(file)
    setPermalink(file)
    // setParentPath(file)
    setContent(file)
  })
})
