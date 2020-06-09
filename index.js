const state = {
  // particle controls
  particlesArray: [],
  particleCount: 30,
  particleSpeed: 1,
  particleSize: 85,
  // color controls
  colorRate: 1,
  hue: 0,
  saturation: 30,
  lightness: 10,
  // background (one of light, dark, match, inverse)
  background: 'inverse',
  // stroke
  stroke: 'inverse'
}

let { // particle controls
  particlesArray,
  particleCount,
  particleSpeed,
  particleSize,
  // color controls
  colorRate,
  hue,
  saturation,
  lightness,
  // background
  background,
  // stroke
  stroke } = state

/* Setup */

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.scale(2, 2)

canvas.width = window.innerWidth * 2
canvas.style.width = window.innerWidth

canvas.height = window.innerHeight * 2
canvas.style.height = window.innerHeight

const canvasbg = document.getElementById('canvasbg')
const ctxbg = canvasbg.getContext('2d')
ctxbg.scale(2, 2)

canvasbg.width = window.innerWidth * 2
canvasbg.style.width = window.innerWidth

canvasbg.height = window.innerHeight * 2
canvasbg.style.height = window.innerHeight

const controls = document.getElementById('controls')
const closeButton = document.getElementById('close')
const showControlsButton = document.getElementById('show-controls')

closeButton.onclick = () => {
  showControlsButton.style.display = 'grid'
  controls.style.display = 'none'
}

showControlsButton.onclick = () => {
  showControlsButton.style.display = 'none'
  controls.style.display = 'grid'
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

/* Controls */

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

const countControl = document.getElementById('count')
countControl.oninput = handleCountControl

/* SPEED */

function handleSpeedControl(event) {
  const newSpeed = Number(event.target.value)
  particleSpeed = newSpeed
  updateParticleSpeeds(particlesArray)
}

function updateParticleSpeeds(particles) {
  particles.forEach(particle => {
    particle.speedX = particleSpeed
    particle.speedY = particleSpeed
    particle.update()
  })
}

const speedControl = document.getElementById('speed')
speedControl.oninput = handleSpeedControl


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

const sizeControl = document.getElementById('size')
sizeControl.oninput = handleSizeControl

const colorRateControl = document.getElementById('color-rate')

colorRateControl.oninput = event => {
  colorRate = Number(event.target.value)
}

const saturationControl = document.getElementById('saturation')

saturationControl.oninput = event => {
  saturation = event.target.value
}

const lightnessControl = document.getElementById('lightness')

lightnessControl.oninput = event => {
  lightness = event.target.value
}

const backgroundLight = document.getElementById('background-light')
const backgroundDark = document.getElementById('background-dark')
const backgroundMatch = document.getElementById('background-match')
const backgroundInverse = document.getElementById('background-inverse')

const backgroundButtons = [backgroundLight, backgroundDark, backgroundMatch, backgroundInverse]

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

const strokeColorLight = document.getElementById('stroke-color-light')
const strokeColorDark = document.getElementById('stroke-color-dark')
const strokeColorMatch = document.getElementById('stroke-color-match')
const strokeColorInverse = document.getElementById('stroke-color-inverse')

const strokeButtons = [strokeColorLight, strokeColorDark, strokeColorMatch, strokeColorInverse]

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

const reset = document.getElementById('reset')
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

  let newHue = hue + colorRate
  if (newHue >= 360) {
    newHue = 360 - newHue
  }
  hue = newHue

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

init()
animate()
