/**
 * Coordinate plane utilities for interactive experiments.
 * All functions are pure — no side effects, no DOM access.
 */

/** A point in mathematical coordinate space. */
export interface Point {
  x: number;
  y: number;
}

/** Visible bounds of the coordinate plane. */
export interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/** Standard bounds for the coordinate explorer: -10 to 10 on both axes. */
export const DEFAULT_BOUNDS: Bounds = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

/** Default SVG canvas dimensions and padding. */
export const DEFAULT_SVG_W = 680;
export const DEFAULT_SVG_H = 520;
export const DEFAULT_PAD = 40;

/** Clamp a value to [min, max]. */
export function clampCoordinate(
  value: number,
  min: number,
  max: number
): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Convert a math coordinate point to SVG pixel coordinates.
 * Math: y increases upward. SVG: y increases downward.
 */
export function mathToSvg(
  point: Point,
  bounds: Bounds,
  svgW: number,
  svgH: number,
  pad: number
): { x: number; y: number } {
  const usableW = svgW - 2 * pad;
  const usableH = svgH - 2 * pad;
  const x = pad + ((point.x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * usableW;
  const y = pad + ((bounds.yMax - point.y) / (bounds.yMax - bounds.yMin)) * usableH;
  return { x, y };
}

/**
 * Convert SVG pixel coordinates to math coordinate point.
 * Math: y increases upward. SVG: y increases downward.
 */
export function svgToMath(
  px: number,
  py: number,
  bounds: Bounds,
  svgW: number,
  svgH: number,
  pad: number
): Point {
  const usableW = svgW - 2 * pad;
  const usableH = svgH - 2 * pad;
  const x = bounds.xMin + ((px - pad) / usableW) * (bounds.xMax - bounds.xMin);
  const y = bounds.yMax - ((py - pad) / usableH) * (bounds.yMax - bounds.yMin);
  return { x, y };
}

/** Snap a point to the nearest integer grid position, clamped to bounds. */
export function snapToGrid(point: Point, bounds: Bounds): Point {
  return {
    x: clampCoordinate(Math.round(point.x), bounds.xMin, bounds.xMax),
    y: clampCoordinate(Math.round(point.y), bounds.yMin, bounds.yMax),
  };
}

/** Compute the horizontal and vertical deltas between two points. */
export function deltaBetweenPoints(
  a: Point,
  b: Point
): { dx: number; dy: number } {
  return {
    dx: b.x - a.x,
    dy: b.y - a.y,
  };
}

/** Euclidean distance between two points. */
export function distanceBetweenPoints(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Slope between two points.
 * Returns null if the line is vertical (dx = 0).
 */
export function slopeBetweenPoints(
  a: Point,
  b: Point
): number | null {
  const dx = b.x - a.x;
  if (dx === 0) return null;
  return (b.y - a.y) / dx;
}

/**
 * Determine which quadrant a point is in.
 * Returns 'axis' if the point lies on either axis.
 */
export function quadrantOfPoint(
  point: Point
): 1 | 2 | 3 | 4 | 'axis' {
  if (point.x === 0 || point.y === 0) return 'axis';
  if (point.x > 0 && point.y > 0) return 1;
  if (point.x < 0 && point.y > 0) return 2;
  if (point.x < 0 && point.y < 0) return 3;
  return 4;
}

/** Result of deriving a line equation from two points. */
export type LineEquation =
  | { kind: 'normal'; slope: number; intercept: number }
  | { kind: 'vertical'; x: number }
  | { kind: 'indeterminate' };

/**
 * Derive the line equation from two points.
 * - normal:    y = mx + b
 * - vertical:  x = constant
 * - indeterminate: two points coincide
 */
export function lineEquationFromTwoPoints(
  a: Point,
  b: Point
): LineEquation {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  if (dx === 0 && dy === 0) {
    return { kind: 'indeterminate' };
  }

  if (dx === 0) {
    return { kind: 'vertical', x: a.x };
  }

  const slope = dy / dx;
  const intercept = a.y - slope * a.x;
  return { kind: 'normal', slope, intercept };
}

/**
 * Format a line equation as a human-readable string.
 */
export function formatLineEquation(eq: LineEquation): string {
  if (eq.kind === 'indeterminate') {
    return '两点重合，无法确定唯一直线';
  }
  if (eq.kind === 'vertical') {
    return `x = ${eq.x}`;
  }

  const m = eq.slope;
  const b = eq.intercept;

  const mStr = m === 1 ? '' : m === -1 ? '-' : formatNum(m);
  const sign = b >= 0 ? ' + ' : ' - ';
  const bStr = b === 0 ? '' : `${sign}${formatNum(Math.abs(b))}`;

  if (m === 0) {
    return b === 0 ? 'y = 0' : `y = ${formatNum(b)}`;
  }

  return `y = ${mStr}x${bStr}`;
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  // Show up to 2 decimal places, trim trailing zeros
  return parseFloat(n.toFixed(2)).toString();
}

/** Get a human-readable label for the quadrant. */
export function quadrantLabel(q: ReturnType<typeof quadrantOfPoint>): string {
  if (q === 'axis') return '坐标轴上';
  return `第 ${q} 象限`;
}
