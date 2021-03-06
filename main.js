import { Colors, determineColor, scaleCanvases } from './helpers/helpers.js';
/*
 * All the application state lives inside this object.
 *
 * `console.log(state)` for a snapshot of the whole state.
 *
 * All the values are destructured into variables with the same names below.
*/
const particles = [];
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
    growage: 0.2,
    jiggling: false,
    jigglage: 4,
    accelerating: false,
    acceleration: 1.001
};
/* Destructure the values from state for convenient access */
let { 
// particle controls
particleCount, particleSpeed, speedScale, particleSize, sizeScale, particleFill, 
// color controls
colorRate, hue, saturation, lightness, background, stroke, growshrink, shrinkage, growage, jiggling, jigglage, acceleration, accelerating } = state;
/* Setup */
const canvasbg = document.getElementById('canvasbg');
const ctxbg = canvasbg.getContext('2d');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const closeButton = document.getElementById('close');
const showControlsButton = document.getElementById('show-controls');
const countControl = document.getElementById('count');
const speedControl = document.getElementById('speed');
const sizeControl = document.getElementById('size');
const colorRateControl = document.getElementById('color-rate');
const saturationControl = document.getElementById('saturation');
const lightnessControl = document.getElementById('lightness');
const backgroundLight = document.getElementById('background-light');
const backgroundDark = document.getElementById('background-dark');
const backgroundMatch = document.getElementById('background-match');
const backgroundInverse = document.getElementById('background-inverse');
const strokeColorLight = document.getElementById('stroke-color-light');
const strokeColorDark = document.getElementById('stroke-color-dark');
const strokeColorMatch = document.getElementById('stroke-color-match');
const strokeColorInverse = document.getElementById('stroke-color-inverse');
const reset = document.getElementById('reset');
const randomizeButton = document.getElementById('randomize');
const growshrinkButton = document.getElementById('growshrink');
const shrinkageControl = document.getElementById('shrinkage');
const growageControl = document.getElementById('growage');
const jiggleToggle = document.getElementById('jiggle-toggle');
const jigglageControl = document.getElementById('jigglage-control');
const backgroundButtons = [backgroundLight, backgroundDark, backgroundMatch, backgroundInverse];
const strokeButtons = [strokeColorLight, strokeColorDark, strokeColorMatch, strokeColorInverse];
const canvases = [
    { canvas: canvasbg, ctx: ctxbg },
    { canvas, ctx }
];
countControl.oninput = handleCountControl;
speedControl.oninput = handleSpeedControl;
sizeControl.oninput = handleSizeControl;
window.onresize = () => {
    scaleCanvases(canvases);
};
closeButton.onclick = () => {
    showControlsButton.style.display = 'grid';
    controls.style.display = 'none';
};
showControlsButton.onclick = () => {
    showControlsButton.style.display = 'none';
    controls.style.display = 'grid';
};
reset.onclick = () => {
    reInit();
};
randomizeButton.addEventListener('click', () => {
    randomize();
    reInit();
});
growshrinkButton.addEventListener('click', () => {
    growshrink = !growshrink;
    if (growshrink) {
        growshrinkButton.innerHTML = 'Growing + Shrinking';
    }
    else {
        growshrinkButton.innerHTML = 'Not Growing + Shrinking';
    }
});
jiggleToggle.addEventListener('click', () => {
    jiggling = !jiggling;
    if (jiggling) {
        jiggleToggle.innerHTML = 'Jiggling';
    }
    else {
        jiggleToggle.innerHTML = 'Not Jiggling';
    }
});
shrinkageControl.addEventListener('input', (event) => {
    const element = event.currentTarget;
    shrinkage = Number(element.value);
});
growageControl.addEventListener('input', (event) => {
    const element = event.currentTarget;
    growage = Number(element.value);
});
jigglageControl.addEventListener('input', (event) => {
    const element = event.currentTarget;
    jigglage = Number(element.value);
});
colorRateControl.addEventListener('input', (event) => {
    const element = event.currentTarget;
    colorRate = Number(element.value);
});
saturationControl.addEventListener('input', (event) => {
    const element = event.currentTarget;
    saturation = Number(element.value);
});
lightnessControl.addEventListener('input', (event) => {
    const element = event.currentTarget;
    lightness = Number(element.value);
});
backgroundLight.onclick = () => {
    background = Colors.light;
    backgroundButtons.forEach(button => {
        button.classList.remove('active');
    });
    backgroundLight.classList.add('active');
};
backgroundDark.onclick = () => {
    background = Colors.dark;
    backgroundButtons.forEach(button => {
        button.classList.remove('active');
    });
    backgroundDark.classList.add('active');
};
backgroundMatch.onclick = () => {
    background = Colors.match;
    backgroundButtons.forEach(button => {
        button.classList.remove('active');
    });
    backgroundMatch.classList.add('active');
};
backgroundInverse.onclick = () => {
    background = Colors.inverse;
    backgroundButtons.forEach(button => {
        button.classList.remove('active');
    });
    backgroundInverse.classList.add('active');
};
strokeColorLight.onclick = () => {
    stroke = Colors.light;
    strokeButtons.forEach(button => {
        button.classList.remove('active');
    });
    strokeColorLight.classList.add('active');
};
strokeColorDark.onclick = () => {
    stroke = Colors.dark;
    strokeButtons.forEach(button => {
        button.classList.remove('active');
    });
    strokeColorDark.classList.add('active');
};
strokeColorMatch.onclick = () => {
    stroke = Colors.match;
    strokeButtons.forEach(button => {
        button.classList.remove('active');
    });
    strokeColorMatch.classList.add('active');
};
strokeColorInverse.onclick = () => {
    stroke = Colors.inverse;
    strokeButtons.forEach(button => {
        button.classList.remove('active');
    });
    strokeColorInverse.classList.add('active');
};
/* Event handlers */
function handleCountControl(event) {
    const element = event.currentTarget;
    const newCount = Number(element.value);
    if (newCount > particleCount) {
        particles.push(new Particle());
    }
    if (newCount < particleCount) {
        particles.splice(0, particleCount - newCount);
    }
    particleCount = newCount;
}
function handleSpeedControl(event) {
    const element = event.currentTarget;
    speedScale = Number(element.value);
}
function handleSizeControl(event) {
    const element = event.currentTarget;
    sizeScale = Number(element.value);
}
class Particle {
    constructor(x = Math.random() * canvas.width, y = Math.random() * canvas.height, speedX = Math.random() * particleSpeed * speedScale, speedY = Math.random() * particleSpeed * speedScale, radius = Math.random() * particleSize * sizeScale, particleSizeScale = sizeScale, particleSpeedScale = speedScale, shrinking = true) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.radius = radius;
        this.particleSizeScale = particleSizeScale;
        this.particleSpeedScale = particleSpeedScale;
        this.shrinking = shrinking;
    }
    draw() {
        if (this.radius <= 0) {
            this.radius = 1;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = determineColor(particleFill, hue, saturation, lightness);
        ctx.fill();
        ctx.strokeStyle = determineColor(stroke, hue, saturation, lightness);
        ctx.stroke();
    }
    update() {
        if (this.radius <= 0) {
            this.radius = 1;
        }
        const sizeScaleChange = Number((sizeScale - this.particleSizeScale).toPrecision(2));
        if (sizeScaleChange !== 0) {
            const unscaled = Number((this.radius / this.particleSizeScale).toPrecision(2));
            this.particleSizeScale = sizeScale;
            this.radius = unscaled * this.particleSizeScale;
        }
        if (growshrink) {
            if (this.shrinking) {
                const change = this.radius - shrinkage;
                if (change >= 5) {
                    this.radius -= shrinkage;
                }
                else {
                    this.shrinking = false;
                }
            }
            else {
                if (this.radius >= 100) {
                    this.shrinking = true;
                }
                this.radius += growage;
            }
        }
        const speedScaleChange = Number((speedScale - this.particleSpeedScale).toPrecision(2));
        if (speedScaleChange !== 0) {
            const unscaledSpeedX = Number((this.speedX / this.particleSpeedScale).toPrecision(2));
            const unscaledSpeedY = Number((this.speedX / this.particleSpeedScale).toPrecision(2));
            this.particleSpeedScale = speedScale;
            this.speedX = unscaledSpeedX * this.particleSpeedScale;
            this.speedY = unscaledSpeedY * this.particleSpeedScale;
        }
        if (jiggling) {
            this.x += (Math.random() - 0.5) * jigglage;
            this.y += (Math.random() - 0.5) * jigglage;
            this.radius += (Math.random() - 0.5) * jigglage;
        }
        if (this.x + this.radius > canvas.width
            || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.radius > canvas.height
            || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (accelerating) {
            this.speedX *= acceleration;
            this.speedY *= acceleration;
        }
        this.draw();
    }
}
function init() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
function animate() {
    for (let i = 0; i < particles.length; i++) {
        const element = particles[i];
        element.update();
    }
    if (hue >= 360) {
        hue = 0;
    }
    hue += colorRate;
    ctxbg.fillStyle = determineColor(background, hue, saturation, lightness);
    ctxbg.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
}
function reInit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.length = 0;
    init();
}
scaleCanvases(canvases);
init();
animate();
function randomize() {
    sizeScale = Math.ceil(Math.random() * 15);
    speedScale = Math.ceil(Math.random() * 256);
    particleCount = Math.ceil(Math.random() * 50);
    growshrink = Math.random() > 0.5;
    shrinkage = Math.random();
    growage = Math.random();
    jiggling = Math.random() > 0.5;
    jigglage = Math.random() * 4;
    reInit();
    particles.forEach((particle) => {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.radius = Math.random() * particleSize * sizeScale;
        particle.speedX = Math.random() * particleSpeed * speedScale;
        particle.speedY = Math.random() * particleSpeed * speedScale;
    });
    const options = [
        Colors.light,
        Colors.dark,
        Colors.match,
        Colors.inverse
    ];
    background = options[Math.ceil(Math.random() * 4)];
    stroke = options[Math.ceil(Math.random() * 4)];
    hue = Math.ceil(Math.random() * 360);
    saturation = Math.ceil(Math.random() * 100);
    lightness = Math.ceil(Math.random() * 100);
    colorRate = (Math.random() * 100) / (Math.random() * 100);
    sizeControl.value = sizeScale.toString();
    speedControl.value = speedScale.toString();
    countControl.value = particleCount.toString();
    colorRateControl.value = colorRate.toString();
    saturationControl.value = saturation.toString();
    lightnessControl.value = lightness.toString();
}
