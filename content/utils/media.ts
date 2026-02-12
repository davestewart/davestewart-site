export function isImage (path: string = ''): boolean {
  const src = path.split('?')[0] ?? ''
  return /\.(ico|gif|bmp|svg|png|jpe?g)$/.test(src)
}

export function isVideo (path: string = ''): boolean {
  return /\.(mp4|mpeg|avi)$/.test(path) || /youtube|youtu\.be|vimeo/.test(path)
}
