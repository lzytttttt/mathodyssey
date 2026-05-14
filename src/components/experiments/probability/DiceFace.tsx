interface DiceFaceProps {
  /** Die value 1-6 */
  value: number;
  /** Size in pixels */
  size?: number;
}

/**
 * SVG dice face rendering. Draws standard pip layouts for values 1-6.
 */
export default function DiceFace({ value, size = 56 }: DiceFaceProps) {
  const s = size;
  const r = s * 0.09; // pip radius
  const pad = s * 0.22; // padding from edge
  const mid = s / 2;
  const lx = pad;
  const rx = s - pad;
  const ty = pad;
  const by = s - pad;

  // Pip positions for each face value
  const pipMap: Record<number, [number, number][]> = {
    1: [[mid, mid]],
    2: [[lx, ty], [rx, by]],
    3: [[lx, ty], [mid, mid], [rx, by]],
    4: [[lx, ty], [rx, ty], [lx, by], [rx, by]],
    5: [[lx, ty], [rx, ty], [mid, mid], [lx, by], [rx, by]],
    6: [[lx, ty], [rx, ty], [lx, mid], [rx, mid], [lx, by], [rx, by]],
  };

  const pips = pipMap[Math.max(1, Math.min(6, Math.round(value)))] ?? pipMap[1];

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <rect
        x="1"
        y="1"
        width={s - 2}
        height={s - 2}
        rx={s * 0.12}
        ry={s * 0.12}
        fill="white"
        stroke="#d6d3d1"
        strokeWidth="2"
      />
      {pips.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#44403c" />
      ))}
    </svg>
  );
}
