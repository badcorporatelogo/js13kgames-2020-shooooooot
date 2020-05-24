import EnemySprite from './EnemySprite'
import Chain from '../../actions/Chain'
import { smoothStart3, smoothStop3 } from '../../math/easing'

const size = 26;
const speed = 2;
const maxRadius = 100;
const minRadius = 50;
const startAngle = 0, endAngle = 2 * Math.PI;

export default class SpiralSprite extends EnemySprite {
  constructor(x, y) {
    super(x, y, size / 2);
    x -= size / 2;
    y -= size / 2;
    this.x = x;
    this.y = y;
    this.spinX = x;
    this.spinY = y;
    this.width = size;
    this.height = size;
    this.spiralRadiusEase = 0;
    this.spiralAngleEase = 0;
    this.spiralAngle = Math.random() * 2 * Math.PI;
    this.spinDirection = Math.round(Math.random()) ? -1 : 1;
    const spiralGrowth = new Chain(1, smoothStart3, this, 'spiralRadiusEase', 1 + Math.random());
    const spiralShrink = new Chain(-1, smoothStop3, this, 'spiralRadiusEase', 1 + Math.random());
    this.addAction(spiralGrowth.then(spiralShrink).then(spiralGrowth));
  }

  center() {
    this._center.x = this.x + size/2;
    this._center.y = this.y + size/2;
    return this._center;
  }

  update(t) {
    this.spiralAngleEase += (this.spinDirection*t);
    let isDirty = super.update(t);

    // Move toward the player
    const player = this.getPlayer();
    if (player) {
      const playerPosition = player.center();
      const dx = playerPosition.x - this.spinX;
      const dy = playerPosition.y - this.spinY;
      if (Math.abs(dx) < speed && Math.abs(dy) < speed) {
        this.dx = 0;
        this.dy = 0;
      } else {
        const angle = Math.atan2(dy, dx);
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
      }
    }
    this.spinX += this.dx;
    this.spinY += this.dy;

    // Spin around "my location"
    const angle = this.spiralAngle + this.spiralAngleEase * 2 * Math.PI;
    const radius = (0.5 + this.spiralRadiusEase) * maxRadius;
    let x = this.spinX + Math.cos(angle) * radius;
    let y = this.spinY + Math.sin(angle) * radius;

    this.x = x //+ this.dx;
    this.y = y //+ this.dy;

    return isDirty || true;
  }

  draw() {
    const c = this;
    const ctx = this.context;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, startAngle, endAngle);
    ctx.stroke();
  }
}
