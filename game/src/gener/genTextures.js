
import SimpleBuffer from "./buffer";
import { randColor, clamp } from "../utils";
import { TANK } from "../tank";

export default class GenTextures {
    constructor(tileSize) {
        // ground
        const ground = new SimpleBuffer(tileSize * 8);
        this.ground = ground
            .perlin(5, 0.9)
            .normalize(0.7, 1)
            .getColor(randColor([150, 133, 84], 20));

        // brick
        const cement = new SimpleBuffer(tileSize * 8);
        const cementImg = cement
            .perlin(5, 0.5)
            .diff([1, 0.5])
            .diff([-0.5, 1])
            .normalize(0, 1)
            .getColor(randColor([100, 100, 100]));

        const noise = new SimpleBuffer(tileSize * 8);
        noise
            .perlin(5, 0.5)
            .diff([1, 0.5])
            .normalize(0.7, 1.3);

        const brick = new SimpleBuffer(tileSize * 8);
        const brickImg = brick
            .brick(8, 16)
            .normalize(0.7, 1)
            .forBuf(noise, (a, b) => a * b)
            .getColor(randColor([200, 80, 60]));

        const brickMask = new SimpleBuffer(tileSize * 8);
        this.brick = brickMask
            .brickMask(8, 16)
            .gaussian(3)
            .clamp(0.1, 0.3)
            .normalize(0, 1)
            .getColorLerp(brickImg, cementImg);

        // beton
        const betonNoise = new SimpleBuffer(tileSize * 8);
        betonNoise
            .perlin(5, 0.5)
            .forEach((a) => a * a)
            .diffFree()
            .normalize(0.6, 1);

        const beton = new SimpleBuffer(tileSize * 8);
        const betonImg = beton
            .brick(4, 4)
            .normalize(0.7, 1)
            .forBuf(betonNoise, (a, b) => a * b)
            .getColor(randColor([160, 160, 160]));

        const betonMask = new SimpleBuffer(tileSize * 8);
        this.beton = betonMask
            .brickMask(4, 4)
            .gaussian(3)
            .clamp(0.1, 0.3)
            .normalize(0, 1)
            .getColorLerp(betonImg, cementImg);

        // lava
        const lava = new SimpleBuffer(tileSize * 8);
        this.lava = lava
            .perlin(10, 0.5)
            .normalize(0, 30)
            .forEach(Math.cos)
            .normalize(0.5, 1)
            .getColor2(randColor([255, 0, 0]), randColor([255, 255, 0]));

        this.lavaMask = new Array(8);
        this.lavaLightMask = new Array(8);
        for (let i = 0; i < this.lavaMask.length; i++) {
            const lavaNoise = new SimpleBuffer(tileSize * 2);
            lavaNoise.perlin(5, 0.5);

            const lavaMask = new SimpleBuffer(tileSize * 2);
            this.lavaMask[i] = lavaMask
                .normSquare(0.4, 0.5)
                .normalize(0, 1)
                .forBuf(lavaNoise, (a, b) => a + 0.25 * b)
                .clamp(0.4, 0.6)
                .normalize(0, 1)
                .getColor([255, 255, 255], lavaMask);

            const lavaLightMask = new SimpleBuffer(tileSize * 2);
            this.lavaLightMask[i] = lavaLightMask
                .normSquare(0.4, 0.5)
                .normalize(0, 1.5)
                .forBuf(lavaNoise, (a, b) => a + 0.25 * b)
                .clamp(0.25, 0.75)
                .gaussian(7)
                .normalize(0, 1)
                .getColor([127, 127, 127], lavaLightMask);
        }

        // grass
        const grass = new SimpleBuffer(tileSize * 8);
        this.grass = grass
            .perlin(5, 0.5)
            .diffFree()
            .normalize(0.7, 1.3)
            .getColor(randColor([49, 107, 54]));

        this.grassMask = new Array(8);
        for (let i = 0; i < this.grassMask.length; i++) {
            const normDist = new SimpleBuffer(tileSize * 2);
            normDist
                .normDist(1.25)
                .normalize(0, 3)
                .clamp(0, 1);

            const grassMask = new SimpleBuffer(tileSize * 2);
            this.grassMask[i] = grassMask
                .perlin(20, 0.9)
                .normalize(0, 1)
                .forBuf(normDist, (a, b) => a * b)
                .clamp(0.2, 0.5)
                .normalize(0, 1)
                .getColor(randColor([255, 255, 255]), grassMask);
        }

        // board
        const boardMask = new SimpleBuffer(tileSize);
        boardMask
            .forEach(() => 1)
            .bresenham(0, 0, boardMask.size - 1, 0, 0)
            .bresenham(0, boardMask.size - 1, boardMask.size - 1, boardMask.size - 1, 0)
            .bresenham(0, 0, 0, boardMask.size - 1, 0)
            .bresenham(boardMask.size - 1, 0, boardMask.size - 1, boardMask.size - 1, 0)
            .gaussian(2);

        const board = new SimpleBuffer(tileSize);
        this.board = board
            .perlin(2, 0.5)
            .normalize(0.7, 1)
            .forBuf(boardMask, (a, b) => a * b)
            .getColor(randColor([188, 198, 204]));

        // Eagle
        const eagle = new SimpleBuffer(tileSize * 2);
        const center = eagle.size * 0.5 | 0;
        const step = eagle.size * 0.1 | 0;
        eagle
            .bresenham(center, center + step, 2 * step, 2 * step, 1)
            .bresenham(center, center + step, eagle.size - 2 * step, 2 * step, 1)
            .bresenham(center, step, center, eagle.size - step, 1)
            .bresenham(center - 2 * step, center + 2 * step, 3 * step, 3 * step, 1)
            .bresenham(center + 2 * step, center + 2 * step, eagle.size - 3 * step, 3 * step, 1)
            .bresenham(center - 2 * step, center + 2 * step, center, center, 1)
            .bresenham(center + 2 * step, center + 2 * step, center, center, 1)
            .gaussian(step)
            .normalize(0, 1)
            .bresenham(center, eagle.size - 2 * step, center - 2 * step, eagle.size - step, 1.5)
            .bresenham(center, eagle.size - 2 * step, center + 2 * step, eagle.size - step, 1.5)
            .bresenham(center - step, step, center, step, 1)
            .bresenham(center, step * 1.5 | 0, center + step * 1.5 | 0, step * 1.5 | 0, 1)
            .bresenham(step * 2, step * 2, step, step, 1.5)
            .bresenham(eagle.size - step * 2, step * 2, eagle.size - step, step, 1.5)
            .bresenham(3 * step, 3 * step, step, 3 * step, 1)
            .bresenham(eagle.size - 3 * step, 3 * step, eagle.size - step, 3 * step, 1)
            .bresenham(4 * step, 4 * step, step, 4 * step, 1)
            .bresenham(eagle.size - 4 * step, 4 * step, eagle.size - step, 4 * step, 1)
            .gaussian(step)
            .normalize(0, 1);

        const eagleMask = new SimpleBuffer(eagle.size);
        eagleMask
            .copy(eagle)
            .clamp(0.1, 0.2)
            .normalize(0, 1);

        const eagleColor = new SimpleBuffer(eagle.size);
        this.eagle = eagleColor
            .forEach(() => 1)
            .bresenham(center, step, center, step, 0)
            .gaussian(step)
            .normalize(0, 1)
            .clamp(0.2, 0.25)
            .normalize(0, 1)
            .forBuf(eagleMask, (a, b) => a * (5 * (Math.abs(b - 0.5) - 0.5) + 1))
            .forBuf(eagle, (a, b) => a + b * 0.5)
            .getColor2([0, 0, 0], [128, 128, 128], eagleMask);

        // Bridge
        this.bridge = new Array(8);
        for (let k = 0; k < this.bridge.length; k++) {
            const bridgeMask = new SimpleBuffer(tileSize * 2);
            bridgeMask
                .perlin(5, 0.5)
                .forEach((a, i, j) => {
                    const x = (i / bridgeMask.size - 0.5) * 2;
                    const y = (j / bridgeMask.size - 0.5) * 2;
                    const factorX = Math.abs(x) < 0.4 ? 1 : 0;
                    let factorY = clamp((2 - 2 * Math.abs(y)), 0, 1);
                    factorY += 0.25 * a;
                    factorY = (clamp(factorY, 0.3, 0.4) - 0.3) * 10;
                    return factorX * factorY;
                });

            const bridge = new SimpleBuffer(tileSize * 2);
            this.bridge[k] = bridge
                .perlin(5, 0.5)
                .forEach((a) => a * a)
                .diffFree()
                .normalize(0.5, 1.5)
                .forEach((a, i) => {
                    const x = i / bridge.size * Math.PI * 8;
                    return a * Math.abs(Math.cos(x));
                })
                .forBuf(bridgeMask, (a, b) => a * b * b)
                .normalize(0.5, 1)
                .getColor([182, 155, 76], bridgeMask);
        }

        const rotateImage = (image, angle) => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;

            context.save();

            context.translate(image.width * 0.5, image.height * 0.5);
            context.rotate(Math.PI * 0.5 * angle);
            context.translate(-image.width * 0.5, -image.height * 0.5);
            context.drawImage(image, 0, 0);

            context.restore();
            return canvas;
        };

        // Tanks
        const createTrack = (size, offset, isWheel) => {
            const trackMask = new SimpleBuffer(tileSize * 2);
            trackMask
                .forEach((a, i, j) => {
                    const x = (i / trackMask.size - 0.5) * 2;
                    const y = (j / trackMask.size - 0.5) * 2;
                    let factorX = Math.abs(x) < size ? 1 : 0;
                    factorX *= Math.abs(x) < 0.5 ? 0 : 1;
                    let factorY = Math.abs(y) < size ? 1 : 0;
                    let wheel = j / trackMask.size * Math.PI * 3;
                    wheel = Math.abs(Math.sin(wheel));
                    wheel = wheel < 0.5 && isWheel ? 0 : 1;
                    factorY *= wheel;
                    return factorX * factorY;
                });

            const track = new SimpleBuffer(tileSize * 2);
            return track
                .forEach((a, i, j) => {
                    const y = j / track.size * Math.PI * 10;
                    return Math.abs(Math.cos(y + Math.PI * offset));
                })
                .normalize(0.5, 1)
                .getColor(isWheel ? [80, 80, 80] : [160, 160, 160], trackMask);
        };
        const smoothedSquare = (buffer, width, height) => {
            buffer
                .forEach((a, i, j) => {
                    const x = (i / buffer.size - 0.5) * 2;
                    const y = (j / buffer.size - 0.5) * 2;
                    const factorX = Math.abs(x) < width ? 1 : 0;
                    const factorY = Math.abs(y) < height ? 1 : 0;
                    return factorX * factorY;
                })
                .gaussian(step);
            return buffer;
        };
        const createCorpus = (size, color, width = 0.6) => {
            const corpusMask = new SimpleBuffer(tileSize * 2);
            smoothedSquare(corpusMask, width, size)
                .clamp(0.5, 0.6)
                .normalize(0, 1);

            const corpus = new SimpleBuffer(tileSize * 2);
            return corpus
                .brick(10, 10)
                .diff([1, 0.5])
                .normalize(0, 1)
                .forEach((a, i, j) => {
                    const y = (j / corpus.size - 0.5) * 2;
                    if (Math.abs(y) < size * 0.5) return a;
                    const k = clamp((size - Math.abs(y)) / (size * 0.5), 0, 1);
                    return a * Math.sqrt(k);
                })
                .normalize(0.25, 1)
                .getColor(color, corpusMask);
        };
        const createTurret = (size, barrelWidth, barrelLength, color) => {
            const barrelMask = new SimpleBuffer(tileSize * 2);
            smoothedSquare(barrelMask, barrelWidth, barrelLength)
                .clamp(0.5, 0.6)
                .normalize(0, 1)
                .forEach((a, i, j) => (j < barrelMask.size * 0.5 ? a : 0));

            const barrel = new SimpleBuffer(tileSize * 2);
            const barrelImg = smoothedSquare(barrel, barrelWidth, barrelLength)
                .diff([1, 0.5])
                .normalize(0.25, 1)
                .getColor([220, 220, 220], barrelMask);

            const turretMask = new SimpleBuffer(tileSize * 2);
            smoothedSquare(turretMask, size, size)
                .clamp(0.5, 0.6)
                .normalize(0, 1);

            const turret = new SimpleBuffer(tileSize * 2);
            const turretImg = smoothedSquare(turret, size, size)
                .diff([1, 0.5])
                .normalize(0.25, 1)
                .getColor(color, turretMask);

            const ctx = barrelImg.getContext("2d");
            ctx.drawImage(turretImg, 0, 0);
            return barrelImg;
        };

        /* eslint-disable key-spacing */
        const colors = {
            [TANK.TANK1]:   [200, 150, 100],
            [TANK.TANK2]:   [100, 150, 200],
            [TANK.SIMPLE]:  [120, 200, 120],
            [TANK.BMP]:     [200, 200, 200],
            [TANK.CANNON]:  [250, 230, 134],
            [TANK.STRONG]:  [100, 200, 180],
            [TANK.PANZER]:  [211, 229, 224],
        };

        this.tankBodies = new Array(4);
        this.tankTurret = new Array(4);
        this.tankTrack = new Array(4);

        this.tankBodies[0] = {
            [TANK.TANK1]:   createCorpus(0.7, colors[TANK.TANK1]),
            [TANK.TANK2]:   createCorpus(0.7, colors[TANK.TANK2]),
            [TANK.SIMPLE]:  createCorpus(0.5, colors[TANK.SIMPLE]),
            [TANK.BMP]:     createCorpus(0.7, colors[TANK.BMP], 0.5),
            [TANK.CANNON]:  createCorpus(0.5, colors[TANK.CANNON]),
            [TANK.STRONG]:  createCorpus(0.75, colors[TANK.STRONG]),
            [TANK.PANZER]:  createCorpus(1, colors[TANK.PANZER]),
        };

        this.tankTurret[0] = {
            [TANK.TANK1]:   createTurret(0.35, 0.1, 0.7, colors[TANK.TANK1]),
            [TANK.TANK2]:   createTurret(0.35, 0.1, 0.7, colors[TANK.TANK2]),
            [TANK.SIMPLE]:  createTurret(0.35, 0.1, 0.7, colors[TANK.SIMPLE]),
            [TANK.BMP]:     createTurret(0.2, 0.1, 0.6, colors[TANK.BMP]),
            [TANK.CANNON]:  createTurret(0.35, 0.1, 1, colors[TANK.CANNON]),
            [TANK.STRONG]:  createTurret(0.35, 0.1, 0.7, colors[TANK.STRONG]),
            [TANK.PANZER]:  createTurret(0.5, 0.2, 1, colors[TANK.PANZER]),
        };

        const countAnimTrack = 8;
        const trackSimple = new Array(countAnimTrack);
        const trackBMP = new Array(countAnimTrack);
        const trackPanzer = new Array(countAnimTrack);

        for (let offset = 0; offset < countAnimTrack; offset++) {
            trackSimple[offset] = createTrack(0.8, offset / countAnimTrack, false);
            trackBMP[offset] = createTrack(0.8, offset / countAnimTrack, true);
            trackPanzer[offset] = createTrack(1, offset / countAnimTrack, false);
        }

        this.tankTrack[0] = {
            [TANK.TANK1]:   trackSimple,
            [TANK.TANK2]:   trackSimple,
            [TANK.SIMPLE]:  trackSimple,
            [TANK.BMP]:     trackBMP,
            [TANK.CANNON]:  trackSimple,
            [TANK.STRONG]:  trackSimple,
            [TANK.PANZER]:  trackPanzer,
        };
        /* eslint-enable key-spacing */

        for (let i = 1; i < 4; i++) {
            this.tankBodies[i] = {};
            this.tankTurret[i] = {};
            this.tankTrack[i] = {};

            for (let type = TANK.TANK1; type <= TANK.PANZER; type++) {
                this.tankBodies[i][TANK[type]] = rotateImage(this.tankBodies[0][TANK[type]], i);
                this.tankTurret[i][TANK[type]] = rotateImage(this.tankTurret[0][TANK[type]], i);
                this.tankTrack[i][TANK[type]] = new Array(countAnimTrack);
                for (let offset = 0; offset < countAnimTrack; offset++) {
                    this.tankTrack[i][TANK[type]][offset] = rotateImage(this.tankTrack[0][TANK[type]][offset], i);
                }
            }
        }

        // bullet
        const bulletMask = new SimpleBuffer(tileSize);
        bulletMask
            .normDist(1)
            .clamp(0.1, 0.2)
            .normalize(0, 1);

        const bullet = new SimpleBuffer(tileSize);
        this.bullet = bullet
            .normDist(1)
            .diff([1, 0.5])
            .normalize(0.5, 1)
            .forBuf(bulletMask, (a, b) => a * (5 * (Math.abs(b - 0.5) - 0.5) + 1))
            .getColor([255, 255, 255], bulletMask);

        // fire
        const createFire = (size) => {
            const koef = tileSize / size;
            const plume = new SimpleBuffer(size);
            for (let i = 0; i < size * 0.75 | 0; i++) {
                const plumeStep = new SimpleBuffer(size);
                plumeStep.normDist(koef * 0.75 - koef * 0.75 * i / (size * 0.75),
                    0, 0.5 - 2 * i / size);
                plume.forBuf(plumeStep, (a, b) => a + b);
            }
            plume.normalize(0, 1);

            const fire = new SimpleBuffer(size);
            return fire
                .normDist(koef, 0, 0.5)
                .clamp(0.1, 0.5)
                .normalize(0, 1)
                .forBuf(plume, (a, b) => a + b)
                .normalize(0, 2)
                .getColor2([255, 0, 0], [255, 255, 127], fire);
        };

        this.fireLong = createFire(tileSize * 2);
        this.fireSmall = createFire(tileSize);
    }
}
