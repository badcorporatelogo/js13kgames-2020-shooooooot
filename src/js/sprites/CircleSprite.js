import Sprite from './Sprite'

const startAngle = 0, endAngle = 2 * Math.PI;

export default class CircleSprite extends Sprite {
  constructor(x, y, radius) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw() {
    const ctx = this.context;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, startAngle, endAngle);
    ctx.stroke();
  }
}
