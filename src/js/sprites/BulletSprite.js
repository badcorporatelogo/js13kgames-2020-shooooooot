import CircleSprite from './CircleSprite'

const startAngle = 0, endAngle = 2 * Math.PI;

export default class BulletSprite extends CircleSprite {
  constructor(x, y, radius) {
    super(x, y, radius);
  }

  update(t) {
    // If the bullet is out of bounds, remove it.
    if (this.x < 0 || this.y < 0 || this.x > this.parent.canvas.width || this.y > this.parent.canvas.height) {
      this.parent.removeBullet(this);
      return true;
    }
    return super.update(t);
  }
}
