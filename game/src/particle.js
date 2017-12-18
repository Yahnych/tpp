
import { Entity, EntityManager } from "./entity";
import { PART } from "./global";
import { rand } from "./utils";

class Particle {
    constructor(cx, cy, type) {
        this.entity = new Entity(cx, cy, 0.5, Math.random() * 2 * Math.PI, rand(1, 0.5));
        this.type = type;
        this.creationTime = Date.now();
        this.alive = true;
        this.random = Math.random();
        this.lifetime = 250;

        if (type === PART.FIRE) this.entity.size = 2;
        if (type === PART.BRICK) {
            this.entity.cx += rand(0, 0.5);
            this.entity.cy += rand(0, 0.5);
            this.lifetime += rand(0, 100);
            this.maxvel = this.entity.vel;
        }
    }
    clear(level) {
        level.clearEntity(this.entity);
    }
    draw(level) {
        const dt = Date.now() - this.creationTime;
        if (dt >= this.lifetime) {
            this.alive = false;
            if (this.type === PART.BRICK) level.drawEntityToAllLayers(this.entity, level.textures.sparksBrick);
        }
        else {
            switch (this.type) {
            case PART.SPARK: {
                const ind = dt / this.lifetime * level.textures.sparksBullet.length | 0;
                level.drawEntity(this.entity, level.textures.sparksBullet[ind]);
                break;
            }
            case PART.FIRE: {
                const id = this.random * level.textures.sparksFire.length | 0;
                const ind = dt / this.lifetime * level.textures.sparksFire[id].length | 0;
                level.drawEntity(this.entity, level.textures.sparksFire[id][ind]);
                break;
            }
            case PART.BRICK: {
                this.entity.vel = this.maxvel * (1 - dt / this.lifetime);
                level.drawEntity(this.entity, level.textures.sparksBrick);
                break;
            }
            }
        }
    }
    update(level, delta) {
        if (this.type !== PART.FIRE) {
            this.entity.moveEx(delta);
        }
    }
}

export default class ParticleManager extends EntityManager {
    emit(cx, cy, type) {
        const count = type === PART.FIRE ? 1 : 5;
        for (let i = 0; i < count; i++) {
            this.objects.push(new Particle(cx, cy, type));
        }
    }
}
