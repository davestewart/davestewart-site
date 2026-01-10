export function plural (num: number, word: string, includeNumber: boolean = true): string {
  if (num !== 1) {
    word = word + 's'
  }
  return includeNumber
    ? `${num} ${word}`
    : word
}

export function capitalize (value: string = ''): string {
  return String(value).replace(/\w/, c => c.toUpperCase())
}

export function slugify (value: string = ''): string {
  return value.replace(/\W+/g, '-').replace(/^-|-$/g, '').toLowerCase()
}
