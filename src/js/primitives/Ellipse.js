import { canvas, context as ctx } from '../world/dom'

const rotation = 0, startAngle = 0, endAngle = 2 * Math.PI;

export default class Ellipse {
  // Create an elliptical path from an axis-aligned bounding box.
  static fromBoundingBox(aabb) {
    const { left, top, right, bottom } = aabb;
    const x = 0.5 * (left + right);
    const y = 0.5 * (top + bottom);
    const radiusX = 0.5 * (right - left);
    const radiusY = 0.5 * (bottom - top);

    const path = new Path2D();
    path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    return path;
  }

  static drawFromBoundingRect(outlineRect, style) {
    const { strokeStyle, lineWidth } = ctx;
    ctx.strokeStyle = style.strokeStyle;
    ctx.lineWidth = style.lineWidth;

    const { left, top, right, bottom } = outlineRect;
    const x = 0.5 * (left + right);
    const y = 0.5 * (top + bottom);
    const radiusX = 0.5 * (right - left);
    const radiusY = 0.5 * (bottom - top);
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.stroke();

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
  }
}
