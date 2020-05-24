import Sprite from '../Sprite'
import Colors from '../../settings/Colors'

const lineWidth = 36;
const size = 64;
const height = size*2/3;
const width = size;
const startAngle = 0, endAngle = 2 * Math.PI;

export default class GamepadControlsSprite extends Sprite {
  constructor(x, y, scale = 1) {
    super();
    this.x = x;
    this.y = y + lineWidth;
  }

  drawThumbStick(x, y, radius) {
    const ctx = this.context;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
  }

  draw() {
    const ctx = this.context;
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.fillStyle = Colors.background;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + height);
    ctx.lineTo(this.x + width/5, this.y);
    ctx.moveTo(this.x + width/5, this.y+height/5);
    ctx.rect(this.x + width/5, this.y+height/5, width*3/5, height/5);
    ctx.moveTo(this.x + width*4/5, this.y);
    ctx.lineTo(this.x + width, this.y + height);
    ctx.stroke();
    this.drawThumbStick(this.x + width/5, this.y + height*2/5 ,lineWidth/4);
    this.drawThumbStick(this.x + width*4/5, this.y + height*2/5 ,lineWidth/4);
    this.context.restore();

    this.context.save();
    this.context.fillStyle = this.context.strokeStyle;
    this.context.font = '24px verdana';
    this.context.textAlign = 'left';
    this.context.fillText('Gamepad', this.x - 30, this.y - 48);
    this.context.restore();
  }
}
