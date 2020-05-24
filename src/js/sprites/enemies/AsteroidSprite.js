import EnemySprite from './EnemySprite'

const size = 45;
const speed = 7;
const hitLimit = 3;

export default class AsteroidSprite extends EnemySprite {
  constructor(x, y) {
    super(x, y, size / 2);
    this.originalRadius = this.radius;
    this.width = size;
    this.height = size;
    const angle = this.angle = Math.random() * 2 * Math.PI;
    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;
    this.hits = 0;
  }

  getBoundaryBox() {
    return this.parent.getLayer('background').aabb();
  }

  setDirection(angle) {
    this.angle = angle;
    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;
  }

  update(t) {
    let isDirty = super.update(t);
    const limit = 40;
    let bounce = false;

    const canvas = this.context.canvas;
    const { left, right, top, bottom } = this.getBoundaryBox();
    const x = this.x;
    const y = this.y;
    const radius = this.radius;

    if (x - left < radius) {
      bounce = true;
      this.x = (left + radius) + (left + radius) - x;
      this.dx = -this.dx;
    } else if (right - x < radius) {
      bounce = true;
      this.x = (right - radius) + (right - radius) - x;
      this.dx = -this.dx;
    } else if (y - top < radius) {
      bounce = true;
      const beyond = (top + radius) - y;
      this.y = (top + radius) + (top + radius) - y;
      this.dy = -this.dy;
    } else if (bottom - y < radius) {
      bounce = true;
      const beyond = y - (bottom - radius);
      this.y = (bottom - radius) + (bottom - radius) - y;
      this.dy = -this.dy;
    }
    if (bounce) {
      this.angle = Math.atan2(this.dy, this.dx);
    }
    return isDirty;
  }

  draw() {
    const ctx = this.context;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fill();
  }

  explode() {
    ++this.hits;
    this.radius = this.originalRadius * (hitLimit)/(hitLimit+this.hits);
    if (this.hits >= hitLimit) {
      super.explode();
    }
  }
}
