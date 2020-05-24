import Sprite from './Sprite'

export default class BoxSprite extends Sprite {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    this.context.strokeRect(this.x, this.y, this.width, this.height);
  }
}
