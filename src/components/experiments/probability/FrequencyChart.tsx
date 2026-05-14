'use client';

import { formatPercent } from '@/lib/math/probability';

interface FrequencyChartProps {
  /** Frequency table: { value, count, frequency }[] */
  observed: { value: number; count: number; frequency: number }[];
  /** Theoretical distribution: Map<sum, probability> */
  theoretical: Map<number, number>;
  /** Total number of trials */
  totalTrials: number;
}

/**
 * Bar chart showing observed frequency vs theoretical probability
 * for two-dice sum (2-12). Uses div-based bars for simplicity.
 */
export default function FrequencyChart({
  observed,
  theoretical,
  totalTrials,
}: FrequencyChartProps) {
  // Find max for scaling — use the larger of observed/theoretical
  let maxVal = 0;
  for (const row of observed) {
    const theo = theoretical.get(row.value) ?? 0;
    maxVal = Math.max(maxVal, row.frequency, theo);
  }
  if (maxVal === 0) maxVal = 0.2; // default scale when empty

  return (
    <div className="space-y-1">
      {/* Chart area */}
      <div className="flex items-end gap-1 h-40">
        {observed.map((row) => {
          const theo = theoretical.get(row.value) ?? 0;
          const barPct = (row.frequency / maxVal) * 100;
          const theoPct = (theo / maxVal) * 100;
          const isMax = row.value === 7;

          return (
            <div
              key={row.value}
              className="flex-1 flex flex-col items-center justify-end h-full relative"
            >
              {/* Theoretical probability marker */}
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-amber-400"
                style={{ bottom: `${theoPct}%` }}
                title={`理论概率: ${formatPercent(theo)}`}
              />
              {/* Observed bar */}
              <div
                className={`w-full rounded-t transition-all duration-150 ${
                  isMax ? 'bg-blue-500' : 'bg-blue-300'
                }`}
                style={{ height: `${Math.max(0, barPct)}%`, minHeight: row.count > 0 ? '2px' : '0' }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1">
        {observed.map((row) => (
          <div
            key={row.value}
            className={`flex-1 text-center text-xs font-mono ${
              row.value === 7 ? 'font-bold text-blue-700' : 'text-stone-500'
            }`}
          >
            {row.value}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs text-stone-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-blue-300 rounded-sm" />
          实验频率
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-0 border-t-2 border-dashed border-amber-400" />
          理论概率
        </span>
      </div>

      {/* Detail table */}
      {totalTrials > 0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-stone-500">
                <th className="py-1 px-1 text-left">点数和</th>
                <th className="py-1 px-1 text-right">次数</th>
                <th className="py-1 px-1 text-right">实验频率</th>
                <th className="py-1 px-1 text-right">理论概率</th>
              </tr>
            </thead>
            <tbody>
              {observed.map((row) => {
                const theo = theoretical.get(row.value) ?? 0;
                const isMax = row.value === 7;
                return (
                  <tr
                    key={row.value}
                    className={isMax ? 'bg-blue-50 font-medium' : ''}
                  >
                    <td className="py-0.5 px-1 font-mono">{row.value}</td>
                    <td className="py-0.5 px-1 text-right font-mono">{row.count}</td>
                    <td className="py-0.5 px-1 text-right font-mono">
                      {formatPercent(row.frequency)}
                    </td>
                    <td className="py-0.5 px-1 text-right font-mono">
                      {formatPercent(theo)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
