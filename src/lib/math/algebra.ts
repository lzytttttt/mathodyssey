/**
 * Algebra utilities for interactive experiments.
 * All functions are pure — no side effects, no DOM access.
 */

/** Clamp an integer to [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Solve the chicken-rabbit problem.
 * Given total heads and total legs, find the number of chickens and rabbits.
 * Chickens have 2 legs, rabbits have 4 legs.
 * @returns null if no integer solution exists.
 */
export function solveChickenRabbit(
  heads: number,
  legs: number
): { chickens: number; rabbits: number } | null {
  const h = Math.max(0, Math.round(heads));
  const l = Math.max(0, Math.round(legs));

  if (!isChickenRabbitSolvable(h, l)) return null;

  const rabbits = (l - 2 * h) / 2;
  const chickens = h - rabbits;

  return { chickens, rabbits };
}

/**
 * Check whether the given heads/legs combination has an integer solution.
 * Conditions:
 * - legs must be even
 * - 2 * heads <= legs <= 4 * heads
 */
export function isChickenRabbitSolvable(
  heads: number,
  legs: number
): boolean {
  const h = Math.max(0, Math.round(heads));
  const l = Math.max(0, Math.round(legs));

  if (l % 2 !== 0) return false;
  if (l < 2 * h) return false;
  if (l > 4 * h) return false;

  return true;
}

/**
 * Compute the step-by-step assumption method reasoning.
 * Step 1: Assume all are chickens → assumed legs
 * Step 2: Difference from actual legs
 * Step 3: Rabbits = difference / 2
 * Step 4: Chickens = heads - rabbits
 */
export function chickenRabbitAssumptionSteps(
  heads: number,
  legs: number
): {
  assumedAllChickenLegs: number;
  legDifference: number;
  rabbitsFromDifference: number;
  chickens: number;
  rabbits: number;
  isValid: boolean;
} {
  const h = Math.max(0, Math.round(heads));
  const l = Math.max(0, Math.round(legs));
  const valid = isChickenRabbitSolvable(h, l);
  const assumedAllChickenLegs = h * 2;
  const legDifference = l - assumedAllChickenLegs;
  const rabbitsFromDifference = legDifference / 2;
  const rabbits = valid ? rabbitsFromDifference : 0;
  const chickens = valid ? h - rabbits : 0;

  return {
    assumedAllChickenLegs,
    legDifference,
    rabbitsFromDifference,
    chickens,
    rabbits,
    isValid: valid,
  };
}

/**
 * Generate the system of equations as strings.
 * Returns LaTeX-compatible expressions for display.
 */
export function chickenRabbitEquations(
  heads: number,
  legs: number
): {
  equation1: string;
  equation2: string;
  eliminationFormula: string;
} {
  const h = Math.round(heads);
  const l = Math.round(legs);

  return {
    equation1: `c + r = ${h}`,
    equation2: `2c + 4r = ${l}`,
    eliminationFormula: `r = \\frac{${l} - 2 \\times ${h}}{2} = \\frac{${l - 2 * h}}{2} = ${(l - 2 * h) / 2}`,
  };
}

/**
 * Clamp heads value to valid range.
 */
export function clampHeads(value: number): number {
  return clamp(value, 2, 50);
}

/**
 * Clamp legs value to valid range.
 */
export function clampLegs(value: number): number {
  return clamp(value, 4, 200);
}

// --- Completing the Square (al-Khwarizmi) ---

/** Clamp b for completing-the-square experiment. */
export function clampB(value: number): number {
  return clamp(value, 1, 12);
}

/** Clamp c for completing-the-square experiment. */
export function clampC(value: number): number {
  return clamp(value, 1, 50);
}

/**
 * Solve x² + bx = c by completing the square.
 * x = √(c + (b/2)²) - b/2
 * @returns null if c + (b/2)² < 0 (no real solution).
 */
export function solveQuadraticByCompletingSquare(
  b: number,
  c: number
): { x: number; isValid: boolean } {
  const halfB = b / 2;
  const cornerArea = halfB * halfB;
  const bigSquareValue = c + cornerArea;

  if (bigSquareValue < 0) {
    return { x: NaN, isValid: false };
  }

  const x = Math.sqrt(bigSquareValue) - halfB;
  return { x, isValid: true };
}

/**
 * Compute geometric parts for completing-the-square visualization.
 * Returns all area values and dimensions needed for SVG rendering.
 */
export function completingSquareParts(b: number, c: number): {
  x: number;
  xSquared: number;
  bxArea: number;
  halfB: number;
  cornerArea: number;
  bigSquareSide: number;
  bigSquareArea: number;
  isValid: boolean;
} {
  const { x, isValid } = solveQuadraticByCompletingSquare(b, c);

  if (!isValid) {
    return {
      x: NaN, xSquared: NaN, bxArea: NaN, halfB: b / 2,
      cornerArea: (b / 2) * (b / 2), bigSquareSide: NaN,
      bigSquareArea: NaN, isValid: false,
    };
  }

  const halfB = b / 2;
  const xSquared = x * x;
  const bxArea = b * x;
  const cornerArea = halfB * halfB;
  const bigSquareSide = x + halfB;
  const bigSquareArea = bigSquareSide * bigSquareSide;

  return {
    x, xSquared, bxArea, halfB, cornerArea,
    bigSquareSide, bigSquareArea, isValid,
  };
}

/**
 * Step-by-step completing-the-square derivation with LaTeX formulas.
 */
export function completingSquareSteps(b: number, c: number): {
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  result: string;
  halfBStr: string;
  cornerStr: string;
  bigSquareStr: string;
  xStr: string;
} {
  const parts = completingSquareParts(b, c);
  const halfBFrac = formatHalfBFraction(b);
  const corner = parts.cornerArea;
  const bigVal = c + corner;
  const xVal = parts.x;

  const bStr = String(b);
  const cStr = String(c);
  const cornerStr = Number.isInteger(corner) ? String(corner) : corner.toFixed(2);
  const bigStr = Number.isInteger(bigVal) ? String(bigVal) : bigVal.toFixed(2);
  const xStr = Number.isInteger(xVal)
    ? String(xVal)
    : xVal.toFixed(2).replace(/\.?0+$/, '');

  return {
    step1: `x^2 + ${bStr}x = ${cStr}`,
    step2: `x^2 + ${bStr}x + ${halfBFrac}^2 = ${cStr} + ${cornerStr}`,
    step3: `(x + ${halfBFrac})^2 = ${bigStr}`,
    step4: `x + ${halfBFrac} = \\sqrt{${bigStr}}`,
    result: `x = ${xStr}`,
    halfBStr: halfBFrac,
    cornerStr,
    bigSquareStr: bigStr,
    xStr,
  };
}

/**
 * Format the original equation as LaTeX.
 * e.g. "x^2 + 6x = 7" or "x^2 + 5x = 10"
 */
export function formatQuadraticEquation(b: number, c: number): string {
  const bStr = String(Math.round(b));
  const cStr = String(Math.round(c));
  if (b === 1) return `x^2 + x = ${cStr}`;
  return `x^2 + ${bStr}x = ${cStr}`;
}

/**
 * Format b/2 as a fraction string for LaTeX display.
 * Even b: "3", Odd b: "\\frac{5}{2}"
 */
export function formatHalfBFraction(b: number): string {
  if (b % 2 === 0) return String(b / 2);
  return `\\frac{${b}}{2}`;
}

/**
 * Format b/2 as a decimal label for SVG geometric labels.
 * Even b: "3", Odd b: "2.5"
 */
export function formatHalfBLabel(b: number): string {
  const half = b / 2;
  return Number.isInteger(half) ? String(half) : half.toFixed(1);
}

/**
 * Format a number for display, removing trailing zeros.
 */
export function formatNumber(value: number, decimals = 2): string {
  if (Number.isNaN(value)) return '—';
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}
