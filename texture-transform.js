const texture1 = new Image();
texture1.src = './models/earth/textures/TERRE_baseColor.jpeg';

const texture2 = new Image();
texture2.src = './models/earth-2/textures/Surface.mat_baseColor.jpeg';

const renderer = document.createElement('canvas');
document.body.appendChild(renderer);
const ctx = renderer.getContext('2d');

const offscreenRenderer = document.createElement('canvas');
const ctxOffscreen = renderer.getContext('2d');

let loaded = 0;

texture1.onload = () => {
    loaded++;
    start();
}

texture2.onload = () => {
    loaded++;
    start();
}

function start() {
    if (loaded < 2) {
        return;
    }
    console.log("Maintenant c'est parti");
    const width = renderer.width = texture1.width;
    const height = renderer.height = texture1.height;

    ctxOffscreen.drawImage(texture2, 0, 0);
    const pixels2 = ctxOffscreen.getImageData(0, 0, width, height);
    ctxOffscreen.drawImage(texture1, 0, 0);
    const pixels1 = ctxOffscreen.getImageData(0, 0, width, height);


    for (let x = 0 ; x < width ; x++) {
        for (let y = 0 ; y < height ; y++) {
            const offset = 4 * (x * height + y);
            const alpha = Math.sqrt((pixels2.data[offset] * pixels2.data[offset] + pixels2.data[offset + 1] * pixels2.data[offset + 1] + pixels2.data[offset + 2] * pixels2.data[offset + 2])) / 256; 
            const alpha2 = 1 - alpha;
            pixels1.data[offset] = pixels1.data[offset] * alpha2 + pixels2.data[offset] * alpha;
            pixels1.data[offset + 1] = pixels1.data[offset + 1] * alpha2 + pixels2.data[offset + 1] * alpha;
            pixels1.data[offset + 2] = pixels1.data[offset + 2] * alpha2 + pixels2.data[offset + 2] * alpha;
        }
    }

    ctx.putImageData(pixels1, 0, 0);
}