export default class Rectangle {
  // Create a rectangle from an axis-aligned bounding box.
  static fromBoundingBox(aabb) {
    const { left, top, right, bottom } = aabb;
    const width = right - left;
    const height = bottom - top;

    const path = new Path2D();
    path.rect(x, y, width, height);
    return path;
  }

  static draw(r) {
    const { stokeStyle, lineWidth } = ctx;
    ctx.strokeStyle = r.strokeStyle;
    ctx.lineWidth = r.lineWidth;

    ctx.strokeRect(r.x, r.y, r.width, r.height);

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
  }
}
