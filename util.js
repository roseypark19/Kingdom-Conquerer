const PARAMS = {
    BLOCKWIDTH : 8,
    DEBUG : false,
    DEBUG_WIDTH : 1,
    DEBUG_COLOR: "Red",
    CANVAS_DIMENSION : 900,
    SCALE : 4,
    MMAP_SCALE: 0.5,
    GAMEOVER: false,
    LIFE_ID: 0,
    SHOT_ID: 0,
    LOW_HP_COLOR: "Red",
    MED_HP_COLOR: "Orange",
    HIGH_HP_COLOR: "Green"
};


// returns a random integer between 0 and n-1
function randomInt(n) {
    return Math.floor(Math.random() * n);
};

// returns a string that can be used as a rgb web color
function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
};

// returns a string that can be used as a hsl web color
function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
};

function distance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
};

function magnitude(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
};

function unitVector(vector) {
    return {x: vector.x / magnitude(vector), y: vector.y / magnitude(vector)};
};

function oscillate(input, min, max) {
    let range = max - min;
    return min + Math.abs(((input + range) % (range * 2)) - range);
};

function toDegrees(radians) {
    return radians * 180 / Math.PI;
};

function toRadians(degrees) {
    return degrees * Math.PI / 180;
};

function nearestRightAngle(degrees) {
    let rounded = Math.round(degrees);
    let low = Math.max(0, rounded - rounded % 90);
    let high = Math.min(360, rounded + 90 - rounded % 90);
    return Math.abs(rounded - low) < Math.abs(rounded - high) ? low : high;
};

function rotateImage(spritesheet, xStart, yStart, width, height, theta) {
    let offscreenCanvas = document.createElement('canvas');
    let dimension = Math.max(width, height);
    offscreenCanvas.width = dimension;
    offscreenCanvas.height = dimension;
    let offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.imageSmoothingEnabled = false;
    offscreenCtx.save();
    offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
    offscreenCtx.rotate(theta);
    offscreenCtx.translate(-offscreenCanvas.width / 2, -offscreenCanvas.height / 2);
    offscreenCtx.drawImage(spritesheet, xStart, yStart, width, height, 
                           width < dimension ? (dimension - width) / 2 : 0, 
                           height < dimension ? (dimension - height) / 2 : 0, width, height);
    offscreenCtx.restore();
    return offscreenCanvas;
};

function mMapDimension() {
    return PARAMS.CANVAS_DIMENSION / 4.5;
};

function mMapCanvasDimension() {
    return mMapDimension() * 21 / 25;
};

// creates an alias for requestAnimationFrame for backwards compatibility
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();







