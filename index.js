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
  particleCount: 30,
  particleSpeed: 1,
  particleSize: 85,

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
  saturation: 30,
  lightness: 10,
  colorRate: 1,
  // stroke color (one of 'light', 'dark', 'match', 'inverse')
  stroke: 'inverse',
  // background color (one of 'light', 'dark', 'match', 'inverse')
  background: 'inverse'
}

/* Destructure the values from state for convenient access */

let {
  // particle controls
  particlesArray,
  particleCount,
  particleSpeed,
  particleSize,
  // color controls
  colorRate,
  hue,
  saturation,
  lightness,
  background,
  stroke } = state

/* Setup */

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const canvasbg = document.getElementById('canvasbg')
const ctxbg = canvasbg.getContext('2d')

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

const backgroundButtons = [backgroundLight, backgroundDark, backgroundMatch, backgroundInverse]

const strokeButtons = [strokeColorLight, strokeColorDark, strokeColorMatch, strokeColorInverse]

/* Scale foreground and background canvases to look better on retina */

ctx.scale(2, 2)
ctxbg.scale(2, 2)

canvas.width = window.innerWidth * 2
canvas.style.width = window.innerWidth

canvas.height = window.innerHeight * 2
canvas.style.height = window.innerHeight

canvasbg.width = window.innerWidth * 2
canvasbg.style.width = window.innerWidth

canvasbg.height = window.innerHeight * 2
canvasbg.style.height = window.innerHeight

window.onload = () => {
  init()
  animate()
}

window.onresize = () => {
  canvas.width = window.innerWidth * 2
  canvas.style.width = window.innerWidth

  canvas.height = window.innerHeight * 2
  canvas.style.height = window.innerHeight

  canvasbg.width = window.innerWidth * 2
  canvasbg.style.width = window.innerWidth

  canvasbg.height = window.innerHeight * 2
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
    ctx.clearRect(0, 0, canvas.width, canvas.height)
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
  particleSize = newSize
  updateParticleSizes(particlesArray)
}

function updateParticleSizes(particles) {
  particles.forEach(particle => {
    particle.radius = Math.random() * particleSize
    particle.update()
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
