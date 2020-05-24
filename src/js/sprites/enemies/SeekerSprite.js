import EnemySprite from './EnemySprite'
import Chain from '../../actions/Chain'
import { smoothStart5 } from '../../math/easing'

const size = 30;
const baseSpeed = 3;

export default class SeekerSprite extends EnemySprite {
  constructor(x, y) {
    super(x, y, size / 2);
    x -= size / 2;
    y -= size / 2;
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.acceleration = 1;
    this.addAction(new Chain(0.75, smoothStart5, this, 'acceleration', 2.5));
  }

  center() {
    this._center.x = this.x + size/2;
    this._center.y = this.y + size/2;
    return this._center;
  }

  update(t) {
    const player = this.getPlayer();
    const speed = baseSpeed * this.acceleration;
    if (player) {
      const playerPosition = player.center();
      const myPosition = this.center();

      const dx = playerPosition.x - myPosition.x;
      const dy = playerPosition.y - myPosition.y;
      if (Math.abs(dx) < speed && Math.abs(dy) < speed) {
        this.dx = 0;
        this.dy = 0;
      } else {
        const angle = Math.atan2(dy, dx);
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
      }
    }

    return super.update(t);
  }

  draw() {
    this.context.strokeRect(this.x, this.y, this.width, this.height);
  }
}
