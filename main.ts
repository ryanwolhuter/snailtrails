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
  particleSpeed: 0.05,
  speedScale: 15,
  particleSize: 10,
  particleFill: Colors.match,
  sizeScale: 10,

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
  background: Colors.match,

  growshrink: false,
  shrinkage: 0.2,
  growage: 0.2
}

/* Destructure the values from state for convenient access */

let {
  // particle controls
  particleCount,
  particleSpeed,
  speedScale,
  particleSize,
  sizeScale,
  particleFill,
  // color controls
  colorRate,
  hue,
  saturation,
  lightness,
  background,
  stroke,
  growshrink,
  shrinkage,
  growage } = state

/* Setup */

const canvasbg = document.getElementById('canvasbg') as HTMLCanvasElement
const ctxbg = canvasbg.getContext('2d') as CanvasRenderingContext2D

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const controls = document.getElementById('controls') as HTMLDivElement
const closeButton = document.getElementById('close') as HTMLButtonElement
const showControlsButton = document.getElementById('show-controls') as HTMLButtonElement

const countControl = document.getElementById('count') as HTMLInputElement
const speedControl = document.getElementById('speed') as HTMLInputElement
const sizeControl = document.getElementById('size') as HTMLInputElement
const colorRateControl = document.getElementById('color-rate') as HTMLInputElement
const saturationControl = document.getElementById('saturation') as HTMLInputElement
const lightnessControl = document.getElementById('lightness') as HTMLInputElement
const backgroundLight = document.getElementById('background-light') as HTMLButtonElement
const backgroundDark = document.getElementById('background-dark') as HTMLButtonElement
const backgroundMatch = document.getElementById('background-match') as HTMLButtonElement
const backgroundInverse = document.getElementById('background-inverse') as HTMLButtonElement
const strokeColorLight = document.getElementById('stroke-color-light') as HTMLButtonElement
const strokeColorDark = document.getElementById('stroke-color-dark') as HTMLButtonElement
const strokeColorMatch = document.getElementById('stroke-color-match') as HTMLButtonElement
const strokeColorInverse = document.getElementById('stroke-color-inverse') as HTMLButtonElement
const reset = document.getElementById('reset') as HTMLButtonElement
const randomizeButton = document.getElementById('randomize') as HTMLButtonElement
const growshrinkButton = document.getElementById('growshrink') as HTMLButtonElement

const backgroundButtons = [backgroundLight, backgroundDark, backgroundMatch, backgroundInverse]

const strokeButtons = [strokeColorLight, strokeColorDark, strokeColorMatch, strokeColorInverse]

const canvases = [
  { canvas: canvasbg, ctx: ctxbg },
  { canvas, ctx }
]

countControl.oninput = handleCountControl
speedControl.oninput = handleSpeedControl
sizeControl.oninput = handleSizeControl

window.onresize = () => {
  scaleCanvases(canvases)
}

closeButton.onclick = () => {
  showControlsButton.style.display = 'grid'
  controls.style.display = 'none'
}

showControlsButton.onclick = () => {
  showControlsButton.style.display = 'none'
  controls.style.display = 'grid'
}

reset.onclick = () => {
  reInit()
}

randomizeButton.addEventListener('click', () => {
  randomize()
  reInit()
})

growshrinkButton.addEventListener('click', () => {
  growshrink = !growshrink
  if (growshrink) {
    growshrinkButton.innerHTML = 'Growing + Shrinking'
  } else {
    growshrinkButton.innerHTML = 'Not Growing + Shrinking'
  }
})

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
  speedScale = Number(element.value)
}

function handleSizeControl(event: Event) {
  const element = event.currentTarget as HTMLInputElement
  sizeScale = Number(element.value)
}

class Particle {
  constructor(
    public x = Math.random() * canvas.width,
    public y = Math.random() * canvas.height,
    public speedX = Math.random() * particleSpeed * speedScale,
    public speedY = Math.random() * particleSpeed * speedScale,
    public radius = Math.random() * particleSize * sizeScale,
    public particleSizeScale = sizeScale,
    public particleSpeedScale = speedScale,
    public shrinking = true) {
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = determineColor(particleFill, hue, saturation, lightness)
    ctx.fill()
    ctx.strokeStyle = determineColor(stroke, hue, saturation, lightness)
    ctx.stroke()
  }

  update() {
    const sizeScaleChange = Number((sizeScale - this.particleSizeScale).toPrecision(2))

    if (sizeScaleChange !== 0) {
      const unscaled = Number((this.radius / this.particleSizeScale).toPrecision(2))
      this.particleSizeScale = sizeScale
      this.radius = unscaled * this.particleSizeScale
    }

    if (growshrink) {
      if (this.shrinking) {
        const change = this.radius - shrinkage
        if (change >= 5) {
          this.radius -= shrinkage
        } else {
          this.shrinking = false
        }
      } else {
        if (this.radius >= 100) {
          this.shrinking = true
        }
        this.radius += growage
      }
    }

    const speedScaleChange = Number((speedScale - this.particleSpeedScale).toPrecision(2))

    if (speedScaleChange !== 0) {
      const unscaledSpeedX = Number((this.speedX / this.particleSpeedScale).toPrecision(2))
      const unscaledSpeedY = Number((this.speedX / this.particleSpeedScale).toPrecision(2))

      this.particleSpeedScale = speedScale

      this.speedX = unscaledSpeedX * this.particleSpeedScale
      this.speedY = unscaledSpeedY * this.particleSpeedScale
    }

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
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles.length = 0
  init()
}

scaleCanvases(canvases)
init()
animate()

function randomize() {
  sizeScale = Math.ceil(Math.random() * 15)
  speedScale = Math.ceil(Math.random() * 256)
  particleCount = Math.ceil(Math.random() * 50)

  reInit()

  particles.forEach((particle: Particle) => {
    particle.x = Math.random() * canvas.width
    particle.y = Math.random() * canvas.height
    particle.radius = Math.random() * particleSize * sizeScale
    particle.speedX = Math.random() * particleSpeed * speedScale
    particle.speedY = Math.random() * particleSpeed * speedScale
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

  sizeControl.value = sizeScale.toString()
  speedControl.value = speedScale.toString()
  countControl.value = particleCount.toString()
  colorRateControl.value = colorRate.toString()
  saturationControl.value = saturation.toString()
  lightnessControl.value = lightness.toString()

}
