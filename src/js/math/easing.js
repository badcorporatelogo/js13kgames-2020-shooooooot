// 1D normalized nonlinear transformations
// Use values of t in [0, 1].

export function smoothStart2(t) { return t * t; }
export function smoothStart3(t) { return t * t * t; }
export function smoothStart4(t) { return t * t * t * t; }
export function smoothStart5(t) { return t * t * t * t * t; }
export function smoothStart6(t) { return t * t * t * t * t * t; }

export function smoothStop2(t) { return 1 - (1 - t) * (1 - t); }
export function smoothStop3(t) { return 1 - (1 - t) * (1 - t) * (1 - t); }
export function smoothStop4(t) { return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t); }
export function smoothStop5(t) { return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t); }
export function smoothStop6(t) { return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t); }

// Transformations (a and b are functions)

export function mix(a, b, weightB, t) { return (1 - weightB) * a(t) + weightB * b(t); }

export function crossfade(a, b, t) { return (1 - t) * a(t) + t * b(t); }

export function scale(a, t) { return t * a(t); }

export function reverseScale(a, t) { return (1 - t) * a(t); }

export function arch2(t) { return t * (1 - t); }

// scale(arch2, t)
export function smoothStartArch3(t) { return t * t * (1 - t); }

// reserseScale(arch2, t)
export function smoothStopArch3(t) { return t * (1 - t) * (1 - t); }

export function smoothStepArch4(t) { return reverseScale(t => scale(arch2, t), t); }

export function bellCurve6(t) { return smoothStop3(t) * smoothStop3(t); }

export function bounceClampBottom(t) { return Math.abs(t); }
export function bounceClampTop(t) { return 1 - Math.abs(1 - t); }
export function bounceClampBottomTop(t) { return bounceClampTop(bounceClampBottom(t)); }

// Cubic (3rd) Bezier through A,B,C,D where A (start) and D (end) are assumed to be 0 and 1
export function normalizedBezier3(b, c, t) {
  let s = 1 - t;
  let t2 = t * t;
  let s2 = s * s;
  let t3 = t * t2;
  return (3 * b * s2 * t) + (3 * c * s * t2) + t3;
}
