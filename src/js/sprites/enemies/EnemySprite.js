import Sprite from '../Sprite'
import ParticleBlastSprite from '../ParticleBlastSprite'
import { removeAll } from '../../utility/array'
import zzfxInit from '../../sound/ZzFx'

const size = 30;
const speed = 3;

let zzfx;

export default class EnemySprite extends Sprite {
  constructor(x, y, radius) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this._center = { x, y };
    this.pointValue = 10;
    // this.parent set by layer
    // this.exploded set when exploded
    if (!zzfx) {
      zzfx = zzfxInit();
    }
  }

  center() {
    this._center.x = this.x;
    this._center.y = this.y;
    return this._center;
  }

  explode() {
    if (!this.exploded) {
      this.parent.addObject(new ParticleBlastSprite(this.x, this.y, this.radius, this.radius * 5));
      this.incrementScore();
      this.parent.removeEnemy(this);

      zzfx(1,.05,240,0,.1,.43,2,1.29,3.2,0,0,0,0,1.7,.5,.5,.1,.55,.08,.27); // Hit 93
    }
    this.exploded = true;
  }

  incrementScore() {
    const player = this.getPlayer();
    if (!player.exploded) {
      this.getHud().addScore(this.pointValue);
    }
  }

  getPlayer() {
    return this.getLayer('player').player;
  }

  getHud() {
    return this.getLayer('hud');
  }
}
