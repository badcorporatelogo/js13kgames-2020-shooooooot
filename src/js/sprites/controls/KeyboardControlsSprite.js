import Sprite from '../Sprite'

const size = 300;

export default class KeyboardControlsSprite extends Sprite {
  constructor(x, y, scale = 1) {
    super();
    this.x = x;
    this.y = y;
    this.width = size * scale;
    this.keySize = this.width / 20;
    this.keySpacing = this.keySize * 1.1;
    this.height = this.keySpacing * 6;
  }

  drawKey(x, y, r, c) {
    const keySize = this.keySize;
    const keySpacing = this.keySize * 1.1;
    this.context.strokeRect(x + c * keySpacing, y + r * keySpacing, keySize, keySize);
  }

  drawKeys(x, y) {
    this.drawKey(x, y, 0, 1);
    for (let c = 0; c < 3; ++c) {
      this.drawKey(x, y, 1, c);
    }
  }

  drawMouse() {
    const ctx = this.context;
    const radius = this.keySize * 1.5;
    const x = this.x + this.width + this.keySize * 5;
    const y = this.y + radius;
    const top = y + radius;
    const bottom = y + radius * 2;
    const left = x - radius;
    const right = x + radius;

    ctx.beginPath();
    ctx.arc(x, bottom, radius, 0, Math.PI);
    ctx.arc(x, top, radius, Math.PI, Math.PI*2);
    ctx.lineTo(left, top);
    ctx.moveTo(x, top - radius);
    ctx.lineTo(x, top);
    ctx.moveTo(right, top);
    ctx.lineTo(right, bottom);
    ctx.stroke();
  }

  draw() {
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.drawKeys(this.x + this.keySpacing*2, this.y + this.keySpacing);
    this.drawKeys(this.x + this.width - this.keySpacing*5, this.y + this.height - this.keySpacing * 3);
    this.drawMouse();

    this.context.save();
    this.context.fillStyle = this.context.strokeStyle;
    this.context.font = '24px verdana';
    this.context.textAlign = 'left';
    this.context.fillText('Keyboard and Mouse', this.x + 50, this.y - 24);
    this.context.restore();
  }
}
