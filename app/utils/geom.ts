interface Rectangle {
  width: number
  height: number
}

interface FittedRectangle extends Rectangle {
  scale: number
}

export function getRect (width: number, height: number): Rectangle {
  return { width, height }
}

/**
 * Fits a rectangle into another rectangles' bounds
 */
export function fitRect (input: Rectangle, bounds: Rectangle): FittedRectangle {
  // variables
  const rectRatio = input.width / input.height
  const boundsRatio = bounds.width / bounds.height
  const output: Partial<FittedRectangle> = {}

  // rect is more landscape than bounds - fit to width
  if (rectRatio > boundsRatio) {
    output.scale = bounds.width / input.width
    output.width = bounds.width
    output.height = input.height * output.scale
  }
  // rect is more portrait than bounds - fit to height
  else {
    output.scale = bounds.height / input.height
    output.width = input.width * output.scale
    output.height = bounds.height
  }

  return output as FittedRectangle
}
