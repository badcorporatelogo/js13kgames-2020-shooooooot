import { canvas, context as ctx } from '../world/dom'

const startAngle = 0, endAngle = 2 * Math.PI;

export default class Circle {
  // Create an circle centered within an axis-aligned bounding box.
  static fromBoundingBox(aabb) {
    const { left, top, right, bottom } = aabb;
    const x = 0.5 * (left + right);
    const y = 0.5 * (top + bottom);
    const radiusX = 0.5 * (right - left);
    const radiusY = 0.5 * (bottom - top);
    const radius = Math.min(radiusX, radiusY);

    const path = new Path2D();
    path.arc(x, y, radius, startAngle, endAngle);
    return path;
  }

  static draw(c) {
    const savedFillStyle = ctx.fillStyle;
    ctx.fillStyle = c.fillStyle;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, startAngle, endAngle);
    ctx.fill();
    ctx.fillStyle = savedFillStyle;
  }
}
