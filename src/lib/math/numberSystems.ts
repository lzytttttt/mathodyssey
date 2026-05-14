/**
 * Number system conversion utilities for interactive experiments.
 * All functions are pure — no side effects, no DOM access.
 */

/** Clamp an integer to [min, max]. */
export function clampInteger(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Convert a non-negative integer to an array of digits in the given base.
 * Returns digits HIGH-FIRST: [1, 2, 3] means 1×base² + 2×base¹ + 3×base⁰.
 * For value 0, returns [0].
 */
export function decimalToBase(value: number, base: number): number[] {
  const v = Math.max(0, Math.round(value));
  if (v === 0) return [0];
  const digits: number[] = [];
  let n = v;
  while (n > 0) {
    digits.push(n % base);
    n = Math.floor(n / base);
  }
  digits.reverse();
  return digits;
}

/** Convert a non-negative integer to sexagesimal (base-60) digits, high-first. */
export function decimalToSexagesimal(value: number): number[] {
  return decimalToBase(value, 60);
}

/**
 * Format sexagesimal digits as a string: "1;2;3".
 * Always shows all digits, separated by semicolons.
 */
export function formatSexagesimal(digits: number[]): string {
  return digits.join(';');
}

/**
 * Convert a total number of seconds into hours, minutes, seconds.
 */
export function decimalSecondsToHMS(totalSeconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
  display: string;
} {
  const s = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} 小时`);
  if (minutes > 0) parts.push(`${minutes} 分`);
  parts.push(`${seconds} 秒`);
  return { hours, minutes, seconds, display: parts.join(' ') };
}

/**
 * Break down a value into place-value components for the given base.
 * Returns an array (high-first) of { digit, weight, product }.
 * weight = base^position, product = digit × weight.
 */
export function placeValueBreakdown(
  value: number,
  base: number
): { digit: number; weight: number; product: number }[] {
  const digits = decimalToBase(value, base);
  const len = digits.length;
  return digits.map((digit, i) => {
    const power = len - 1 - i;
    const weight = Math.pow(base, power);
    return { digit, weight, product: digit * weight };
  });
}
