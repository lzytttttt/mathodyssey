/**
 * Calculus utilities for interactive experiments.
 * All functions are pure — no React, no DOM, no SVG.
 * Depends on functions.ts for evaluateFunction.
 * Depends on coordinate.ts for lineEquationFromTwoPoints.
 */

import type { FunctionParams } from './functions';
import { evaluateFunction } from './functions';
import type { LineEquation } from './coordinate';
import { lineEquationFromTwoPoints } from './coordinate';

// --- Types ---

/** A point on a function curve. */
export interface CurvePoint {
  x: number;
  y: number;
}

/** Result of average rate of change between two x values. */
export interface AverageRateResult {
  pointA: CurvePoint;
  pointB: CurvePoint;
  deltaX: number;
  deltaY: number;
  rate: number | null;
  rateFormatted: string;
  formulaLatex: string;
}

// --- Functions ---

/**
 * Compute the average rate of change between x1 and x2.
 * rate = (f(x2) - f(x1)) / (x2 - x1).
 * Returns null rate when x1 = x2 (never NaN or Infinity).
 */
export function averageRateOfChange(
  params: FunctionParams,
  x1: number,
  x2: number
): AverageRateResult {
  const y1 = evaluateFunction(params, x1);
  const y2 = evaluateFunction(params, x2);
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  if (deltaX === 0) {
    return {
      pointA: { x: x1, y: y1 },
      pointB: { x: x2, y: y2 },
      deltaX: 0,
      deltaY,
      rate: null,
      rateFormatted: '未定义',
      formulaLatex: '\\text{区间长度为 0，平均变化率未定义}',
    };
  }

  const rate = deltaY / deltaX;
  return {
    pointA: { x: x1, y: y1 },
    pointB: { x: x2, y: y2 },
    deltaX,
    deltaY,
    rate,
    rateFormatted: fmtNum(rate),
    formulaLatex: buildRateFormula(params, x1, x2, y1, y2, deltaX, deltaY, rate),
  };
}

/**
 * Derive the secant line equation through two curve points.
 * Delegates to coordinate.ts lineEquationFromTwoPoints.
 */
export function secantLineEquation(
  params: FunctionParams,
  x1: number,
  x2: number
): LineEquation {
  const y1 = evaluateFunction(params, x1);
  const y2 = evaluateFunction(params, x2);
  return lineEquationFromTwoPoints({ x: x1, y: y1 }, { x: x2, y: y2 });
}

/**
 * Check if an interval is valid (x1 !== x2).
 */
export function isValidInterval(x1: number, x2: number): boolean {
  return x1 !== x2;
}

/**
 * Format the full rate derivation as a LaTeX string.
 * Example: "\\frac{f(3) - f(-1)}{3 - (-1)} = \\frac{9 - 1}{4} = 2"
 */
export function formatRateFormulaLatex(
  params: FunctionParams,
  x1: number,
  x2: number
): string {
  const result = averageRateOfChange(params, x1, x2);
  return result.formulaLatex;
}

// --- Derivative & Tangent ---

/** Result of computing the derivative at a point. */
export interface DerivativeResult {
  x: number;
  y: number;
  slope: number;
  slopeFormatted: string;
  formulaLatex: string;
}

/**
 * Analytically compute the derivative of a function at point x.
 * linear: f'(x) = m
 * quadratic: f'(x) = 2ax + b
 * Returns a structured result — never NaN or Infinity for finite params.
 */
export function derivativeAtPoint(
  params: FunctionParams,
  x: number
): DerivativeResult {
  const y = evaluateFunction(params, x);
  let slope: number;

  if (params.type === 'linear') {
    slope = params.m;
  } else {
    // quadratic: f'(x) = 2ax + b
    slope = 2 * params.a * x + params.b;
  }

  return {
    x,
    y,
    slope,
    slopeFormatted: fmtNum(slope),
    formulaLatex: buildDerivativeFormula(params, x, slope),
  };
}

/**
 * Compute the tangent line equation at point x.
 * Tangent line: y = f(x) + f'(x) * (t - x)
 * Returns a LineEquation (reuses coordinate.ts type).
 */
export function tangentLineAt(
  params: FunctionParams,
  x: number
): LineEquation {
  const deriv = derivativeAtPoint(params, x);
  // Tangent line passes through (x, f(x)) with slope f'(x)
  const intercept = deriv.y - deriv.slope * x;
  return { kind: 'normal', slope: deriv.slope, intercept };
}

// --- Riemann Sum & Integration ---

/** Riemann sum sampling method. */
export type RiemannMethod = 'left' | 'right' | 'midpoint';

/** Geometry of a single Riemann rectangle. */
export interface RiemannRectangle {
  x: number;         // left edge x
  width: number;     // rectangle width
  sampleX: number;   // sampling point x
  sampleY: number;   // f(sampleX)
  area: number;      // width * |sampleY|
}

/** Result of computing a Riemann sum. */
export interface RiemannResult {
  rectangles: RiemannRectangle[];
  sum: number;
  sumFormatted: string;
  exact: number;
  exactFormatted: string;
  error: number;
  errorFormatted: string;
  errorPercent: string;
  method: RiemannMethod;
  n: number;
  swapped: boolean;  // true if a > b was auto-swapped
}

/**
 * Compute Riemann sum + rectangle geometries over [a, b].
 * If a > b, auto-swaps (area is positive). Sets swapped=true.
 * If a = b, returns empty rectangles and sum=0.
 * n < 1 treated as 1.
 */
export function riemannSum(
  params: FunctionParams,
  a: number,
  b: number,
  n: number,
  method: RiemannMethod
): RiemannResult {
  // a = b → zero area
  if (a === b) {
    return {
      rectangles: [],
      sum: 0,
      sumFormatted: '0',
      exact: 0,
      exactFormatted: '0',
      error: 0,
      errorFormatted: '0',
      errorPercent: '0%',
      method,
      n: 0,
      swapped: false,
    };
  }

  // Swap if a > b
  const swapped = a > b;
  const lo = swapped ? b : a;
  const hi = swapped ? a : b;

  const safeN = Math.max(1, Math.round(n));
  const width = (hi - lo) / safeN;
  const rectangles: RiemannRectangle[] = [];
  let sum = 0;

  for (let i = 0; i < safeN; i++) {
    const xLeft = lo + i * width;
    let sampleX: number;
    if (method === 'left') {
      sampleX = xLeft;
    } else if (method === 'right') {
      sampleX = xLeft + width;
    } else {
      // midpoint
      sampleX = xLeft + width / 2;
    }

    const sampleY = evaluateFunction(params, sampleX);
    const area = width * Math.abs(sampleY);
    rectangles.push({ x: xLeft, width, sampleX, sampleY, area });
    sum += width * sampleY; // signed sum for exact comparison
  }

  const exact = exactIntegral(params, lo, hi);
  const error = Math.abs(sum - exact);
  const errorPercent = exact === 0
    ? (error === 0 ? '0%' : '∞')
    : `${fmtNum((error / Math.abs(exact)) * 100)}%`;

  return {
    rectangles,
    sum,
    sumFormatted: fmtNum(sum),
    exact,
    exactFormatted: fmtNum(exact),
    error,
    errorFormatted: fmtNum(error),
    errorPercent,
    method,
    n: safeN,
    swapped,
  };
}

/**
 * Exact integral via antiderivative (analytical).
 * linear: ∫(mx + b)dx = m·x²/2 + b·x
 * quadratic: ∫(ax² + bx + c)dx = a·x³/3 + b·x²/2 + c·x
 * Returns F(b) - F(a).
 */
export function exactIntegral(
  params: FunctionParams,
  a: number,
  b: number
): number {
  return antiderivative(params, b) - antiderivative(params, a);
}

/**
 * Format the integral expression as LaTeX.
 * Example: "\\int_{0}^{3} (x^{2} + 1) \\, dx = 12"
 */
export function formatIntegralLatex(
  params: FunctionParams,
  a: number,
  b: number,
  exactValue: number
): string {
  const aStr = fmtNum(a);
  const bStr = fmtNum(b);
  const valStr = fmtNum(exactValue);

  // Build integrand string
  let integrand: string;
  if (params.type === 'linear') {
    integrand = formatLinearIntegrand(params.m, params.b);
  } else {
    integrand = formatQuadraticIntegrand(params.a, params.b, params.c);
  }

  return `\\int_{${aStr}}^{${bStr}} ${integrand} \\, dx = ${valStr}`;
}

// --- Internal helpers ---

/** Antiderivative F(x) for linear/quadratic. */
function antiderivative(params: FunctionParams, x: number): number {
  if (params.type === 'linear') {
    // F(x) = m·x²/2 + b·x
    return (params.m * x * x) / 2 + params.b * x;
  }
  // F(x) = a·x³/3 + b·x²/2 + c·x
  return (params.a * x * x * x) / 3 + (params.b * x * x) / 2 + params.c * x;
}

function formatLinearIntegrand(m: number, b: number): string {
  if (m === 0) return b === 0 ? '0' : fmtNum(b);
  const mStr = m === 1 ? '' : m === -1 ? '-' : fmtNum(m);
  const sign = b > 0 ? ' + ' : b < 0 ? ' - ' : '';
  const bStr = b === 0 ? '' : `${sign}${fmtNum(Math.abs(b))}`;
  return `(${mStr}x${bStr})`;
}

function formatQuadraticIntegrand(a: number, b: number, c: number): string {
  if (a === 0) return formatLinearIntegrand(b, c);
  const parts: string[] = [];
  if (a === 1) parts.push('x^{2}');
  else if (a === -1) parts.push('-x^{2}');
  else parts.push(`${fmtNum(a)}x^{2}`);
  if (b !== 0) {
    if (b > 0) parts.push(`+ ${b === 1 ? '' : fmtNum(b)}x`);
    else parts.push(`- ${b === -1 ? '' : fmtNum(Math.abs(b))}x`);
  }
  if (c !== 0) {
    parts.push(c > 0 ? `+ ${fmtNum(c)}` : `- ${fmtNum(Math.abs(c))}`);
  }
  return `(${parts.join(' ')})`;
}

function buildRateFormula(
  params: FunctionParams,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  deltaX: number,
  deltaY: number,
  rate: number
): string {
  const fLabel = params.type === 'linear' ? 'f' : 'f';
  const x1Str = fmtNum(x1);
  const x2Str = fmtNum(x2);
  const y1Str = fmtNum(y1);
  const y2Str = fmtNum(y2);
  const dxStr = fmtNum(deltaX);
  const dyStr = fmtNum(deltaY);
  const rateStr = fmtNum(rate);

  // Show: f(x2) - f(x1)     deltaY
  //       ───────────── = ───── = rate
  //         x2 - x1        deltaX
  return (
    `\\frac{${fLabel}(${x2Str}) - ${fLabel}(${x1Str})}{${x2Str} - (${x1Str})}` +
    ` = \\frac{${y2Str} - ${y1Str}}{${dxStr}}` +
    ` = \\frac{${dyStr}}{${dxStr}}` +
    ` = ${rateStr}`
  );
}

function buildDerivativeFormula(
  params: FunctionParams,
  x: number,
  slope: number
): string {
  const xStr = fmtNum(x);
  const slopeStr = fmtNum(slope);

  if (params.type === 'linear') {
    // f'(x) = m
    return `f'(${xStr}) = ${slopeStr}`;
  }
  // quadratic: f'(x) = 2ax + b
  const a = params.a;
  const b = params.b;
  const a2Str = fmtNum(2 * a);
  const bStr = fmtNum(b);
  return `f'(${xStr}) = 2 \\times ${fmtNum(a)} \\times ${xStr} + ${bStr} = ${a2Str} \\times ${xStr} + ${bStr} = ${slopeStr}`;
}

function fmtNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(2)).toString();
}
