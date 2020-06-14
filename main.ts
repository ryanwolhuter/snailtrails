import { Colors, determineColor } from './helpers'

/* 
 * All the application state lives inside this object.
 *
 * `console.log(state)` for a snapshot of the whole state.
 *
 * All the values are destructured into variables with the same names below.
*/

const state = {

  /* Particles */

  particlesArray: [],
  particleCount: 31,
  particleSpeed: 1,
  particleSize: 50,
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
  // stroke color (one of 'light', 'dark', 'match', 'inverse')
  stroke: 'inverse',
  // background color (one of 'light', 'dark', 'match', 'inverse')
  background: 'match'
}

/* Destructure the values from state for convenient access */

let {
  // particle controls
  particlesArray,
  particleCount,
  particleSpeed,
  particleSize,
  sizeScale,
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

  particlesArray.forEach(particle => {
    particle.x = Math.random() * canvas.width
    particle.y = Math.random() * canvas.height
    particle.radius = Math.random() * particleSize
    particle.speedX = Math.random() * particleSpeed
    particle.speedY = Math.random() * particleSpeed
  })

  const options = ['light', 'dark', 'match', 'inverse']
  background = options[Math.ceil(Math.random() * 4)]
  stroke = options[Math.ceil(Math.random() * 4)]
  hue = Math.ceil(Math.random() * 360)
  saturation = Math.ceil(Math.random() * 80)
  lightness = Math.ceil(Math.random() * 100)
  colorRate = (Math.random() * 100) / (Math.random() * 100)
}

/* Setup */

const canvasbg = document.createElement('canvas')
const ctxbg = canvasbg.getContext('2d')

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const controls = document.getElementById('controls')
const closeButton = document.getElementById('close')
const showControlsButton = document.getElementById('show-controls')

const countControl = document.getElementById('count')
countControl.oninput = handleCountControl
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

const canvases = [canvasbg, canvas]

for (const i in canvases) {
  document.body.append(canvases[i])
}

/* Scale foreground and background canvases to look better on retina */

ctx.scale(devicePixelRatio, devicePixelRatio)
ctxbg.scale(devicePixelRatio, devicePixelRatio)

canvas.width = window.innerWidth * devicePixelRatio
canvas.style.width = window.innerWidth

canvas.height = window.innerHeight * devicePixelRatio
canvas.style.height = window.innerHeight

canvasbg.width = window.innerWidth * devicePixelRatio
canvasbg.style.width = window.innerWidth

canvasbg.height = window.innerHeight * devicePixelRatio
canvasbg.style.height = window.innerHeight

window.onload = () => {
  init()
  animate()
}

window.onresize = () => {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.style.width = window.innerWidth

  canvas.height = window.innerHeight * devicePixelRatio
  canvas.style.height = window.innerHeight

  canvasbg.width = window.innerWidth * devicePixelRatio
  canvasbg.style.width = window.innerWidth

  canvasbg.height = window.innerHeight * devicePixelRatio
  canvasbg.style.height = window.innerHeight
}

closeButton.onclick = () => {
  showControlsButton.style.display = 'grid'
  controls.style.display = 'none'
}

showControlsButton.onclick = () => {
  showControlsButton.style.display = 'none'
  controls.style.display = 'grid'
}

/* Event handlers */

function handleCountControl(event) {
  const newCount = Number(event.target.value)

  if (newCount > particleCount) {
    particlesArray.push(new Particle())
  }

  if (newCount < particleCount) {
    particlesArray.splice(0, particleCount - newCount)
  }

  particleCount = newCount
}

function handleSpeedControl(event) {
  const newSpeed = Number(event.target.value)
  particleSpeed = newSpeed
  updateParticleSpeeds(particlesArray)
}

function updateParticleSpeeds(particles) {
  particles.forEach(particle => {
    const positiveX = particle.speedX >= 0
    const positiveY = particle.speedY >= 0
    particle.speedX = positiveX ? particleSpeed : -particleSpeed
    particle.speedY = positiveY ? particleSpeed : -particleSpeed
    particle.update()
  })
}

function handleSizeControl(event) {
  const newSize = Number(event.target.value)
  const change = newSize - particleSize
  updateParticleSizes(particlesArray, change)
}

function updateParticleSizes(particles, change) {

  particles.forEach(particle => {
    particle.updateSize(change)
  })
}

colorRateControl.oninput = event => {
  colorRate = Number(event.target.value)
}

saturationControl.oninput = event => {
  saturation = event.target.value
}

lightnessControl.oninput = event => {
  lightness = event.target.value
}

backgroundLight.onclick = () => {
  background = 'light'
  backgroundButtons.forEach(button => {
    button.classList.remove('active')
  })
  backgroundLight.classList.add('active')
}

backgroundDark.onclick = () => {
  background = 'dark'
  backgroundButtons.forEach(button => {
    button.classList.remove('active')
  })
  backgroundDark.classList.add('active')
}

backgroundMatch.onclick = () => {
  background = 'match'
  backgroundButtons.forEach(button => {
    button.classList.remove('active')
  })
  backgroundMatch.classList.add('active')
}

backgroundInverse.onclick = () => {
  background = 'inverse'
  backgroundButtons.forEach(button => {
    button.classList.remove('active')
  })
  backgroundInverse.classList.add('active')
}

strokeColorLight.onclick = () => {
  stroke = 'light'
  strokeButtons.forEach(button => {
    button.classList.remove('active')
  })
  strokeColorLight.classList.add('active')
}

strokeColorDark.onclick = () => {
  stroke = 'dark'
  strokeButtons.forEach(button => {
    button.classList.remove('active')
  })
  strokeColorDark.classList.add('active')
}

strokeColorMatch.onclick = () => {
  stroke = 'match'
  strokeButtons.forEach(button => {
    button.classList.remove('active')
  })
  strokeColorMatch.classList.add('active')
}

strokeColorInverse.onclick = () => {
  stroke = 'inverse'
  strokeButtons.forEach(button => {
    button.classList.remove('active')
  })
  strokeColorInverse.classList.add('active')
}

reset.onclick = () => {
  reInit()
}

randomizeButton.addEventListener('click', () => {
  randomize(state)
  reInit()
})


class Particle {
  constructor() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.radius = Math.random() * particleSize
    this.speedX = Math.random() * particleSpeed
    this.speedY = Math.random() * particleSpeed
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    ctx.fill()

    if (stroke === 'light') {
      ctx.strokeStyle = 'white'
    }
    if (stroke === 'dark') {
      ctx.strokeStyle = 'black'
    }
    if (stroke === 'match') {
      ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }
    if (stroke === 'inverse') {
      ctx.strokeStyle = `hsl(${360 - hue}, ${100 - saturation}%, ${100 - lightness}%)`
    }

    ctx.stroke()
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

  updateSize(change) {
    let chaching = this.radius + change
    if ((chaching > 0)) {
      this.radius += change
    } else {
      console.log('ouch');
      
      this.radius = 1
    }
  }
}

function init() {
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle())
  }
}

function animate() {
  for (let i = 0; i < particlesArray.length; i++) {
    const element = particlesArray[i]
    element.update()
  }

  if (hue >= 360) {
    hue = 0
  }
  hue += colorRate

  if (background === 'light') {
    ctxbg.fillStyle = 'white'
  }
  if (background === 'dark') {
    ctxbg.fillStyle = 'black'
  }
  if (background === 'match') {
    ctxbg.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }
  if (background === 'inverse') {
    ctxbg.fillStyle = `hsl(${360 - hue}, ${100 - saturation}%, ${100 - lightness}%)`
  }

  ctxbg.fillRect(0, 0, canvas.width, canvas.height)

  requestAnimationFrame(animate)
}

function reInit() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particlesArray.length = 0
  init()
}
