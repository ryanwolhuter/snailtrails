export var Colors;
(function (Colors) {
    Colors[Colors["light"] = 0] = "light";
    Colors[Colors["dark"] = 1] = "dark";
    Colors[Colors["match"] = 2] = "match";
    Colors[Colors["inverse"] = 3] = "inverse";
})(Colors || (Colors = {}));
export function determineColor(selection, hue = 0, saturation = 100, lightness = 50, opacity = 1) {
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
