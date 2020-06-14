export enum Colors {
  light,
  dark,
  match,
  inverse
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
}