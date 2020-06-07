/* Variable parameters */

// count
let particleCount = 300

// speed
let particleSpeed = 2

// size
let particleSize = 15

// rate of color change
let colorRate = 1.0

// hue
let hue = 0

// saturation (%)
let saturation = 40

// lightness (%)
let lightness = 50

// background
let lightBackground = true
let darkBackground = false
let matchBackground = false
let inverseBackground = false

// stroke
let lightStroke = true
let darkStroke = false
let matchStroke = false
let inverseStroke = false

/* Setup */

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const body = document.body

const controls = document.getElementById('controls')
const closeButton = document.getElementById('close')
const showControlsButton = document.getElementById('show-controls__button')

closeButton.onclick = () => {
  showControlsButton.style.display = 'grid'
  controls.style.display = 'none'
}

showControlsButton.onclick = () => {
  showControlsButton.style.display = 'none'
  controls.style.display = 'grid'
}

const particlesArray = []

body.onresize = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  reInit()
}

/* Controls */

const countControl = document.getElementById('count')

countControl.oninput = event => {
  particleCount = event.target.value
  console.log(particleCount)
  reInit()
}

const speedControl = document.getElementById('speed')

speedControl.oninput = event => {
  const newSpeed = Number(parseFloat(event.target.value).toPrecision(1))
  particleSpeed = newSpeed
  console.log({ newSpeed, particleSpeed })
  reInit()
}

const sizeControl = document.getElementById('size')

sizeControl.oninput = event => {
  particleSize = event.target.value
  reInit()
}

const colorRateControl = document.getElementById('color-rate')

colorRateControl.oninput = event => {
  colorRate = Number(parseFloat(event.target.value).toPrecision(1))
  console.log({ colorRate, hue })
  reInit()
}

const saturationControl = document.getElementById('saturation')

saturationControl.oninput = event => {
  saturation = event.target.value
  reInit()
}

const lightnessControl = document.getElementById('lightness')

lightnessControl.oninput = event => {
  lightness = event.target.value
  reInit()
}

const backgroundLight = document.getElementById('background-light')

backgroundLight.onclick = () => {
  lightBackground = true
  darkBackground = false
  matchBackground = false
  inverseBackground = false
  reInit()
}

const backgroundDark = document.getElementById('background-dark')

backgroundDark.onclick = () => {
  lightBackground = false
  darkBackground = true
  matchBackground = false
  inverseBackground = false
  reInit()
}

const backgroundMatch = document.getElementById('background-match')

backgroundMatch.onclick = () => {
  lightBackground = false
  darkBackground = false
  matchBackground = true
  inverseBackground = false
  reInit()
}
const backgroundInverse = document.getElementById('background-inverse')

backgroundInverse.onclick = () => {
  lightBackground = false
  darkBackground = false
  matchBackground = false
  inverseBackground = true
  reInit()
}

const strokeColorLight = document.getElementById('stroke-color-light')

strokeColorLight.onclick = () => {
  lightStroke = true
  darkStroke = false
  matchStroke = false
  inverseStroke = false
  reInit()
}

const strokeColorDark = document.getElementById('stroke-color-dark')

strokeColorDark.onclick = () => {
  lightStroke = false
  darkStroke = true
  matchStroke = false
  inverseStroke = false
  reInit()
}

const strokeColorMatch = document.getElementById('stroke-color-match')

strokeColorMatch.onclick = () => {
  lightStroke = false
  darkStroke = false
  matchStroke = true
  inverseStroke = false
  reInit()
}

const strokeColorInverse = document.getElementById('stroke-color-inverse')

strokeColorInverse.onclick = () => {
  lightStroke = false
  darkStroke = false
  matchStroke = false
  inverseStroke = true
  reInit()
}

// const gradient = ctx.createLinearGradient(0,0,canvas.width,0)
// gradient.addColorStop('0.2', 'red')
// gradient.addColorStop('0.4', 'blue')
// gradient.addColorStop('0.6', 'yellow')
// gradient.addColorStop('0.8', 'pink')

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.radius = (Math.random() * particleSize)
    this.speedX = (Math.random()) - particleSpeed
    this.speedY = (Math.random()) - particleSpeed
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    // ctx.fillStyle = gradient
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
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
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
