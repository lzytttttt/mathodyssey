/**
 * Probability and simulation utilities for interactive experiments.
 * All functions are pure — no side effects, no DOM access.
 */

/** Generate a random integer in [1, sides]. */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/** Roll `count` dice, return array of results. */
export function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides));
}

/** Sum of values. */
export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

/**
 * Simulate rolling `diceCount` dice of `sides` faces for `trials` times.
 * Returns array of sums.
 */
export function simulateDiceSums(
  trials: number,
  diceCount: number,
  sides: number
): number[] {
  return Array.from({ length: trials }, () =>
    sum(rollDice(diceCount, sides))
  );
}

/**
 * Theoretical distribution of sum of `diceCount` dice, each with `sides` faces.
 * Returns Map<sum, probability> where probability is in [0, 1].
 */
export function diceSumDistribution(
  diceCount: number,
  sides: number
): Map<number, number> {
  // Count ways to achieve each sum using dynamic programming
  const total = Math.pow(sides, diceCount);

  // dp[i][s] = number of ways to get sum s with i dice
  let prev = new Map<number, number>();
  prev.set(0, 1);

  for (let die = 0; die < diceCount; die++) {
    const next = new Map<number, number>();
    for (const [s, count] of prev) {
      for (let face = 1; face <= sides; face++) {
        const newSum = s + face;
        next.set(newSum, (next.get(newSum) ?? 0) + count);
      }
    }
    prev = next;
  }

  const dist = new Map<number, number>();
  for (const [s, count] of prev) {
    dist.set(s, count / total);
  }
  return dist;
}

/**
 * Build frequency table from results.
 * Returns { value, count, frequency }[] for values in [min, max].
 */
export function frequencyTable(
  results: number[],
  min: number,
  max: number
): { value: number; count: number; frequency: number }[] {
  const counts = new Map<number, number>();
  for (let v = min; v <= max; v++) counts.set(v, 0);
  for (const r of results) {
    if (r >= min && r <= max) {
      counts.set(r, (counts.get(r) ?? 0) + 1);
    }
  }
  const total = results.length;
  const table: { value: number; count: number; frequency: number }[] = [];
  for (let v = min; v <= max; v++) {
    const count = counts.get(v) ?? 0;
    table.push({
      value: v,
      count,
      frequency: total > 0 ? count / total : 0,
    });
  }
  return table;
}

/**
 * Format a ratio as a percentage string, e.g. 0.1667 → "16.7%".
 * Returns "—" for zero total.
 */
export function formatPercent(ratio: number): string {
  if (!isFinite(ratio) || isNaN(ratio)) return '—';
  const pct = ratio * 100;
  if (pct >= 99.95) return '100%';
  if (pct < 0.05 && pct > 0) return '<0.1%';
  return pct.toFixed(1) + '%';
}
