import dom from './dom'
import { renderArea } from './dom'
import { removeAll } from '../utility/array'

export default class RenderLayer {
  constructor(name, layer) {
    // Higher number layers cover lower number layers.
    this.z = layer;
    this.name = name;
    const canvas = this.canvas = dom.createCanvas();
    canvas.id = name;
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.style = `z-index: ${layer}`;
    this.context = canvas.getContext("2d");
    this.objects = [];
    this.isDirty = true;
    renderArea.appendChild(canvas);
  }

  getLayer(name) {
    return this.parent.layer[name];
  }

  addObject(o) {
    o.parent = this;
    o.context = this.context;
    if (typeof o.z !== 'number') {
      o.z = 0;
    }
    this.objects.push(o);
    this.isObjectListDirty = true;
  }

  removeObject(o) {
    removeAll(this.objects, e => e === o);
    o.parent = null;
    o.context = null;
  }

  clear() {
    // This will always clear the full canvas.
    const ctx = this.context;
    const canvas = this.canvas;
    let storedTransform = ctx.getTransform();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(storedTransform);
  }

  update(t) {
    for (const object of this.objects) {
      const updated = object.update(t);
      this.isDirty = updated || this.isDirty;
    }
    if (this.isObjectListDirty) {
      // Lower z-order is updated/rendered first. Higher z-order
      // things will cover lower z-order things.
      this.objects.sort((a, b) => (a.z - b.z));
      this.isObjectListDirty = false;
    }
  }

  draw() {
    if (this.isDirty) {
      this.clear();
      for (const object of this.objects) {
        object.draw();
      }
      this.isDirty = false;
    }
  }

  dispose() {
    renderArea.removeChild(this.canvas);
  }
}
