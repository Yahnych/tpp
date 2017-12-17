
import Bullet from "./bullet";
import { BULLET } from "./global";

export default class Weapon {
    constructor(owner, type) {
        this.owner = owner;
        this.setType(type);
    }
    setType(type) {
        this.type = type;
        this.count = this.type === BULLET.DOUBLE || this.type === BULLET.POWER ? 2 : 1;
    }
    shoot() {
        if (this.count) {
            this.count--;
            return new Bullet(this.owner, this.type, () => this.count++);
        }
        return null;
    }
}
