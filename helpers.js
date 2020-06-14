export var Colors;
(function (Colors) {
    Colors[Colors["light"] = 0] = "light";
    Colors[Colors["dark"] = 1] = "dark";
    Colors[Colors["match"] = 2] = "match";
    Colors[Colors["inverse"] = 3] = "inverse";
})(Colors || (Colors = {}));
// Scales a canvas with context to look better on retina
function scaleForRetina(canvas, ctx) {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
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
}
