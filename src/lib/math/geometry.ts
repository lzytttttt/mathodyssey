/**
 * Geometry calculation utilities for interactive experiments.
 * All functions are pure — no side effects, no DOM access.
 */

/** Degrees to radians */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Radians to degrees */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculate shadow length given object height and sun elevation angle.
 * shadow = height / tan(angle)
 * @param height - object height
 * @param sunAngleDeg - sun elevation angle in degrees
 */
export function shadowLength(height: number, sunAngleDeg: number): number {
  const angleRad = degToRad(sunAngleDeg);
  if (Math.tan(angleRad) === 0) return Infinity;
  return height / Math.tan(angleRad);
}

/**
 * Calculate unknown height using similar triangles.
 * h_object / h_stick = L_object_shadow / l_stick_shadow
 * h_object = h_stick * (L_object_shadow / l_stick_shadow)
 * @param stickHeight - known stick height
 * @param stickShadow - stick shadow length
 * @param objectShadow - object shadow length
 */
export function similarTriangleHeight(
  stickHeight: number,
  stickShadow: number,
  objectShadow: number
): number {
  if (stickShadow === 0) return Infinity;
  return stickHeight * (objectShadow / stickShadow);
}

/**
 * Given sun angle and object height, compute full shadow measurement data.
 * Returns all derived values for the shadow measurement experiment.
 */
export function computeShadowData(params: {
  sunAngleDeg: number;
  stickHeight: number;
  buildingHeight: number;
}): {
  stickShadow: number;
  buildingShadow: number;
  calculatedHeight: number;
  ratio: number;
} {
  const { sunAngleDeg, stickHeight, buildingHeight } = params;
  const stickShadow = shadowLength(stickHeight, sunAngleDeg);
  const buildingShadow = shadowLength(buildingHeight, sunAngleDeg);
  const calculatedHeight = similarTriangleHeight(
    stickHeight,
    stickShadow,
    buildingShadow
  );
  const ratio =
    stickShadow > 0 ? buildingShadow / stickShadow : 0;

  return { stickShadow, buildingShadow, calculatedHeight, ratio };
}

// --- Pythagorean / geometry proof helpers ---

/** c = √(a² + b²) */
export function pythagoreanHypotenuse(a: number, b: number): number {
  return Math.sqrt(a * a + b * b);
}

export type Point = [number, number];

/**
 * Compute the four vertices of a square built on edge p1→p2,
 * on the side away from `oppositePoint`.
 *
 * The square is constructed by:
 * 1. Computing the edge direction vector d = p2 - p1
 * 2. Computing the perpendicular normal n = (-dy, dx) (90° CCW rotation)
 * 3. Checking which side `oppositePoint` is on via cross product
 * 4. Flipping n if needed so the square faces away from `oppositePoint`
 * 5. Returning [p1, p2, p2 + n, p1 + n]
 *
 * Works in any coordinate system (SVG y-down or math y-up).
 */
export function squareOnEdgeAwayFromPoint(
  p1: Point,
  p2: Point,
  oppositePoint: Point
): [Point, Point, Point, Point] {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];

  // Perpendicular normal (90° CCW rotation of edge direction)
  let nx = -dy;
  let ny = dx;

  // Cross product of (p2-p1) × (opposite-p1)
  // Positive means oppositePoint is on the left side of p1→p2
  const cross = dx * (oppositePoint[1] - p1[1]) - dy * (oppositePoint[0] - p1[0]);

  // If oppositePoint is on the left side, flip normal to point right (away from it)
  if (cross > 0) {
    nx = -nx;
    ny = -ny;
  }

  return [
    p1,
    p2,
    [p2[0] + nx, p2[1] + ny],
    [p1[0] + nx, p1[1] + ny],
  ];
}
