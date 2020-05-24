import Sprite from './Sprite'

// Number of particles
const min = 15;
const max = 25;
const size = 5;
const minTTL = 0.33;
const maxTTL = 1.0;
const minSpeed = 8;
const maxSpeed = 20;

export default class ParticleBlastSprite extends Sprite {
  constructor(x, y, innerRadius, outerRadius) {
    super();
    const n = Math.floor(Math.random() * (1 + max - min)) + min;
    this.particles = new Array(n);
    const diameter = innerRadius + innerRadius;
    const left = x - innerRadius;
    const top = y - innerRadius;
    for (let i = 0; i < n; ++i) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
      this.particles[i] = {
        x: Math.floor(Math.random() * diameter) + left,
        y: Math.floor(Math.random() * diameter) + top,
        angle: angle,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        ttl: Math.random() * (maxTTL - minTTL) + minTTL,
      };
    }
  }

  update(t) {
    let anyAlive = false;
    for (const p of this.particles) {
      p.x += p.dx;
      p.y += p.dy;
      p.ttl -= t;
      anyAlive = (p.ttl >=0) || anyAlive;
    }
    if (!anyAlive) {
      this.parent.removeObject(this);
    }
    return true;
  }

  draw() {
    for (const p of this.particles) {
      if (p.ttl >= 0) {
        this.context.fillRect(p.x, p.y, size, size);
      }
    }
  }
}
