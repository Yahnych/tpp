
import SimpleBuffer from "./gener/buffer";
import { randColor } from "./utils";

function calcSizeMap() {
    let mapWidth = 36;
    let mapHeight = 20;
    mapWidth += 1 + 1; // for board;
    mapHeight += 1 + 1 + 1; // for board and UI
    return { mapWidth, mapHeight };
}

// Size of map 36x20
function calcSizeForCanvas(width, height) {
    const { mapWidth, mapHeight } = calcSizeMap();
    const aspect = width / height;
    const mapAspect = mapWidth / mapHeight;

    if (mapAspect > aspect) {
        return { width, height: width / mapAspect };
    }
    return { width: height * mapAspect, height };
}

function main() {
    console.assert = (condition, message = "Assertion failed") => {
        if (!condition) {
            console.log(message);
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    };

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const { width, height } = calcSizeForCanvas(window.innerWidth - 40, window.innerHeight - 40);
    canvas.width = width;
    canvas.height = height;

    // const ground = new SimpleBuffer(512);
    // const groundImg = ground
    //     .perlin(5, 0.5)
    //     .diff([1, 0.5])
    //     .normalize(0.75, 1)
    //     .getColor(randColor([224, 207, 159], 20));

    const buffer = new SimpleBuffer(512);
    const image = buffer
        // .perlin(5, 0.5)
        // // .normalize(0, 50)
        // .forEach((val) => 1 / (val * val + 1))
        // // .diffFree()
        // .diff([1, 0.5])
        // // .diff([-0.5, 1])
        .brick(10, 20)
        .normalize(0.75, 1)
        .getColor(randColor([160, 54, 35], 10));
    context.drawImage(image, 100, 100);
    context.drawImage(image, 100 + image.width, 100);
}
window.addEventListener("load", main);
