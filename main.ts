import { Colors, determineColor, scaleCanvases } from './helpers/helpers.js'

/* 
 * All the application state lives inside this object.
 *
 * `console.log(state)` for a snapshot of the whole state.
 *
 * All the values are destructured into variables with the same names below.
*/

const particles: Particle[] = []

const state = {

  /* Particles */

  particleCount: 31,
  particleSpeed: 1,
  particleSize: 50,
  particleFill: Colors.match,
  sizeScale: 0,

  /* Colors
   *
   * The colors in the app are controlled with hsl values.
   * The the particles shift in hue with each animation frame. 
   * The saturation and lightness remain unchanged - unless the user modifies them.
   *
   * The `colorRate` is added to `hue` on each frame, until the value of `hue` reaches 360 and is reset to zero.
   * 
   * The colors of the canvas stroke and the background can be either white, black, the same as the particles', or the inverse of the particles'.
  */

  hue: 0,
  saturation: 20,
  lightness: 20,
  colorRate: 1,
  stroke: Colors.inverse,
  background: Colors.match
}

/* Destructure the values from state for convenient access */

let {
  // particle controls
  particleCount,
  particleSpeed,
  particleSize,
  particleFill,
  // color controls
  colorRate,
  hue,
  saturation,
  lightness,
  background,
  stroke } = state

function randomize() {
  particleSize = Math.random() * 100
  particleSpeed = (Math.random() * 100) / (Math.random() * 100)

  particles.forEach((particle: Particle) => {
    particle.x = Math.random() * canvas.width
    particle.y = Math.random() * canvas.height
    particle.radius = Math.random() * particleSize
    particle.speedX = Math.random() * particleSpeed
    particle.speedY = Math.random() * particleSpeed
  })

  const options = [
    Colors.light,
    Colors.dark,
    Colors.match,
    Colors.inverse
  ]

  background = options[Math.ceil(Math.random() * 4)]
  stroke = options[Math.ceil(Math.random() * 4)]
  hue = Math.ceil(Math.random() * 360)
  saturation = Math.ceil(Math.random() * 100)
  lightness = Math.ceil(Math.random() * 100)
  colorRate = (Math.random() * 100) / (Math.random() * 100)
}

/* Setup */

const canvasbg = <HTMLCanvasElement>document.getElementById('canvasbg')
const ctxbg = canvasbg.getContext('2d')

const canvas = <HTMLCanvasElement>document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const controls = document.getElementById('controls')
const closeButton = document.getElementById('close')
const showControlsButton = document.getElementById('show-controls')

const countControl = document.getElementById('count')
countControl!.oninput = handleCountControl
const speedControl = document.getElementById('speed')

speedControl.oninput = handleSpeedControl
const sizeControl = document.getElementById('size')
sizeControl.oninput = handleSizeControl
const colorRateControl = document.getElementById('color-rate')
const saturationControl = document.getElementById('saturation')
const lightnessControl = document.getElementById('lightness')
const backgroundLight = document.getElementById('background-light')
const backgroundDark = document.getElementById('background-dark')
const backgroundMatch = document.getElementById('background-match')
const backgroundInverse = document.getElementById('background-inverse')
const strokeColorLight = document.getElementById('stroke-color-light')
const strokeColorDark = document.getElementById('stroke-color-dark')
const strokeColorMatch = document.getElementById('stroke-color-match')
const strokeColorInverse = document.getElementById('stroke-color-inverse')
const reset = document.getElementById('reset')
const randomizeButton = document.getElementById('randomize')

const backgroundButtons = [backgroundLight, backgroundDark, backgroundMatch, backgroundInverse]

const strokeButtons = [strokeColorLight, strokeColorDark, strokeColorMatch, strokeColorInverse]

const canvases = [
  { canvas: canvasbg, ctx: ctxbg },
  { canvas, ctx }
]

window.onload = () => {
  scaleCanvases(canvases)
  init()
  animate()
}

window.onresize = () => {
  scaleCanvases(canvases)
}

closeButton!.onclick = () => {
  showControlsButton!.style.display = 'grid'
  controls!.style.display = 'none'
}

showControlsButton!.onclick = () => {
  showControlsButton!.style.display = 'none'
  controls!.style.display = 'grid'
}

/* Event handlers */

function handleCountControl(event: Event) {
  const element = event.currentTarget as HTMLInputElement
  const newCount = Number(element.value)
  if (newCount > particleCount) {
    particles.push(new Particle())
  }

  if (newCount < particleCount) {
    particles.splice(0, particleCount - newCount)
  }

  particleCount = newCount
}

function handleSpeedControl(event: Event) {
  const element = event.currentTarget as HTMLInputElement
  const newSpeed = Number(element.value)
  particleSpeed = newSpeed
  updateParticleSpeeds(particles)
}

function updateParticleSpeeds(particles: Particle[]) {
  particles.forEach(particle => {
    const positiveX = particle.speedX >= 0
    const positiveY = particle.speedY >= 0
    particle.speedX = positiveX ? particleSpeed : -particleSpeed
    particle.speedY = positiveY ? particleSpeed : -particleSpeed
    particle.update()
  })
}

function handleSizeControl(event: Event) {
  const element = event.currentTarget as HTMLInputElement
  const newSize = Number(element.value)
  const change = newSize - particleSize
  updateParticleSizes(particles, change)
}

function updateParticleSizes(particles: Particle[], change: number) {

  particles.forEach((particle: Particle) => {
    particle.updateSize(change)
  })
}

colorRateControl.addEventListener(
  'input',
  (event: Event) => {
    const element = event.currentTarget as HTMLInputElement
    colorRate = Number(element.value)
  })

saturationControl.addEventListener(
  'input',
  (event: Event) => {
    const element = event.currentTarget as HTMLInputElement
    saturation = Number(element.value)
  })

lightnessControl.addEventListener(
  'input',
  (event: Event) => {
    const element = event.currentTarget as HTMLInputElement
    lightness = Number(element.value)
  }
)

backgroundLight.onclick = () => {
  background = Colors.light
  backgroundButtons.forEach(button => {
    button.classList.remove('active')
  })
  backgroundLight.classList.add('active')
}

backgroundDark.onclick = () => {
  background = Colors.dark
  backgroundButtons.forEach(button => {
    button.classList.remove('active')
  })
  backgroundDark.classList.add('active')
}

backgroundMatch.onclick = () => {
  background = Colors.match
  backgroundButtons.forEach(button => {
    button.classList.remove('active')
  })
  backgroundMatch.classList.add('active')
}

backgroundInverse.onclick = () => {
  background = Colors.inverse
  backgroundButtons.forEach(button => {
    button.classList.remove('active')
  })
  backgroundInverse.classList.add('active')
}

strokeColorLight.onclick = () => {
  stroke = Colors.light
  strokeButtons.forEach(button => {
    button.classList.remove('active')
  })
  strokeColorLight.classList.add('active')
}

strokeColorDark.onclick = () => {
  stroke = Colors.dark
  strokeButtons.forEach(button => {
    button.classList.remove('active')
  })
  strokeColorDark.classList.add('active')
}

strokeColorMatch.onclick = () => {
  stroke = Colors.match
  strokeButtons.forEach(button => {
    button.classList.remove('active')
  })
  strokeColorMatch.classList.add('active')
}

strokeColorInverse.onclick = () => {
  stroke = Colors.inverse
  strokeButtons.forEach(button => {
    button.classList.remove('active')
  })
  strokeColorInverse.classList.add('active')
}

reset.onclick = () => {
  reInit()
}

randomizeButton.addEventListener('click', () => {
  randomize()
  reInit()
})


class Particle {
  constructor(
    public x = Math.random() * canvas.width,
    public y = Math.random() * canvas.height,
    public radius = Math.random() * particleSize,
    public speedX = Math.random() * particleSpeed,
    public speedY = Math.random() * particleSpeed) {
  }

  draw() {
    ctx!.beginPath()
    ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx!.fillStyle = determineColor(particleFill, hue, saturation, lightness)
    ctx!.fill()
    ctx!.strokeStyle = determineColor(stroke, hue, saturation, lightness)
    ctx!.stroke()
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    if (this.x + this.radius > canvas.width
      || this.x - this.radius < 0) {
      this.speedX = -this.speedX
    }

    if (this.y + this.radius > canvas.height
      || this.y - this.radius < 0) {
      this.speedY = -this.speedY
    }
    this.draw()
  }

  updateSize(change: number) {
    let changedRadius = this.radius + change
    if ((changedRadius > 0)) {
      this.radius += change
    } else {
      this.radius = 1
    }
  }
}

function init() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }
}

function animate() {
  for (let i = 0; i < particles.length; i++) {
    const element = particles[i]
    element.update()
  }

  if (hue >= 360) {
    hue = 0
  }
  hue += colorRate

  ctxbg.fillStyle = determineColor(background, hue, saturation, lightness)

  ctxbg.fillRect(0, 0, canvas.width, canvas.height)

  requestAnimationFrame(animate)
}

function reInit() {
  ctx!.clearRect(0, 0, canvas.width, canvas.height)
  particles.length = 0
  init()
}
