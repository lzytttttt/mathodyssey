'use client';

interface PlaceValueBlocksProps {
  breakdown: { digit: number; weight: number; product: number }[];
  base: number;
}

/**
 * Visualizes place-value decomposition as horizontal bars.
 * Each bar's width is proportional to its product value.
 * Labels show digit × weight = product.
 */
export default function PlaceValueBlocks({
  breakdown,
  base,
}: PlaceValueBlocksProps) {
  if (breakdown.length === 0) return null;

  const maxProduct = Math.max(...breakdown.map((b) => b.product), 1);

  return (
    <div className="space-y-2">
      {breakdown.map((item, i) => {
        const widthPct = maxProduct > 0
          ? Math.max(2, (item.product / maxProduct) * 100)
          : 2;
        const power = breakdown.length - 1 - i;
        return (
          <div key={i} className="flex items-center gap-3">
            {/* Bar */}
            <div className="flex-1">
              <div
                className="h-7 rounded bg-blue-400 transition-all duration-200"
                style={{ width: `${widthPct}%`, minWidth: item.product > 0 ? '8px' : '0' }}
              />
            </div>
            {/* Label */}
            <div className="text-sm text-stone-600 w-44 text-right shrink-0 font-mono">
              {item.digit}×{base}<sup>{power}</sup> = {item.product}
            </div>
          </div>
        );
      })}
    </div>
  );
}
