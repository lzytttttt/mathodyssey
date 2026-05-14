import type { EraInfo } from '@/types/timeline';
import { colors } from '@/styles/tokens';

interface EraMarkerProps {
  era: EraInfo;
  x: number;
  width: number;
}

export default function EraMarker({ era, x, width }: EraMarkerProps) {
  const eraColor = colors.era[era.id] || '#6b7280';

  return (
    <g>
      <rect
        x={x}
        y={0}
        width={Math.max(width, 0)}
        height="100%"
        fill={eraColor}
        opacity={0.05}
      />
      {width > 80 && (
        <text
          x={x + width / 2}
          y={30}
          textAnchor="middle"
          fill={eraColor}
          fontSize="14"
          fontWeight="600"
          opacity={0.6}
        >
          {era.name}
        </text>
      )}
    </g>
  );
}
