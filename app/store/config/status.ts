import { isDev } from '../../utils/config'

export const Status = {
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

export type StatusType = typeof Status[keyof typeof Status]

export interface PageWithStatus {
  status?: StatusType
}

export function isPublished (page: PageWithStatus): boolean {
  const unpublishedStatuses = [Status.DRAFT, Status.HIDDEN, Status.SCHEDULED] as readonly StatusType[]
  return !unpublishedStatuses.includes(page.status!)
}

export function isListed (page: PageWithStatus): boolean {
  return page.status !== Status.UNLISTED || isDev
}

export function isVisible (page: PageWithStatus): boolean {
  return isPublished(page) && isListed(page)
}
