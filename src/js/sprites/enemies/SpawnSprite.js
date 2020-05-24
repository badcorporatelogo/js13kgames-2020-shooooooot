import Sprite from '../Sprite'
import Chain from '../../actions/Chain'
import { smoothStop4 } from '../../math/easing'

// Number of particles
const min = 15;
const max = 25;
const size = 8;
const maxDistance = 300;
const duration = 1;

export default class SpawnSprite extends Sprite {
  constructor(x, y, enemy) {
    super();
    this.x = x + enemy.radius;
    this.y = y + enemy.radius;
    this.enemy = enemy;
    const n = Math.floor(Math.random() * (1 + max - min)) + min;
    this.particles = new Array(n);
    for (let i = 0; i < n; ++i) {
      const angle = Math.random() * Math.PI * 2;
      this.particles[i] = {
        length: Math.floor(Math.random() * maxDistance),
        angle: angle,
      };
    }
    this.duration = duration;
    this.factor = 0;
    this.countDown = new Chain(1, smoothStop4, this, 'factor', duration);
    this.addAction(this.countDown);
  }

  update(t) {
    let updated = super.update(t);
    for (const p of this.particles) {
      p.x = Math.cos(p.angle) * p.length * (1 - this.factor) + this.x;
      p.y = Math.sin(p.angle) * p.length * (1 - this.factor) + this.y;
    }
    if (this.factor >= 1) {
      this.parent.addEnemy(this.enemy);
      this.parent.removeObject(this);
    }
    return updated;
  }

  draw() {
    for (const p of this.particles) {
        this.context.fillRect(p.x, p.y, size, size);
    }
  }
}
