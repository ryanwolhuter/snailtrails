let particleCount = 200
let particleSpeed = 4
let particleSize = 2
let hueSpeed = 4
let hue = 0
let background = 'black'
let strokeColor = 'black'

const body = document.body
body.style.background = background

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const particlesArray = []

// const gradient = ctx.createLinearGradient(0,0,canvas.width,0)
// gradient.addColorStop('0.2', 'red')
// gradient.addColorStop('0.4', 'blue')
// gradient.addColorStop('0.6', 'yellow')
// gradient.addColorStop('0.8', 'pink')

class Particle {
  constructor() {
    this.x =  Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.radius = (Math.random() * 10) + particleSize
    this.speedX = (Math.random() * 3) - particleSpeed
    this.speedY = (Math.random() * 3) - particleSpeed
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
    // ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = strokeColor
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
  ctx.fillStyle = 'hsla(0, 100%, 50%, 0.01)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < particlesArray.length; i++) {
    const element = particlesArray[i]
    element.update()
  }
  hue += hueSpeed
  requestAnimationFrame(animate)
}

init()
animate()
