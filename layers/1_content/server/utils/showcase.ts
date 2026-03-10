import { getRequestHeader } from 'h3'
import type { H3Event } from 'h3'

export function getShowcase (event: H3Event) {
  const host = getRequestHeader(event, 'host') ?? ''
  console.log('host', host)
  const match = host.match(/^([^.]+)\.(davestewart\.io|localhost)/)
  return match?.[1] ?? null
}
