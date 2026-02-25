import { defineNitroPlugin } from 'nitropack/runtime'
import { ParsedContent } from '@nuxt/content'
import { isWithinDays } from '../../utils/time'

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
 */
function setType (file: ParsedContent) {
  if (!file.type) {
    if (file.layout === 'folder') {
      file.type = 'folder'
    }
    else if (file.layout === 'file') {
      file.type = 'file'
    }
    else if (file._extension === 'md') {
      file.type = 'post' // Default to post
    }
  }
}

const today = new Date().toISOString().replace(/T.+?Z/, 'T00:00:00.000Z')

/**
 * Set the visibility status so it can be omitted from production
 */
function setStatus (file: ParsedContent) {
  const { layout, date, navigation, searchable, draft } = file // hidden, preview

  // default status
  file.status = ''

  // add status to posts (files without layout)
  if (!layout) {
    if (searchable === false) {
      file.status = 'hidden'
    }
    else if (navigation === false) {
      file.status = 'unlisted'
    }
    else if (date && !draft) {
      if (date > today) {
        file.status = 'scheduled'
      }
      else if (isWithinDays(file.date, 90)) {
        file.status = 'new'
      }
    }
    else {
      file.status = 'draft'
    }
  }
}

/**
 * Optionally set permalinks
 */
function setPermalink (file: ParsedContent) {
  // permalink blog articles to a flat hierarchy
  if (file._path?.startsWith('/blog/') && file.type === 'post' && !file.permalink) {
    const slug = file._path
      .replace('index/', '')
      .replace(/\/$/, '')
      .split('/').pop()
    file.permalink = `/blog/${slug}/`
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse' as any, (file: any) => {
    if (file._extension === 'md') {
      setPath(file)
      setType(file)
      setStatus(file)
      setPermalink(file)
    }
  })
})
