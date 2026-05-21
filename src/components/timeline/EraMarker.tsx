import type { EraInfo } from '@/types/timeline';
import { colors, eraIcons } from '@/styles/tokens';

interface EraMarkerProps {
  era: EraInfo;
  x: number;
  width: number;
}

export default function EraMarker({ era, x, width }: EraMarkerProps) {
  const eraColor = colors.era[era.id] || '#6b7280';
  const icon = eraIcons[era.id] || '';

  return (
    <g>
      {/* Gradient background fade from top */}
      <defs>
        <linearGradient id={`era-bg-${era.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={eraColor} stopOpacity="0.08" />
          <stop offset="60%" stopColor={eraColor} stopOpacity="0.03" />
          <stop offset="100%" stopColor={eraColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={0}
        width={Math.max(width, 0)}
        height="100%"
        fill={`url(#era-bg-${era.id})`}
      />
      {width > 80 && (
        <text
          x={x + width / 2}
          y={28}
          textAnchor="middle"
          fill={eraColor}
          fontSize="13"
          fontWeight="600"
          opacity={0.5}
          fontFamily="var(--font-sans, Inter)"
        >
          {icon} {era.name}
        </text>
      )}
    </g>
  );
}
