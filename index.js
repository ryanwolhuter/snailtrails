const state = {
  // particle controls
  particlesArray: [],
  particleCount: 30,
  particleSpeed: 1,
  particleSize: 85,
  // color controls
  colorRate: 1.0,
  hue: 0,
  saturation: 30,
  lightness: 10,
  // background
  lightBackground: false,
  darkBackground: false,
  matchBackground: false,
  inverseBackground: true,
  // stroke
  lightStroke: true,
  darkStroke: false,
  matchStroke: false,
  inverseStroke: true,
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
  lightBackground,
  darkBackground,
  matchBackground,
  inverseBackground,
  // stroke
  lightStroke,
  darkStroke,
  matchStroke,
  inverseStroke } = state

/* Setup */

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.scale(2, 2)

canvas.width = window.innerWidth * 2
canvas.style.width = window.innerWidth

canvas.height = window.innerHeight * 2
canvas.style.height = window.innerHeight

const body = document.body
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

body.onresize = () => {
  canvas.width = window.innerWidth * 2
  canvas.style.width = window.innerWidth

  canvas.height = window.innerHeight * 2
  canvas.style.height = window.innerHeight
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

backgroundLight.onclick = () => {
  lightBackground = true
  darkBackground = false
  matchBackground = false
  inverseBackground = false
}

const backgroundDark = document.getElementById('background-dark')

backgroundDark.onclick = () => {
  lightBackground = false
  darkBackground = true
  matchBackground = false
  inverseBackground = false
}

const backgroundMatch = document.getElementById('background-match')

backgroundMatch.onclick = () => {
  lightBackground = false
  darkBackground = false
  matchBackground = true
  inverseBackground = false
}
const backgroundInverse = document.getElementById('background-inverse')

backgroundInverse.onclick = () => {
  lightBackground = false
  darkBackground = false
  matchBackground = false
  inverseBackground = true
}

const strokeColorLight = document.getElementById('stroke-color-light')

strokeColorLight.onclick = () => {
  lightStroke = true
  darkStroke = false
  matchStroke = false
  inverseStroke = false
}

const strokeColorDark = document.getElementById('stroke-color-dark')

strokeColorDark.onclick = () => {
  lightStroke = false
  darkStroke = true
  matchStroke = false
  inverseStroke = false
}

const strokeColorMatch = document.getElementById('stroke-color-match')

strokeColorMatch.onclick = () => {
  lightStroke = false
  darkStroke = false
  matchStroke = true
  inverseStroke = false
}

const strokeColorInverse = document.getElementById('stroke-color-inverse')

strokeColorInverse.onclick = () => {
  lightStroke = false
  darkStroke = false
  matchStroke = false
  inverseStroke = true
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
    if (lightStroke) {
      ctx.strokeStyle = 'white'
    }
    if (darkStroke) {
      ctx.strokeStyle = 'black'
    }
    if (matchStroke) {
      ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }
    if (inverseStroke) {
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
  ctx.fillStyle = 'hsla(0, 0%, 100%, 0.001)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < particlesArray.length; i++) {
    const element = particlesArray[i]
    element.update()
  }

  let newHue = hue + colorRate
  if (newHue >= 360) {
    newHue = 360 - newHue
  }
  hue = newHue

  if (lightBackground) {
    body.style.background = 'white'
  }
  if (darkBackground) {
    body.style.background = 'black'
  }
  if (matchBackground) {
    body.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }
  if (inverseBackground) {
    body.style.background = `hsl(${360 - hue}, ${100 - saturation}%, ${100 - lightness}%)`
  }

  requestAnimationFrame(animate)
}

function reInit() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particlesArray.length = 0
  init()
}

init()
animate()
