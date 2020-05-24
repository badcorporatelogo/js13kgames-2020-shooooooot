import EnemySprite from './EnemySprite'

const size = 25;
const speed = 5;
const drawWidth = 9;
const halfRepelAngle = Math.PI / 6;

export default class HunterSprite extends EnemySprite {
  constructor(x, y) {
    super(x, y, size / 2);
    x -= size / 2;
    y -= size / 2;
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.pointValue = 15;
  }

  center() {
    this._center.x = this.x + size/2;
    this._center.y = this.y + size/2;
    return this._center;
  }

  update(t) {
    const player = this.getPlayer();
    if (player) {
      const playerPosition = player.center();
      const myPosition = this.center();

      const dx = playerPosition.x - myPosition.x;
      const dy = playerPosition.y - myPosition.y;
      if (Math.abs(dx) < speed && Math.abs(dy) < speed) {
        this.dx = 0;
        this.dy = 0;
      } else {
        let angle = Math.atan2(dy, dx);
        // when repulsing, make them go faster so the player doesn't crash.
        let reverseSpeed = 0;
        // Reverse direction if the player is coming at us.
        if (this.inRepelArc(angle, player)) {
          const deviation = Math.random() * (Math.PI / 2) - (Math.PI / 4);
          angle = fixAngle(angle + Math.PI + deviation);
          reverseSpeed = 3;
        }
        this.dx = Math.cos(angle) * (speed + reverseSpeed);
        this.dy = Math.sin(angle) * (speed + reverseSpeed);
      }
    }

    return super.update(t);
  }

  inRepelArc(angle, player) {
    const angleFromPlayer = fixAngle(angle + Math.PI);
    const playerAngle = fixAngle(player.angle);

    let min = playerAngle - halfRepelAngle;
    let max = playerAngle + halfRepelAngle;

    if (min < 0) {
      min += twoPi;
      return ((angleFromPlayer <= max) && (angleFromPlayer >= 0) || ((angleFromPlayer >= min) && (angleFromPlayer <= twoPi)));
    } else if (max > twoPi) {
      max -= twoPi;
      return ((angleFromPlayer <= max) && (angleFromPlayer >= 0) || ((angleFromPlayer >= min) && (angleFromPlayer <= twoPi)));
    }
    return ((angleFromPlayer <= max) && (angleFromPlayer >= min));
  }

  draw() {
    const lineWidth = this.context.lineWidth;
    this.context.lineWidth = drawWidth;
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.context.lineWidth = lineWidth;
  }
}

const twoPi = Math.PI * 2;

// Return an angle between 0 and twoPi.
function fixAngle(a) {
  while (a > twoPi) { a -= twoPi; }
  if (a < 0) { a += twoPi; }
  return a;
}
