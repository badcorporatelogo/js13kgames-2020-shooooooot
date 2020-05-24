import EnemySprite from './EnemySprite'
import Chain from '../../actions/Chain'
import { smoothStart4 } from '../../math/easing'
import Colors from '../../settings/Colors'
import zzfxInit from '../../sound/ZzFx'

const size = 30;
const baseSpeed = 0.5;

let zzfx;

export default class AmmoDropSprite extends EnemySprite {
  constructor(x, y) {
    super(x, y, size / 2);
    this.pointValue = 0;
    this.acceleration = 1;
    this.addAction(new Chain(1, smoothStart4, this, 'acceleration', 2.5));
    if (!zzfx) {
      zzfx = zzfxInit();
    }
  }

  update(t) {
    const player = this.getPlayer();
    const speed = baseSpeed * this.acceleration;
    if (player) {
      const playerPosition = player.center();
      const myPosition = this.center();

      const dx = playerPosition.x - myPosition.x;
      const dy = playerPosition.y - myPosition.y;

      const angle = Math.atan2(dy, dx) + Math.PI;
      this.dx = Math.cos(angle) * speed;
      this.dy = Math.sin(angle) * speed;
    }

    return super.update(t) || true;
  }

  draw() {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = Colors.obstacles;
    ctx.strokeStyle = Colors.background;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x - this.radius/2, this.y);
    ctx.lineTo(this.x + this.radius/2, this.y);
    ctx.moveTo(this.x, this.y - this.radius/2);
    ctx.lineTo(this.x, this.y + this.radius/2);

    ctx.stroke();
    ctx.restore();
  }

  absorb() {
    if (!this.exploded) {
      this.pointValue = 50;
      this.incrementScore();
      this.incrementAmmo();
      this.parent.removeEnemy(this);

      zzfx(1,.05,1719,0,.09,.11,1,1.14,0,0,992,.08,.02,.1,0,0,0,.7,.01,0); // Pickup 110
    }
    this.exploded = true;
  }

  incrementAmmo() {
    const player = this.getPlayer();
    if (!player.exploded) {
      this.getHud().addAmmo(this.pointValue);
    }
  }

}
