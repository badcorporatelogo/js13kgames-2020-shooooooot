import Chain from '../../actions/Chain'
import { smoothStop4 } from '../../math/easing'
import implementActionList from '../../traits/ActionList'
import Colors from '../../settings/Colors'
import TextSprite from '../../sprites/TextSprite'
import GamepadControlsSprite from '../../sprites/controls/GamepadControlsSprite'
import KeyboardControlsSprite from '../../sprites/controls/KeyboardControlsSprite'
import MouseState from '../input/MouseState'
import KeyState from '../input/KeyState'
import { KEY_ENTER } from '../input/KeyState'
import RenderLayer from '../RenderLayer'

const workingTitle = 'Shooooooot!!';
const infoText = [
  'avoid being hit',
  'point to shoot',
  'max ammo: 404',
];
const titleFont = '128px verdana';
const titleHeight = 128 * 1.25;
const textFont = '64px verdana';
const textHeight = 64 * 1.25;
const startText = 'Click or Press Enter to Start';

export default class Intro extends RenderLayer {
  constructor(name, layer) {
    super(name, layer);
    implementActionList(this);

    this.context.strokeStyle = Colors.enemies;
    this.context.fillStyle = Colors.player;
    this.context.lineWidth = 8;
    this.context.font = textFont;
    this.context.textAlign = 'center';

    this.titleEase = 0;

    this.addAction(new Chain(1, smoothStop4, this, 'titleEase', .75));

    this.addObject(new KeyboardControlsSprite(100, 100));
    this.addObject(new GamepadControlsSprite(this.canvas.width - 300, 100));
    this.keys = new KeyState(window);
    this.mouse = new MouseState(this.canvas);
  }

  // Fill background
  clear() {
    const ctx = this.context;
    const canvas = ctx.canvas;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    ctx.save();
    const gradient = ctx.createRadialGradient(x, y, canvas.height / 2, x, y, canvas.height * 4/3);
    gradient.addColorStop(0, Colors.background);
    gradient.addColorStop(1, Colors.obstacles);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    return this;
  }

  renderTitle() {
    const ctx = this.context;
    const canvas = ctx.canvas;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let yOffset = canvas.height * 1/10;

    ctx.save();
    ctx.font = titleFont;
    if (Math.random() > 0.9) {
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = Math.round(Math.random() * 16 - 8);
      ctx.shadowOffsetY = Math.round(Math.random() * 16 - 8);
      ctx.shadowColor = ctx.fillStyle;
    }
    ctx.fillText(workingTitle, x, this.titleEase * y - yOffset);
    ctx.restore();
  }

  renderInfoText() {
    const ctx = this.context;
    const canvas = ctx.canvas;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    for (let i in infoText) {
      const t = infoText[i];
      const x = this.titleEase * centerX;
      const y = centerY + (i * textHeight);
      ctx.fillText(t, x, y);
    }
  }

  renderNext() {
    const ctx = this.context;
    const canvas = ctx.canvas;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let n = infoText.length + 3;

    const x = centerX + (1-this.titleEase) * centerX * 2;
    const y = centerY + (n * textHeight);

    const savedFill = ctx.fillStyle;
    const savedStroke = ctx.strokeStyle;
    ctx.fillStyle = Colors.enemies;
    ctx.strokeStyle = Colors.enemies;
    ctx.fillText(startText, x, y);
    const height = textHeight * 1.1;
    const width = ctx.measureText(startText).width * 1.1;
    ctx.strokeRect(x - width / 2, y - height * 0.8, width, height);
    ctx.fillStyle = savedFill;
    ctx.strokeStyle = savedStroke;
  }

  update(t) {
    super.update(t);
    this.updateActions(t);
    if (this.keys.isKeyDown(KEY_ENTER)) {
      this.parent.start();
    } else if (this.mouse.isMouseDown) {
      this.parent.start();
    }
    this.isDirty = true;
  }

  draw() {
    super.draw();
    this.renderTitle();
    this.renderInfoText();
    this.renderNext();
  }
}
