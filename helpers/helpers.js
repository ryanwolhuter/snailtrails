export var Colors;
(function (Colors) {
    Colors[Colors["light"] = 0] = "light";
    Colors[Colors["dark"] = 1] = "dark";
    Colors[Colors["match"] = 2] = "match";
    Colors[Colors["inverse"] = 3] = "inverse";
})(Colors || (Colors = {}));
// Scales a canvas with context to look better on retina
function scaleForRetina(canvas, ctx) {
    ctx.scale(devicePixelRatio, devicePixelRatio);
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.height = window.innerHeight + 'px';
}
export function scaleCanvases(canvases) {
    canvases.forEach(({ canvas, ctx }) => {
        document.body.append(canvas);
        scaleForRetina(canvas, ctx);
    });
}
export function determineColor(selection, hue, saturation, lightness, opacity = 1) {
    if (selection === Colors.light) {
        return `hsl(0, 0%, 100%, ${opacity})`;
    }
    if (selection === Colors.dark) {
        return `hsl(0, 0%, 0%, ${opacity})`;
    }
    if (selection === Colors.match) {
        return `hsl(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
    }
    if (selection === Colors.inverse) {
        return `hsl(${360 - hue}, ${100 - saturation}%, ${100 - lightness}%, ${opacity})`;
    }
    return `hsl(0, 0%, 100%, 1)`;
}
export function makeRangeInput(control, name, min, max, step = 1, handler = (ev) => {
    const targetInput = ev.currentTarget;
    control.selected = Number(targetInput.value);
}) {
    const rangeInput = document.createElement('input');
    const label = document.createElement('label');
    const container = document.createElement('div');
    rangeInput.type = 'range';
    rangeInput.min = min.toString();
    rangeInput.max = max.toString();
    rangeInput.step = step.toString();
    rangeInput.value = control.selected.toString();
    rangeInput.oninput = handler;
    label.htmlFor = name;
    label.textContent = name;
    container.style.display = 'grid';
    container.append(label, rangeInput);
    return container;
}
