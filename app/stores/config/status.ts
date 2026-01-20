import { isDev } from '../../utils/config'

export type PostVisibility = 'public' | 'preview' | 'unlisted'

export const PostStatus = {
  // has a date, is published, and within 30 days of being published
  NEW: 'new',

  // has a date, but not yet published, so hidden on production
  SCHEDULED: 'scheduled',

  // no date, but visible on production
  PREVIEW: 'preview',

  // hidden on production, visible in development
  DRAFT: 'draft',

  // visible on production, but hidden in lists
  UNLISTED: 'unlisted',

  // hidden everywhere
  HIDDEN: 'hidden',
} as const

export type StatusType = typeof PostStatus[keyof typeof PostStatus]

export interface PageWithStatus {
  status?: StatusType
}

export function isPublished (page: PageWithStatus): boolean {
  const unpublishedStatuses = [PostStatus.DRAFT, PostStatus.HIDDEN, PostStatus.SCHEDULED] as readonly StatusType[]
  return !unpublishedStatuses.includes(page.status!)
}

export function isListed (page: PageWithStatus): boolean {
  return page.status !== PostStatus.UNLISTED || isDev
}

export function isVisible (page: PageWithStatus): boolean {
  return isPublished(page) && isListed(page)
}

export function isPreview (page: PageWithStatus): boolean {
  return page?.status === PostStatus.PREVIEW
}
