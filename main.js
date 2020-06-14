/*
 * All the application state lives inside this object.
 *
 * `console.log(state)` for a snapshot of the whole state.
 *
 * All the values are destructured into variables with the same names below.
*/
var state = {
    /* Particles */
    particlesArray: [],
    particleCount: 30,
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
};
/* Destructure the values from state for convenient access */
var 
// particle controls
particlesArray = state.particlesArray, particleCount = state.particleCount, particleSpeed = state.particleSpeed, particleSize = state.particleSize, sizeScale = state.sizeScale, 
// color controls
colorRate = state.colorRate, hue = state.hue, saturation = state.saturation, lightness = state.lightness, background = state.background, stroke = state.stroke;
function randomize() {
    particleSize = Math.random() * 100;
    particleSpeed = (Math.random() * 100) / (Math.random() * 100);
    particlesArray.forEach(function (particle) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.radius = Math.random() * particleSize;
        particle.speedX = Math.random() * particleSpeed;
        particle.speedY = Math.random() * particleSpeed;
    });
    var options = ['light', 'dark', 'match', 'inverse'];
    background = options[Math.ceil(Math.random() * 4)];
    stroke = options[Math.ceil(Math.random() * 4)];
    hue = Math.ceil(Math.random() * 360);
    saturation = Math.ceil(Math.random() * 80);
    lightness = Math.ceil(Math.random() * 100);
    colorRate = (Math.random() * 100) / (Math.random() * 100);
}
/* Setup */
var canvasbg = document.createElement('canvas');
var ctxbg = canvasbg.getContext('2d');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.append(canvasbg, canvas);
var controls = document.getElementById('controls');
var closeButton = document.getElementById('close');
var showControlsButton = document.getElementById('show-controls');
var countControl = document.getElementById('count');
countControl.oninput = handleCountControl;
var speedControl = document.getElementById('speed');
speedControl.oninput = handleSpeedControl;
var sizeControl = document.getElementById('size');
sizeControl.oninput = handleSizeControl;
var colorRateControl = document.getElementById('color-rate');
var saturationControl = document.getElementById('saturation');
var lightnessControl = document.getElementById('lightness');
var backgroundLight = document.getElementById('background-light');
var backgroundDark = document.getElementById('background-dark');
var backgroundMatch = document.getElementById('background-match');
var backgroundInverse = document.getElementById('background-inverse');
var strokeColorLight = document.getElementById('stroke-color-light');
var strokeColorDark = document.getElementById('stroke-color-dark');
var strokeColorMatch = document.getElementById('stroke-color-match');
var strokeColorInverse = document.getElementById('stroke-color-inverse');
var reset = document.getElementById('reset');
var randomizeButton = document.getElementById('randomize');
var backgroundButtons = [backgroundLight, backgroundDark, backgroundMatch, backgroundInverse];
var strokeButtons = [strokeColorLight, strokeColorDark, strokeColorMatch, strokeColorInverse];
/* Scale foreground and background canvases to look better on retina */
ctx.scale(devicePixelRatio, devicePixelRatio);
ctxbg.scale(devicePixelRatio, devicePixelRatio);
canvas.width = window.innerWidth * devicePixelRatio;
canvas.style.width = window.innerWidth;
canvas.height = window.innerHeight * devicePixelRatio;
canvas.style.height = window.innerHeight;
canvasbg.width = window.innerWidth * devicePixelRatio;
canvasbg.style.width = window.innerWidth;
canvasbg.height = window.innerHeight * devicePixelRatio;
canvasbg.style.height = window.innerHeight;
window.onload = function () {
    init();
    animate();
};
window.onresize = function () {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.style.width = window.innerWidth;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.height = window.innerHeight;
    canvasbg.width = window.innerWidth * devicePixelRatio;
    canvasbg.style.width = window.innerWidth;
    canvasbg.height = window.innerHeight * devicePixelRatio;
    canvasbg.style.height = window.innerHeight;
};
closeButton.onclick = function () {
    showControlsButton.style.display = 'grid';
    controls.style.display = 'none';
};
showControlsButton.onclick = function () {
    showControlsButton.style.display = 'none';
    controls.style.display = 'grid';
};
/* Event handlers */
function handleCountControl(event) {
    var newCount = Number(event.target.value);
    if (newCount > particleCount) {
        particlesArray.push(new Particle());
    }
    if (newCount < particleCount) {
        particlesArray.splice(0, particleCount - newCount);
    }
    particleCount = newCount;
}
function handleSpeedControl(event) {
    var newSpeed = Number(event.target.value);
    particleSpeed = newSpeed;
    updateParticleSpeeds(particlesArray);
}
function updateParticleSpeeds(particles) {
    particles.forEach(function (particle) {
        var positiveX = particle.speedX >= 0;
        var positiveY = particle.speedY >= 0;
        particle.speedX = positiveX ? particleSpeed : -particleSpeed;
        particle.speedY = positiveY ? particleSpeed : -particleSpeed;
        particle.update();
    });
}
function handleSizeControl(event) {
    var newSize = Number(event.target.value);
    var change = newSize - particleSize;
    updateParticleSizes(particlesArray, change);
}
function updateParticleSizes(particles, change) {
    particles.forEach(function (particle) {
        particle.updateSize(change);
    });
}
colorRateControl.oninput = function (event) {
    colorRate = Number(event.target.value);
};
saturationControl.oninput = function (event) {
    saturation = event.target.value;
};
lightnessControl.oninput = function (event) {
    lightness = event.target.value;
};
backgroundLight.onclick = function () {
    background = 'light';
    backgroundButtons.forEach(function (button) {
        button.classList.remove('active');
    });
    backgroundLight.classList.add('active');
};
backgroundDark.onclick = function () {
    background = 'dark';
    backgroundButtons.forEach(function (button) {
        button.classList.remove('active');
    });
    backgroundDark.classList.add('active');
};
backgroundMatch.onclick = function () {
    background = 'match';
    backgroundButtons.forEach(function (button) {
        button.classList.remove('active');
    });
    backgroundMatch.classList.add('active');
};
backgroundInverse.onclick = function () {
    background = 'inverse';
    backgroundButtons.forEach(function (button) {
        button.classList.remove('active');
    });
    backgroundInverse.classList.add('active');
};
strokeColorLight.onclick = function () {
    stroke = 'light';
    strokeButtons.forEach(function (button) {
        button.classList.remove('active');
    });
    strokeColorLight.classList.add('active');
};
strokeColorDark.onclick = function () {
    stroke = 'dark';
    strokeButtons.forEach(function (button) {
        button.classList.remove('active');
    });
    strokeColorDark.classList.add('active');
};
strokeColorMatch.onclick = function () {
    stroke = 'match';
    strokeButtons.forEach(function (button) {
        button.classList.remove('active');
    });
    strokeColorMatch.classList.add('active');
};
strokeColorInverse.onclick = function () {
    stroke = 'inverse';
    strokeButtons.forEach(function (button) {
        button.classList.remove('active');
    });
    strokeColorInverse.classList.add('active');
};
reset.onclick = function () {
    reInit();
};
randomizeButton.addEventListener('click', function () {
    randomize(state);
    reInit();
});
var Particle = /** @class */ (function () {
    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * particleSize;
        this.speedX = Math.random() * particleSpeed;
        this.speedY = Math.random() * particleSpeed;
    }
    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
        ctx.fill();
        if (stroke === 'light') {
            ctx.strokeStyle = 'white';
        }
        if (stroke === 'dark') {
            ctx.strokeStyle = 'black';
        }
        if (stroke === 'match') {
            ctx.strokeStyle = "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
        }
        if (stroke === 'inverse') {
            ctx.strokeStyle = "hsl(" + (360 - hue) + ", " + (100 - saturation) + "%, " + (100 - lightness) + "%)";
        }
        ctx.stroke();
    };
    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x + this.radius > canvas.width
            || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.radius > canvas.height
            || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
        this.draw();
    };
    Particle.prototype.updateSize = function (change) {
        var chaching = this.radius + change;
        if ((chaching > 0)) {
            this.radius += change;
        }
        else {
            console.log('ouch');
            this.radius = 1;
        }
    };
    return Particle;
}());
function init() {
    for (var i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}
function animate() {
    for (var i = 0; i < particlesArray.length; i++) {
        var element = particlesArray[i];
        element.update();
    }
    if (hue >= 360) {
        hue = 0;
    }
    hue += colorRate;
    if (background === 'light') {
        ctxbg.fillStyle = 'white';
    }
    if (background === 'dark') {
        ctxbg.fillStyle = 'black';
    }
    if (background === 'match') {
        ctxbg.fillStyle = "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
    }
    if (background === 'inverse') {
        ctxbg.fillStyle = "hsl(" + (360 - hue) + ", " + (100 - saturation) + "%, " + (100 - lightness) + "%)";
    }
    ctxbg.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
}
function reInit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.length = 0;
    init();
}
