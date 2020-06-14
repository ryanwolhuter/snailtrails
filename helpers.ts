export enum Colors {
  light,
  dark,
  match,
  inverse
}

export function scaleForRetina(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.style.width = window.innerWidth + 'px'

  canvas.height = window.innerHeight * devicePixelRatio
  canvas.style.height = window.innerHeight + 'px'

  ctx.scale(devicePixelRatio, devicePixelRatio)
}

export function determineColor(
  selection: Colors,
  hue = 0,
  saturation = 100,
  lightness = 50,
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
}