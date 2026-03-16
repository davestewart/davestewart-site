import { defineNitroPlugin } from 'nitropack/runtime'
import { ParsedContent } from '@nuxt/content'
import { isWithinDays } from '../../utils/time'

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

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

/**
 * Set url paths on blog posts and other content
 */
function setPaths (file: ParsedContent) {
  const { _path, path, type } = file

  // Ensure trailing slash on paths, so they match what is in the URL
  if (_path) {
    file._path = _path.replace(/\/*$/, '/')
  }

  // if no path is set in frontmatter
  if (!path) {
    // flatten blog posts to a single list
    if (_path?.startsWith('/blog/') && type === 'post') {
      const slug = _path
        .replace('index/', '')
        .replace(/\/$/, '')
        .split('/').pop()
      file.path = `/blog/${slug}/`
    }

    // naturally fallback to the structural `_path` if no frontmatter path or blog override
    else {
      file.path = file._path
    }
  }
}

/**
 * Set content visibility status so it can be omitted from production
 */
function setStatus (file: ParsedContent, today: string) {
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

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse' as any, (file: ParsedContent) => {
    // variables
    const { _extension, _source } = file

    // only markdown files get processed
    if (_extension === 'md') {
      // core properties apply to all sources
      setType(file)
      setPaths(file)

      // status for content source only
      if (_source === 'content') {
        setStatus(file, new Date().toISOString().replace(/T.+?Z/, 'T00:00:00.000Z'))
      }
    }
  })
})
