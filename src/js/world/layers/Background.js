import Colors from '../../settings/Colors'
import RenderLayer from '../RenderLayer'
import BoxSprite from '../../sprites/BoxSprite'

const width = 6;
const halfWidth = width / 2;

export default class Background extends RenderLayer {
  constructor(name, layer) {
    super(name, layer);

    this.context.strokeStyle = Colors.obstacles;
    this.context.fillStyle = Colors.obstacles;
    this.context.lineWidth = width;

    this.addObject(new BoxSprite(halfWidth, halfWidth, this.canvas.width - width, this.canvas.height - width));
  }

  update(t) {
    this.checkForBoundaryCollisions();
    return super.update(t);
  }

  checkForBoundaryCollisions() {
    const enemies = this.getLayer('simulation').enemies;
    const player = this.getLayer('player').player;

    if (this.collidesWithBoundary(player)) {
      player.explode();
    }
    for (const e of enemies) {
      if (this.collidesWithBoundary(e)) {
        e.explode();
      }
    }
  }

  aabb() {
    return {
      left: halfWidth,
      top: halfWidth,
      right: this.canvas.width - width,
      bottom: this.canvas.height - width,
    };
  }

  collidesWithBoundary(s) {
    const left = halfWidth, top = halfWidth, right = this.canvas.width - width, bottom = this.canvas.height - width;
    const distance = [
      s.x - left,
      right - s.x,
      s.y - top,
      bottom - s.y
    ];
    for (const d of distance) {
      if (d < s.radius) {
        return true;
      }
    }
    return false;
  }
}
