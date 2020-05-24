import Sprite from './Sprite'
import BulletSprite from './BulletSprite'
import ParticleBlastSprite from './ParticleBlastSprite'
import { KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN } from '../world/input/KeyState'
import { KEY_W, KEY_A, KEY_S, KEY_D } from '../world/input/KeyState'
import { KEY_SPACE } from '../world/input/KeyState'
import TimedEvent from '../actions/TimedEvent'
import zzfxInit from '../sound/ZzFx'
import { showCursor, hideCursor } from '../world/dom'

const startAngle = 0, endAngle = 2 * Math.PI;
const speed = 5;
const acceleration = 0.2;
const analogDeadZone = 0.2;
const analogDeadZoneSquared = analogDeadZone * analogDeadZone;

// Reach this score to upgrade guns. More shots uses more ammo, though.
const level1Guns = 500;
const level2Guns = 1500;

// x or y at PI/4
const normalizer = Math.sqrt(2)/2;

const leftThumbstickHorizontal = 0;
const leftThumbstickVertical = 1;
const rightThumbstickHorizontal = 2;
const rightThumbstickVertical = 3;

let zzfx;

export default class PlayerSprite extends Sprite {
  constructor(x, y, radius) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this._center = {};

    this.aim = { dx: 0, dy: 0 };
    this.lastAim = { dx: 0, dy: 0 };

    let shoot = new TimedEvent(this.shoot.bind(this), 0.2);
    shoot.then(shoot);
    this.shootAction = shoot;
    this.ammo = 404;
    this.shots = 1;

    this.showCursor();

    if (!zzfx) {
      zzfx = zzfxInit();
    }
  }

  showCursor() {
    if (this.isUsingGamepad) {
      showCursor();
      this.isUsingGamepad = false;
    }
  }

  hideCursor() {
    if (!this.isUsingGamepad) {
      hideCursor();
      this.isUsingGamepad = true;
    }
  }

  startShooting() {
    this.addAction(this.shootAction);
  }

  stopShooting() {
    this.removeAction(this.shootAction);
  }

  magnitude({dx, dy}) {
    return Math.sqrt(dx * dx + dy * dy);
  }

  shoot() {
    switch (this.shots) {
      case 1:
        this.shoot1();
        break;
      case 2:
        this.shoot2();
        break;
      case 3:
        this.shoot3();
        break;
    }
  }

  shoot1() {
    if (!this.inDeadZone(this.aim.dx, this.aim.dy) && this.ammo) {
      const x = this.x + this.aim.dx * this.radius;
      const y = this.y + this.aim.dy * this.radius;
      const bullet = new BulletSprite(x, y, 5);
      // Normalize the aim so shots are always the same speed even when
      // tapping lightly on the analog stick.
      const magnitude = this.magnitude(this.aim);
      bullet.dx = this.aim.dx / magnitude * speed * 2;
      bullet.dy = this.aim.dy / magnitude * speed * 2;
      this.parent.addBullet(bullet);
      this.decrementAmmo(1);
      zzfx(1,.05,31,.04,0,.08,1,.17,0,0,0,0,.03,0,0,0,0,.23,.01,0); // Blip 97
    }
  }

  shoot2() {
    if (!this.inDeadZone(this.aim.dx, this.aim.dy) && this.ammo > 1) {
      const x = this.x + this.aim.dx * this.radius;
      const y = this.y + this.aim.dy * this.radius;
      const angle = Math.atan2(this.aim.dy, this.aim.dx);
      const stepX = Math.cos(angle + Math.PI/2) * 5;
      const stepY = Math.sin(angle + Math.PI/2) * 5;

      let bullet;
      bullet = new BulletSprite(x + stepX, y + stepY, 5);
      bullet.dx = Math.cos(angle + Math.PI/90) * speed * 2;
      bullet.dy = Math.sin(angle + Math.PI/90) * speed * 2;
      this.parent.addBullet(bullet);
      bullet = new BulletSprite(x - stepX, y - stepY, 5);
      bullet.dx = Math.cos(angle - Math.PI/90) * speed * 2;
      bullet.dy = Math.sin(angle - Math.PI/90) * speed * 2;
      this.parent.addBullet(bullet);

      this.decrementAmmo(2);
      zzfx(1,.05,31,.04,0,.08,1,.17,0,0,0,0,.03,0,0,0,0,.23,.01,0); // Blip 97
      zzfx(1,.05,31,.04,0,.08,1,.17,0,0,0,0,.03,0,0,0,0,.23,.01,0); // Blip 97
    }
  }

  shoot3() {
    this.shoot2();
    this.shoot1();
  }

  decrementAmmo(amount) {
    this.ammo = this.getLayer('hud').decrementAmmo(amount);
  }

  updateGuns() {
    const score = this.getLayer('hud').addScore(0);
    if (score > level2Guns) {
      this.shots = 3;
    } else if (score > level1Guns) {
      this.shots = 2;
    }
  }

  updateVelocity(gp) {
    let dx = 0, dy = 0;

    if (gp) {
      dx = gp.axes[leftThumbstickHorizontal];
      dy = gp.axes[leftThumbstickVertical];

      // Prevent drift when sticks aren't really pushed in any direction.
      if (this.inDeadZone(dx, dy)) {
        dx = 0;
        dy = 0;
      }
    }

    let keyInput = false;
    if (this.parent.keys.isKeyDown(KEY_LEFT) || this.parent.keys.isKeyDown(KEY_A)) { dx -= 1; keyInput = true; }
    if (this.parent.keys.isKeyDown(KEY_RIGHT) || this.parent.keys.isKeyDown(KEY_D)) { dx += 1; keyInput = true; }
    if (this.parent.keys.isKeyDown(KEY_UP) || this.parent.keys.isKeyDown(KEY_W)) { dy -= 1; keyInput = true; }
    if (this.parent.keys.isKeyDown(KEY_DOWN) || this.parent.keys.isKeyDown(KEY_S)) { dy += 1; keyInput = true; }
    // Fix this so it normalizes the diagonal speed.
    if (keyInput && dx && dy) {
      dx *= normalizer;
      dy *= normalizer;
    }

    this.dx = speed * dx;
    this.dy = speed * dy;
    this.angle = Math.atan2(dy, dx);
  }

  inDeadZone(x, y) {
    return (x * x + y * y < analogDeadZoneSquared);
  }

  getMouse() {
    return this.getLayer('hud').mouse;
  }

  updateAim(gp) {
    let dx = 0, dy = 0;

    if (gp) {
      dx = gp.axes[rightThumbstickHorizontal];
      dy = gp.axes[rightThumbstickVertical];
      // Prevent drift when sticks aren't really pushed in any direction.
      if (this.inDeadZone(dx, dy)) {
        dx = 0;
        dy = 0;
      } else {
        this.hideCursor();
      }
    }

    // Space bar to shoot straight ahead
    const mouse = this.getMouse();
    if (mouse.isMouseDown) {
      const angle = Math.atan2(mouse.current.y - this.y, mouse.current.x - this.x);
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      this.showCursor();
    }

    this.lastAim.dx = this.aim.dx;
    this.lastAim.dy = this.aim.dy;
    this.aim.dx = dx;
    this.aim.dy = dy;
    this.aim.angle = Math.atan2(dy, dx);

    if ((this.inDeadZone(this.lastAim.dx, this.lastAim.dy) && !this.inDeadZone(this.aim.dx, this.aim.dy))) {
      this.startShooting();
      this.shoot();
    } else if (!this.inDeadZone(this.lastAim.dx, this.lastAim.dy) && this.inDeadZone(this.aim.dx, this.aim.dy)) {
      this.stopShooting();
    }
    return this.lastAim.dx !== dx || this.lastAim.dy !== dy;
  }

  explode() {
    if (!this.exploded) {
      // explode the player and game over
      this.stopShooting();
      this.parent.addObject(new ParticleBlastSprite(this.x, this.y, this.radius, this.radius * 5));
      zzfx(1,.05,776,0,.21,.83,4,4.8,0,1,0,0,0,.6,.2,.6,0,.94,.09,.41); // Explosion 83
    }
    this.exploded = true;
  }

  update(t) {
    // Refresh ammo count from HUD
    this.decrementAmmo(0);
    this.updateGuns();

    if (!this.exploded) {
      const gp = navigator.getGamepads()[0];
      this.updateVelocity(gp);

      let aimUpdated = this.updateAim(gp);

      return super.update(t) || aimUpdated;
    }
  }

  center() {
    this._center.x = this.x;
    this._center.y = this.y;
    return this._center;
  }

  draw() {
    const ctx = this.context;
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, startAngle, endAngle);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x + this.aim.dx * this.radius, this.y + this.aim.dy * this.radius, 5, startAngle, endAngle);
      ctx.stroke();
    }
  }
}
