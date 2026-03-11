import { defineNitroPlugin } from 'nitropack/runtime'
import { ParsedContent } from '@nuxt/content'
import { isWithinDays } from '../../utils/time'

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Ensure trailing slash on paths, so they match what is in the URL
 */
function setPath (file: any) {
  const { _path } = file
  if (_path) {
    file._path = _path.replace(/\/*$/, '/')
  }
}

/**
 * Set the type of the file so it can be filtered and structured in search
 */
function setType (file: ParsedContent) {
  // variables
  const { type, layout, _source } = file

  // only markdown files have a type
  if (!type) {
    // showcase content are special
    if (_source === 'showcase ') {
      file.type = 'showcase'
    }

    // everything else is portfolio content
    else if (layout === 'folder') {
      file.type = 'folder'
    }
    else if (layout === 'file') {
      file.type = 'file'
    }
    else {
      file.type = 'post' // default to post
    }
  }
}

const today = new Date().toISOString().replace(/T.+?Z/, 'T00:00:00.000Z')

/**
 * Set content visibility status so it can be omitted from production
 */
function setStatus (file: ParsedContent) {
  // variables
  const { layout, date, navigation, searchable, draft } = file

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
 * Set permalinks on blog posts
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
    // variables
    const { _extension, _source } = file

    // only markdown files get processed
    if (_extension === 'md') {
      // core properties apply to all sources
      setPath(file)
      setType(file)

      // status and permalink for content source only
      if (_source === 'content') {
        setStatus(file)
        setPermalink(file)
      }
    }
  })
})
