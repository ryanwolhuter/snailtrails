const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let numberOfParticles = 200
const particlesArray = []
// let hue = 0

const gradient = ctx.createLinearGradient(0,0,canvas.width,0)
gradient.addColorStop('0.2', 'red')
gradient.addColorStop('0.4', 'blue')
gradient.addColorStop('0.6', 'yellow')
gradient.addColorStop('0.8', 'pink')

class Particle {
  constructor() {
    this.x =  Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.radius = (Math.random() * 10) + 2
    this.speedX = (Math.random() * 3) - 1.5
    this.speedY = (Math.random() * 3) - 1.5
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    // ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = 'black'
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
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle())
  }
}

function animate() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.01)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < particlesArray.length; i++) {
    const element = particlesArray[i]
    element.update()
  }
  // hue+=0.5
  requestAnimationFrame(animate)
}

init()
animate()
