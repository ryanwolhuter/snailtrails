export enum Colors {
  light,
  dark,
  match,
  inverse
}

// Scales a canvas with context to look better on retina
function scaleForRetina(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.style.width = window.innerWidth + 'px'

  canvas.height = window.innerHeight * devicePixelRatio
  canvas.style.height = window.innerHeight + 'px'

  ctx.scale(devicePixelRatio, devicePixelRatio)
}

interface CanvasWithContext {
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
}

export function scaleCanvases(canvases: CanvasWithContext[]) {
  canvases.forEach(({ canvas, ctx }) => {
    document.body.append(canvas)
    scaleForRetina(canvas, ctx)
  })
}

export function determineColor(
  selection: Colors,
  hue: number,
  saturation: number,
  lightness: number,
  opacity = 1) {
  if (selection === Colors.light) {
    return `hsl(0, 0%, 100%, ${opacity})`
  }
  if (selection === Colors.dark) {
    return `hsl(0, 0%, 0%, ${opacity})`
  }
  if (selection === Colors.match) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%, ${opacity})`
  }
  if (selection === Colors.inverse) {
    return `hsl(${360 - hue}, ${100 - saturation}%, ${100 - lightness}%, ${opacity})`
  }

  return `hsl(0, 0%, 100%, 1)`
}