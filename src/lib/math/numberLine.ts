/**
 * Number line utilities for interactive experiments.
 * All functions are pure — no side effects, no DOM access.
 */

/** Clamp a value to [min, max]. */
export function clampNumberLineValue(
  value: number,
  min: number,
  max: number
): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Convert a numeric value to an SVG x-coordinate on the number line.
 * @param value The numeric value
 * @param min Minimum of the visible range
 * @param max Maximum of the visible range
 * @param width SVG width in pixels
 * @param padLeft Left padding in pixels
 * @param padRight Right padding in pixels
 */
export function numberLinePosition(
  value: number,
  min: number,
  max: number,
  width: number,
  padLeft: number,
  padRight: number
): number {
  const usable = width - padLeft - padRight;
  return padLeft + ((value - min) / (max - min)) * usable;
}

/** Return the opposite number (-value). */
export function oppositeNumber(value: number): number {
  return -value;
}

/** Return the absolute distance from zero (|value|). */
export function absoluteDistance(value: number): number {
  return Math.abs(value);
}

/**
 * Perform an operation on the number line.
 * @returns The result value (may exceed the visible range).
 */
export function numberLineOperation(
  start: number,
  delta: number,
  operation: 'add' | 'subtract'
): number {
  return operation === 'add' ? start + delta : start - delta;
}

/**
 * Compute step-by-step explanation for a number line operation.
 * The result may exceed the visible range — it is NOT clamped.
 */
export function numberLineOperationSteps(
  start: number,
  delta: number,
  operation: 'add' | 'subtract'
): {
  start: number;
  delta: number;
  operation: 'add' | 'subtract';
  effectiveDelta: number;
  direction: 'right' | 'left';
  distance: number;
  result: number;
  startLabel: string;
  moveLabel: string;
  resultLabel: string;
  equation: string;
  subtractionExplanation: string;
} {
  const effectiveDelta = operation === 'add' ? delta : -delta;
  const direction: 'right' | 'left' = effectiveDelta >= 0 ? 'right' : 'left';
  const distance = Math.abs(effectiveDelta);
  const result = start + effectiveDelta;

  const opSymbol = operation === 'add' ? '+' : '-';
  const deltaLabel = delta < 0 ? `(${delta})` : String(delta);

  const dirLabel = direction === 'right' ? '向右' : '向左';

  return {
    start,
    delta,
    operation,
    effectiveDelta,
    direction,
    distance,
    result,
    startLabel: `起点 ${start}`,
    moveLabel: `${dirLabel}移动 ${distance} 步`,
    resultLabel: `到达 ${result}`,
    equation: `${start} ${opSymbol} ${deltaLabel} = ${result}`,
    subtractionExplanation:
      operation === 'subtract'
        ? `${start} ${opSymbol} ${deltaLabel} = ${start} + ${effectiveDelta >= 0 && effectiveDelta !== delta ? effectiveDelta : `(${effectiveDelta})`} = ${result}`
        : '',
  };
}
