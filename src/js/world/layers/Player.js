import Colors from '../../settings/Colors'
import RenderLayer from '../RenderLayer'
import PlayerSprite from '../../sprites/PlayerSprite'
import TextSprite from '../../sprites/TextSprite'
import AmmoDropSprite from '../../sprites/enemies/AmmoDropSprite'
import KeyState from '../input/KeyState'
import { removeAll } from '../../utility/array'
import { distanceSquared } from '../../math/vector2'

export default class Player extends RenderLayer {
  constructor(name, layer) {
    super(name, layer);

    this.context.strokeStyle = Colors.player;
    this.context.fillStyle = Colors.player;
    this.context.lineWidth = 4;
    this.context.font = '64px serif';

    this.player = new PlayerSprite(this.canvas.width / 2, this.canvas.height / 2, 20);
    this.addObject(this.player);

    this.keys = new KeyState(window);

    this.bullets = [];
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
    this.addObject(bullet);
  }

  removeBullet(o) {
    removeAll(this.bullets, e => e === o);
    this.removeObject(o);
  }

  update(t) {
    const updated = super.update(t);
    // Check if player has exploded
    if (this.player.exploded) {
      this.parent.gameOver();
    }
    // Check for bullet collisions
    this.checkForBulletCollisions();
    // Check for enemy collisions
    this.checkForEnemyCollisions();
    return updated;
  }

  checkForBulletCollisions() {
    const enemies = this.getLayer('simulation').enemies;
    const dead = [];
    for (const b of this.bullets) {
      for (const e of enemies) {
        const collideAt = b.radius + e.radius;
        if (distanceSquared(b, e.center()) < (collideAt * collideAt)) {
          // Crash!
          dead.push(b);
          e.explode();
        }
      }
    }
    for (const d of dead) {
      this.removeBullet(d);
    }
  }

  checkForEnemyCollisions() {
    const enemies = this.getLayer('simulation').enemies;
    for (const e of enemies) {
      const collideAt = this.player.radius + e.radius;
      if (distanceSquared(this.player, e.center()) < (collideAt * collideAt)) {
        // Crash!
        if (e instanceof AmmoDropSprite) {
          e.absorb();
        } else {
          e.explode();
          this.player.explode();
          this.parent.gameOver();
        }
      }
    }
  }
}
