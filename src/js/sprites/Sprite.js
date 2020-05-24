import implementActionList from '../traits/ActionList'

export default class Sprite {
  constructor() {
    implementActionList(this);
    this.dx = 0;
    this.dy = 0;
    this.context = null; // set by RenderLayer.addObject
  }

  update(t) {
    let isDirty = this.updateActions(t);

    if (this.dx || this.dy) {
      this.x += this.dx;
      this.y += this.dy;
      isDirty = true;
    }
    return isDirty;
  }

  getLayer(name) {
    return this.parent.getLayer(name);
  }
}
