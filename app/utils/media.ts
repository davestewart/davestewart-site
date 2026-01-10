import Path from 'node:path'
import simpleSvgPlaceholder from '@cloudfour/simple-svg-placeholder'
import { isRemote } from './assert'
import theme from '../assets/styles/theme'

// 16:9
export const placeholder = {
  width: 1024,
  height: 576,
}

export function makePlaceholder (path = '') {
  const text = Path.basename(path, Path.extname(path)).replace(/\W+/g, ' ') || ''
  const options = {
    text,
    width: placeholder.width,
    height: placeholder.height,
    bgColor: theme.greyLightest,
    textColor: theme.accentColor,
    fontFamily: `${theme.titleFont}, ${theme.bodyFont}`,
    fontWeight: 'normal',
    fontSize: '75px',
  }
  return simpleSvgPlaceholder(options)
}

/**
 * Get the style of an image
 *
 * @param   {object}  source
 * @returns {object}
 */
export function getStyle (source) {
  if (isRemote(source.path)) {
    return {}
  }
  const { width, height } = source
  return {
    width: '100%',
    aspectRatio: width && height
      ? `${width} / ${height}`
      : false,
  }
}
