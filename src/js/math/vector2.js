export function vector(x, y) { return { x: x, y: y }; }

export function origin() { return vector(0, 0); }

export function sqr(x) {
  return x * x;
}

export function distanceSquared(v, w) {
  return sqr(v.x - w.x) + sqr(v.y - w.y);
}

export function distance(v, w) {
  return Math.sqrt(distanceSquared(v, w));
}

// Angle of vector from v to w, relative to y axis.
export function angle(v, w) {
  const dx = w.x - v.x;
  const dy = w.y - v.y;
  return Math.atan2(dy, dx);
}

export function distToSegmentSquared(p, v, w) {
  const l2 = distanceSquared(v, w);
  if (l2 === 0) return distanceSquared(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return distanceSquared(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y)
  });
}

// Computes the minimum distance from a point p to line segment
// between v and w.
export function distToSegment(p, v, w) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}

export function getPointOnCircle(circle, angle) {
  return vector(
    Math.cos(angle) * circle.radius + circle.x,
    Math.sin(angle) * circle.radius + circle.y
  );
}
