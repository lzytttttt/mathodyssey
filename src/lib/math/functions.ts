/**
 * Function evaluation and curve sampling utilities.
 * All functions are pure — no side effects, no DOM access.
 * Phase 3.1: supports linear and quadratic functions only.
 */

/** Supported function types. */
export type FunctionType = 'linear' | 'quadratic';

/** Function parameters — discriminated union by type. */
export type FunctionParams =
  | { type: 'linear'; m: number; b: number }
  | { type: 'quadratic'; a: number; b: number; c: number };

/** A sampled point on a curve, with validity flag. */
export interface SamplePoint {
  x: number;
  y: number;
  valid: boolean;
}

/** Analytical features of a function. */
export interface FunctionFeatures {
  zeros: number[];
  yIntercept: number;
  vertex?: { x: number; y: number };
}

/**
 * Evaluate a function at a given x value.
 * For quadratic with a=0, degenerates to linear (b*x + c).
 */
export function evaluateFunction(
  params: FunctionParams,
  x: number
): number {
  if (params.type === 'linear') {
    return params.m * x + params.b;
  }
  // quadratic: a*x^2 + b*x + c
  return params.a * x * x + params.b * x + params.c;
}

/**
 * Sample a function over [xMin, xMax] at the given step size.
 * Returns an array of SamplePoint with valid=false for NaN/Infinity values.
 * Default step is 0.1.
 */
export function sampleCurve(
  params: FunctionParams,
  xMin: number,
  xMax: number,
  step: number = 0.1
): SamplePoint[] {
  const points: SamplePoint[] = [];
  // Use a small epsilon to avoid floating-point accumulation errors
  const steps = Math.round((xMax - xMin) / step);
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step;
    const y = evaluateFunction(params, x);
    points.push({ x, y, valid: Number.isFinite(y) });
  }
  return points;
}

/**
 * Split a sampled curve into continuous segments of valid points.
 * Each segment is a contiguous run of valid SamplePoints.
 * Invalid points (NaN/Infinity) create segment breaks.
 */
export function filterValidSegments(
  points: SamplePoint[]
): SamplePoint[][] {
  const segments: SamplePoint[][] = [];
  let current: SamplePoint[] = [];

  for (const p of points) {
    if (p.valid) {
      current.push(p);
    } else {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    }
  }

  if (current.length > 0) {
    segments.push(current);
  }

  return segments;
}

/**
 * Find analytical features of a function: zeros, y-intercept, vertex.
 * For quadratic with a=0, treats as linear (b*x + c).
 */
export function findFunctionFeatures(
  params: FunctionParams
): FunctionFeatures {
  if (params.type === 'linear') {
    return linearFeatures(params.m, params.b);
  }
  return quadraticFeatures(params.a, params.b, params.c);
}

function linearFeatures(m: number, b: number): FunctionFeatures {
  const yIntercept = b;
  const zeros: number[] = [];
  if (m !== 0) {
    zeros.push(-b / m);
  } else if (b === 0) {
    // y = 0: every x is a zero; represent as empty (infinite zeros)
    // The UI should handle this case specially
  }
  return { zeros, yIntercept };
}

function quadraticFeatures(
  a: number,
  b: number,
  c: number
): FunctionFeatures {
  // Degenerate case: a=0 → linear (b*x + c)
  if (a === 0) {
    return linearFeatures(b, c);
  }

  const yIntercept = c;

  // Vertex: x = -b/(2a), y = f(x)
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const vertex = { x: vertexX, y: vertexY };

  // Zeros: solve ax^2 + bx + c = 0
  const discriminant = b * b - 4 * a * c;
  const zeros: number[] = [];

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    zeros.push((-b + sqrtD) / (2 * a));
    zeros.push((-b - sqrtD) / (2 * a));
    zeros.sort((x, y) => x - y);
  } else if (discriminant === 0) {
    zeros.push(-b / (2 * a));
  }
  // discriminant < 0: no real zeros

  return { zeros, yIntercept, vertex };
}

/**
 * Format a function equation as a human-readable string.
 * Examples: "y = 2x + 1", "y = -x² + 4", "y = x²"
 */
export function formatEquation(params: FunctionParams): string {
  if (params.type === 'linear') {
    return formatLinearEquation(params.m, params.b);
  }
  return formatQuadraticEquation(params.a, params.b, params.c);
}

/**
 * Format a function equation as a LaTeX string for KaTeX rendering.
 * Examples: "y = 2x + 1", "y = -x^{2} + 4", "y = x^{2}"
 */
export function formatEquationLatex(params: FunctionParams): string {
  if (params.type === 'linear') {
    return formatLinearLatex(params.m, params.b);
  }
  return formatQuadraticLatex(params.a, params.b, params.c);
}

/**
 * Describe the effect of a named parameter.
 * Returns a short explanation string for the result panel.
 */
export function describeParameter(
  type: FunctionType,
  paramName: string
): string {
  if (type === 'linear') {
    switch (paramName) {
      case 'm':
        return 'm 控制斜率：m > 0 曲线上升，m < 0 曲线下降，m = 0 水平';
      case 'b':
        return 'b 控制 y 轴截距：直线与 y 轴的交点为 (0, b)';
      default:
        return '';
    }
  }
  // quadratic
  switch (paramName) {
    case 'a':
      return 'a 控制开口方向：a > 0 开口向上，a < 0 开口向下；|a| 越大越窄';
    case 'b':
      return 'b 控制对称轴位置：对称轴 x = -b/(2a)';
    case 'c':
      return 'c 控制 y 轴截距：抛物线与 y 轴的交点为 (0, c)';
    default:
      return '';
  }
}

// --- Internal formatting helpers ---

function formatLinearEquation(m: number, b: number): string {
  if (m === 0) {
    return b === 0 ? 'y = 0' : `y = ${fmtNum(b)}`;
  }
  const mStr = m === 1 ? '' : m === -1 ? '-' : fmtNum(m);
  const sign = b > 0 ? ' + ' : b < 0 ? ' - ' : '';
  const bStr = b === 0 ? '' : `${sign}${fmtNum(Math.abs(b))}`;
  return `y = ${mStr}x${bStr}`;
}

function formatLinearLatex(m: number, b: number): string {
  if (m === 0) {
    return b === 0 ? 'y = 0' : `y = ${fmtNum(b)}`;
  }
  const mStr = m === 1 ? '' : m === -1 ? '-' : fmtNum(m);
  const sign = b > 0 ? ' + ' : b < 0 ? ' - ' : '';
  const bStr = b === 0 ? '' : `${sign}${fmtNum(Math.abs(b))}`;
  return `y = ${mStr}x${bStr}`;
}

function formatQuadraticEquation(
  a: number,
  b: number,
  c: number
): string {
  if (a === 0) {
    return formatLinearEquation(b, c);
  }

  const parts: string[] = [];

  // ax^2 term
  if (a === 1) parts.push('x²');
  else if (a === -1) parts.push('-x²');
  else parts.push(`${fmtNum(a)}x²`);

  // bx term
  if (b !== 0) {
    if (b > 0) parts.push(`+ ${b === 1 ? '' : fmtNum(b)}x`);
    else parts.push(`- ${b === -1 ? '' : fmtNum(Math.abs(b))}x`);
  }

  // c term
  if (c !== 0) {
    parts.push(c > 0 ? `+ ${fmtNum(c)}` : `- ${fmtNum(Math.abs(c))}`);
  }

  return `y = ${parts.join(' ')}`;
}

function formatQuadraticLatex(
  a: number,
  b: number,
  c: number
): string {
  if (a === 0) {
    return formatLinearLatex(b, c);
  }

  const parts: string[] = [];

  // ax^2 term
  if (a === 1) parts.push('x^{2}');
  else if (a === -1) parts.push('-x^{2}');
  else parts.push(`${fmtNum(a)}x^{2}`);

  // bx term
  if (b !== 0) {
    if (b > 0) parts.push(`+ ${b === 1 ? '' : fmtNum(b)}x`);
    else parts.push(`- ${b === -1 ? '' : fmtNum(Math.abs(b))}x`);
  }

  // c term
  if (c !== 0) {
    parts.push(c > 0 ? `+ ${fmtNum(c)}` : `- ${fmtNum(Math.abs(c))}`);
  }

  return `y = ${parts.join(' ')}`;
}

/** Format a number, trimming unnecessary trailing zeros. */
function fmtNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(2)).toString();
}
