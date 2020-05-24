import MouseState from '../input/MouseState'
import Colors from '../../settings/Colors'
import RenderLayer from '../RenderLayer'
import TextSprite from '../../sprites/TextSprite'
import { smoothStart2, smoothStop4 } from '../../math/easing'
import Chain from '../../actions/Chain'

const textFont = '64px verdana';
const textHeight = 64 * 1.25;
const ammoMax = 404;

export default class Hud extends RenderLayer {
  constructor(name, layer) {
    super(name, layer);

    this.context.strokeStyle = Colors.player;
    this.context.fillStyle = Colors.player;
    this.context.lineWidth = 4;
    this.context.font = textFont;

    this.score = 0;
    this.ammo = ammoMax;

    this.scoreSprite = new TextSprite('score: 0', 50, textHeight);
    this.scoreSprite.state = 'visible';
    this.addObject(this.scoreSprite);
    this.ammoSprite = new TextSprite(`ammo: ${this.ammo}`, this.canvas.width - 430, textHeight);
    this.ammoSprite.state = 'visible';
    this.addObject(this.ammoSprite);

    this.mouse = new MouseState(this.canvas);
  }

  addScore(amount) {
    this.isDirty = true;
    this.score += amount;
    return this.score;
  }

  addAmmo(amount) {
    this.isDirty = true;
    this.ammo = Math.min(ammoMax, this.ammo + amount);
    return this.ammo;
  }

  decrementAmmo(amount = 1) {
    this.isDirty = true;
    this.ammo = Math.max(0, this.ammo - amount);
    return this.ammo;
  }

  setAmmo(value) {
    if (this.ammo != value) {
      this.ammo = value;
      this.isDirty = true;
    }
  }

  getPlayer() {
    return this.getLayer('player').player;
  }

  hideText(sprite) {
    const moveOff = new Chain(-textHeight * 1.5, smoothStart2, sprite, 'y', 0.25);
    sprite.addAction(moveOff);
    sprite.state = 'hiding';
  }

  showText(sprite) {
    const moveOn = new Chain(textHeight * 1.5, smoothStop4, sprite, 'y', 0.33);
    sprite.addAction(moveOn);
    sprite.state = 'unhiding';
  }

  updateState(sprite) {
    if (sprite.state === 'hiding' && sprite.actions.length === 0) {
      sprite.state = 'hidden';
    } else if (sprite.state === 'unhiding' && sprite.actions.length === 0) {
      sprite.state = 'visible';
    }
  }

  update(t) {
    if (this.isDirty) {
      this.scoreSprite.setText(`score: ${this.score}`);
      this.ammoSprite.setText(`ammo: ${this.ammo}`);
    }
    this.updateState(this.scoreSprite);
    this.updateState(this.ammoSprite);

    let player = this.getPlayer();
    if (player.exploded) {
      player = {
        x: this.canvas.width,
        y: this.canvas.height,
      };
    }
    const inTopRange = (player.y < textHeight * 2);
    if (inTopRange && player.x < 500) {
      if (this.scoreSprite.state === 'visible') {
        this.hideText(this.scoreSprite);
      }
    } else if (inTopRange && player.x > (this.canvas.width - 500)) {
      if (this.ammoSprite.state === 'visible') {
        this.hideText(this.ammoSprite);
      }
    } else if (this.scoreSprite.state === 'hidden') {
      this.showText(this.scoreSprite);
    } else if (this.ammoSprite.state === 'hidden') {
      this.showText(this.ammoSprite);
    }
    return super.update(t);
  }
}
