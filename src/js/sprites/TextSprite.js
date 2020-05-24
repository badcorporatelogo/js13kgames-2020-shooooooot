import Sprite from './Sprite'

export default class TextSprite extends Sprite {
  constructor(text, x, y) {
    super();
    this.text = text;
    this.x = x;
    this.y = y;
  }

  setText(newText) {
    if (this.text !== newText) {
      this.text = newText;
      this.isDirty = true;
    }
  }

  update(t) {
    return super.update(t) || this.isDirty;
  }

  draw() {
    this.context.fillText(this.text, this.x, this.y);
    this.isDirty = false;
  }
}
